from fastapi import FastAPI, HTTPException
from minio import Minio
from minio.error import S3Error
from datetime import timedelta

app = FastAPI()

client = Minio(
    "minio:9000",
    access_key="admin",
    secret_key="password123",
    secure=False
)

BUCKET = "courses"

@app.get("/{filename}")
def download_file(filename: str):
    try:
        client.stat_object(BUCKET, filename)

        url = client.get_presigned_url(
            "GET",
            BUCKET,
            filename,
            expires=timedelta(hours=1)
        )

        return {
            "filename": filename,
            "download_url": url
        }

    except S3Error:
        raise HTTPException(status_code=404, detail="Fichier introuvable")
    except Exception as e:
        print(f"Erreur Download: {e}")
        raise HTTPException(status_code=500, detail=str(e))