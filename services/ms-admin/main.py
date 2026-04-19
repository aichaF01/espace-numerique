from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from cassandra.cluster import Cluster
from keycloak import KeycloakAdmin
import httpx
from fastapi.security import OAuth2PasswordBearer
import uuid
app = FastAPI(title="MS Admin - User & Course Management")
KEYCLOAK_URL = "http://keycloak:8080"
REALM = "espace-numerique"
AUTH_SERVICE = "http://ms-auth:8005"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
def verify_admin(token: str = Depends(oauth2_scheme)):
    if not token:
        raise HTTPException(status_code=401, detail="Missing token")

    r = httpx.get(
        f"{AUTH_SERVICE}/verify",
        headers={"Authorization": f"Bearer {token}"}
    )

    if r.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = r.json()

    roles = user.get("roles") or user.get("realm_access", {}).get("roles", [])

    if "admin" not in roles:
        raise HTTPException(status_code=403, detail="Admin required")

    user["roles"] = roles
    return user

keycloak_admin = KeycloakAdmin(
    server_url=KEYCLOAK_URL,
    username="admin",
    password="admin",
    realm_name="master",
    client_id="admin-cli",
)

keycloak_admin.realm_name = REALM


############################################################ CASSANDRA ##################################################################
cluster = Cluster(["cassandra"])
session = cluster.connect()
session.execute("""
CREATE KEYSPACE IF NOT EXISTS mykeyspace
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}
""")
session.set_keyspace("mykeyspace")

############################################################ USERS TABLE ######################################################
session.execute("""
CREATE TABLE IF NOT EXISTS users (
    id text PRIMARY KEY,
    username text,
    email text,
    password text
)
""")

############################################################ COURSES TABLE ######################################################
session.execute("""
CREATE TABLE IF NOT EXISTS courses (
    id text PRIMARY KEY,
    title text,
    description text,
    instructor text
)
""")


class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserUpdate(BaseModel):
    username: str
    email: str


class UserResponse(BaseModel):
    id: str
    username: str
    email: str


class CourseCreate(BaseModel):
    title: str
    description: str
    instructor: str


class CourseUpdate(BaseModel):
    title: str
    description: str
    instructor: str


class CourseResponse(BaseModel):
    id: str
    title: str
    description: str
    instructor: str


@app.get("/health")
def health():
    return {"status": "ok"}


########################################################################## USERRS ####################################################
@app.post("/users", response_model=UserResponse)
def create_user(user: UserCreate, admin=Depends(verify_admin)):

    user_id = keycloak_admin.create_user({
        "username": user.username,
        "email": user.email,
        "enabled": True,
        "credentials": [{
            "type": "password",
            "value": user.password,
            "temporary": False
        }]
    })

    session.execute(
        "INSERT INTO users (id, username, email, password) VALUES (%s, %s, %s, %s)",
        (str(user_id), user.username, user.email, user.password)
    )

    return UserResponse(id=str(user_id), username=user.username, email=user.email)

@app.get("/users", response_model=List[UserResponse])
def get_users(admin=Depends(verify_admin)):

    rows = session.execute("SELECT * FROM users")

    return [
        UserResponse(id=row.id, username=row.username, email=row.email)
        for row in rows
    ]

@app.put("/users/{user_id}")
def update_user(user_id: str, user: UserUpdate, admin=Depends(verify_admin)):

    keycloak_admin.update_user(user_id, {
        "username": user.username,
        "email": user.email
    })

    session.execute(
        "UPDATE users SET username=%s, email=%s WHERE id=%s",
        (user.username, user.email, user_id)
    )

    return {"message": "User updated"}

@app.delete("/users/{user_id}")
def delete_user(user_id: str, admin=Depends(verify_admin)):

    keycloak_admin.delete_user(user_id)

    session.execute(
        "DELETE FROM users WHERE id=%s",
        (user_id,)
    )

    return {"message": "User deleted"}


######################################################################## COURSES #########################################################################
@app.post("/courses", response_model=CourseResponse)
def create_course(course: CourseCreate, admin=Depends(verify_admin)):

    course_id = str(uuid.uuid4())

    session.execute(
        "INSERT INTO courses (id, title, description, instructor) VALUES (%s, %s, %s, %s)",
        (course_id, course.title, course.description, course.instructor)
    )

    return CourseResponse(
        id=course_id,
        title=course.title,
        description=course.description,
        instructor=course.instructor
    )

@app.get("/courses", response_model=List[CourseResponse])
def get_courses(admin=Depends(verify_admin)):

    rows = session.execute("SELECT * FROM courses")

    return [
        CourseResponse(
            id=row.id,
            title=row.title,
            description=row.description,
            instructor=row.instructor
        )
        for row in rows
    ]

@app.put("/courses/{course_id}")
def update_course(course_id: str, course: CourseUpdate, admin=Depends(verify_admin)):

    session.execute(
        "UPDATE courses SET title=%s, description=%s, instructor=%s WHERE id=%s",
        (course.title, course.description, course.instructor, course_id)
    )

    return {"message": "Course updated"}

@app.delete("/courses/{course_id}")
def delete_course(course_id: str, admin=Depends(verify_admin)):

    session.execute(
        "DELETE FROM courses WHERE id=%s",
        (course_id,)
    )

    return {"message": "Course deleted"}