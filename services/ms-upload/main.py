from fastapi import FastAPI, UploadFile, File, Header, HTTPException # <-- CORRIGÉ : Tout vient de fastapi
from minio import Minio
from minio.error import S3Error
from datetime import timedelta
import io
import httpx

app = FastAPI()

client = Minio(
    "minio:9000",
    access_key="admin",
    secret_key="password123",
    secure=False
)

BUCKET = "courses"

try:
    if not client.bucket_exists(BUCKET):
        client.make_bucket(BUCKET)
except S3Error as e:
    print("Erreur MinIO:", e)

AUTH_SERVICE = "http://ms-auth:8005"

async def verify_user_role(authorization: str):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization Header")
    
    async with httpx.AsyncClient() as client_http:
        r = await client_http.get(
            f"{AUTH_SERVICE}/verify",
            headers={"Authorization": authorization}
        )
    
    if r.status_code != 200:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    user_data = r.json()
    roles = user_data.get("roles", [])
    if "prof" not in roles and "admin" not in roles:
        raise HTTPException(status_code=403, detail="Role 'prof' or 'admin' required")
    return user_data

@app.post("/")
async def upload(
    file: UploadFile = File(...),
    authorization: str = Header(None)
):
    await verify_user_role(authorization)
    try:
        content = await file.read()

        client.put_object(
            BUCKET,
            file.filename,
            io.BytesIO(content),
            length=len(content),
            content_type=file.content_type
        )

        url = client.get_presigned_url(
            "GET",
            BUCKET,
            file.filename,
            expires=timedelta(days=7)
        )

        return {
            "message": "Fichier prêt ✅",
            "filename": file.filename,
            "url": url
        }

    except Exception as e:
        print(f"Erreur Upload: {e}")
        return {"error": str(e)}