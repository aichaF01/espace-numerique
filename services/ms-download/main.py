from fastapi import FastAPI, HTTPException
from minio import Minio
from minio.error import S3Error

app = FastAPI()

client = Minio(
    "minio:9000",
    access_key="admin",
    secret_key="password123",
    secure=False
)

BUCKET = "uploads"

@app.get("/download/{filename}")
def download_file(filename: str):
    try:
        url = client.presigned_get_object(
            BUCKET,
            filename,
            expires=3600  # link valid 1h
        )

        return {
            "filename": filename,
            "url": url
        }

    except S3Error as e:
        raise HTTPException(status_code=404, detail="File not found")