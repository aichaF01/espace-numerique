from fastapi import FastAPI
from routes import router

app = FastAPI(title="Ollama Microservice")

app.include_router(router)