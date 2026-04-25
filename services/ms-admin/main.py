from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from cassandra.cluster import Cluster
from keycloak import KeycloakAdmin
import httpx
from fastapi.security import OAuth2PasswordBearer
import uuid
import urllib.parse
from minio import Minio 
from minio.error import S3Error

app = FastAPI(title="MS Admin - User & Course Management")

KEYCLOAK_URL = "http://keycloak:8080"
REALM = "espace-numerique"
AUTH_SERVICE = "http://ms-auth:8005"
BUCKET = "courses"

client = Minio(
    "minio:9000",
    access_key="admin",
    secret_key="password123",
    secure=False
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

class UserSession:
    def __init__(self, data: dict):
        self.user_id = data.get("user_id")
        self.username = data.get("username")
        self.roles = data.get("roles", [])
        
# --- MODIFICATION DE LA DÉPENDANCE ---
def get_current_user(token: str = Depends(oauth2_scheme)):
    if not token:
        raise HTTPException(status_code=401, detail="Missing token")

    r = httpx.get(
        f"{AUTH_SERVICE}/verify",
        headers={"Authorization": f"Bearer {token}"}
    )

    if r.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid token")

    # Ton MS Auth renvoie {"valid": True, "user_id": ..., "roles": [...]}
    data = r.json()
    
    # On extrait les rôles
    roles = data.get("roles", [])
    data["roles"] = roles
    return UserSession(data)

# --- FONCTION POUR LES ROUTES STRICTEMENT ADMIN (Users) ---
def require_admin(user=Depends(get_current_user)):
    if "admin" not in user.roles:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# --- FONCTION POUR LES ROUTES PROF OU ADMIN (Courses) ---
def require_prof_or_admin(user=Depends(get_current_user)):
    if "prof" not in user.roles and "admin" not in user.roles:
        raise HTTPException(status_code=403, detail="Prof or Admin role required")
    return user

def require_any_role(user=Depends(get_current_user)):
    # On autorise si l'utilisateur a au moins un des rôles valides du système
    allowed = ["admin", "prof", "etudiant"]
    if not any(role in allowed for role in user.roles):
        raise HTTPException(status_code=403, detail="Access denied: valid role required")
    return user

keycloak_admin = KeycloakAdmin(
    server_url=KEYCLOAK_URL,
    username="admin",
    password="admin",
    realm_name="espace-numerique",
    user_realm_name="master",
    client_id="admin-cli",
    verify=True
)


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
    password text,
    role text
)
""")

############################################################ COURSES TABLE ######################################################
session.execute("""
CREATE TABLE IF NOT EXISTS courses (
    id text PRIMARY KEY,
    title text,
    description text,
    instructor text,
    file_url text
)
""")


class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: str


class UserUpdate(BaseModel):
    username: str
    email: str


class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    role: str


class CourseCreate(BaseModel):
    title: str
    description: str
    file_url: str


class CourseUpdate(BaseModel):
    title: str
    description: str
    file_url: str


class CourseResponse(BaseModel):
    id: str
    title: str
    description: str
    instructor: str
    file_url: str


@app.get("/health")
def health():
    return {"status": "ok"}


########################################################################## USERRS ####################################################
@app.post("/users", response_model=UserResponse)
def create_user(user: UserCreate, admin=Depends(require_admin)):
    user_payload = {
        "username": user.username,
        "email": user.email,
        "enabled": True,
        "emailVerified": True,
        "firstName": user.username.capitalize(),
        "lastName": "EST-Sale",
        "requiredActions": []
    }

    try:
        user_id = keycloak_admin.create_user(user_payload)
        
        keycloak_admin.set_user_password(
            user_id=user_id, 
            password=user.password, 
            temporary=False
        )

        role_info = keycloak_admin.get_realm_role(user.role)
        keycloak_admin.assign_realm_roles(user_id=user_id, roles=[role_info])

        session.execute(
            "INSERT INTO users (id, username, email, password, role) VALUES (%s, %s, %s, %s, %s)",
            (str(user_id), user.username, user.email, user.password, user.role)
        )

        return UserResponse(id=str(user_id), username=user.username, email=user.email, role=user.role)

    except Exception as e:
        print(f"Erreur lors de la création : {e}")
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/users", response_model=List[UserResponse])
def get_users(admin=Depends(require_admin)):

    rows = session.execute("SELECT * FROM users")

    return [
        UserResponse(id=row.id, username=row.username, email=row.email, role=row.role)
        for row in rows
    ]

@app.put("/users/{user_id}")
def update_user(user_id: str, user: UserUpdate, admin=Depends(require_admin)):

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
def delete_user(user_id: str, admin=Depends(require_admin)):

    keycloak_admin.delete_user(user_id)

    session.execute(
        "DELETE FROM users WHERE id=%s",
        (user_id,)
    )

    return {"message": "User deleted"}


######################################################################## COURSES #########################################################################
@app.post("/courses", response_model=CourseResponse)
def create_course(course: CourseCreate, user=Depends(require_prof_or_admin)):
    course_id = str(uuid.uuid4())
    instructor_name = user.username
    session.execute(
        "INSERT INTO courses (id, title, description, instructor, file_url) VALUES (%s, %s, %s, %s, %s)",
        (course_id, course.title, course.description, instructor_name, course.file_url)
    )

    return CourseResponse(
        id=course_id,
        title=course.title,
        description=course.description,
        instructor=instructor_name,
        file_url=course.file_url
    )

@app.get("/courses", response_model=List[CourseResponse])
def get_courses(user=Depends(require_any_role)):

    rows = session.execute("SELECT * FROM courses")

    return [
        CourseResponse(
            id=row.id,
            title=row.title,
            description=row.description,
            instructor=row.instructor,
            file_url=row.file_url
        )
        for row in rows
    ]

@app.put("/courses/{course_id}")
def update_course(course_id: str, course: CourseUpdate, user=Depends(require_prof_or_admin)):
    instructor_name = user.username
    row = session.execute("SELECT file_url FROM courses WHERE id=%s", (course_id,)).one()
    
    if row and row.file_url:
        try:
            path = urllib.parse.urlparse(row.file_url).path
            old_filename = path.split('/')[-1]
            
            new_path = urllib.parse.urlparse(course.file_url).path
            new_filename = new_path.split('/')[-1]
            
            if old_filename != new_filename:
                client.remove_object(BUCKET, old_filename)
                print(f"Ancien fichier {old_filename} supprimé de MinIO.")
        except Exception as e:
            print(f"Erreur lors de la suppression MinIO: {e}")
    session.execute(
        "UPDATE courses SET title=%s, description=%s, instructor=%s, file_url=%s WHERE id=%s",
        (course.title, course.description, instructor_name, course.file_url, course_id)
    )

    return {"message": "Course updated and old storage cleaned"}

@app.delete("/courses/{course_id}")
def delete_course(course_id: str, admin=Depends(require_prof_or_admin)):
    row = session.execute("SELECT file_url FROM courses WHERE id=%s", (course_id,)).one()
    if row and row.file_url:
        try:
            filename = urllib.parse.urlparse(row.file_url).path.split('/')[-1]
            client.remove_object(BUCKET, filename)
        except:
            pass

    session.execute("DELETE FROM courses WHERE id=%s", (course_id,))
    return {"message": "Course and associated file deleted"}
