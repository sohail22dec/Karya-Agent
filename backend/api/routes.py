from fastapi import APIRouter
from schemas import ChatRequest
from core.agent import call_model

router = APIRouter()


@router.get("/")
def read_root():
    return {"message": "Chatbot Backend is running!"}


@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    response = await call_model(request)
    return response
