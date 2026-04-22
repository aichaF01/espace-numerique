from fastapi import FastAPI, UploadFile, File
from minio import Minio
from minio.error import S3Error
from datetime import timedelta
import io

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

@app.post("/")
async def upload(file: UploadFile = File(...)):
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