from fastapi import FastAPI, UploadFile, File
from minio import Minio
from minio.error import S3Error
import io

app = FastAPI()

# connection MinIO (important)
client = Minio(
    "minio:9000",   # ⚠️ ماشي localhost
    access_key="admin",
    secret_key="password123",
    secure=False
)

BUCKET = "uploads"

# create bucket if not exists
try:
    if not client.bucket_exists(BUCKET):
        client.make_bucket(BUCKET)
except S3Error as e:
    print("MinIO error:", e)

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    content = await file.read()

    client.put_object(
        BUCKET,
        file.filename,
        io.BytesIO(content),
        length=len(content),
        content_type=file.content_type
    )

    return {
        "filename": file.filename,
        "message": "uploaded to MinIO ✅"
    }