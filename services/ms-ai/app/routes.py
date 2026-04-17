from fastapi import APIRouter
from app.models import ChatRequest, ChatResponse
from app.ollma_service import generate_response, get_models

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    result = generate_response(req.prompt, req.model)
    return ChatResponse(response=result)


@router.get("/model")
def getModel():
    result = get_models()
    return result

@router.get("/health")
def health():
    return {"status": "ok"}