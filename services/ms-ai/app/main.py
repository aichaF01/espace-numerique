from fastapi import FastAPI
from app.routes import router

app = FastAPI(title="Ollama Microservice")

app.include_router(router)