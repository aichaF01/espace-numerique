from pydantic import BaseModel

class ChatRequest(BaseModel):
    prompt: str
    model: str = "llama3"


class ChatResponse(BaseModel):
    response: str