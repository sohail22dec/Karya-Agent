from fastapi import APIRouter
from schemas import ChatRequest
from core.agent import call_model, get_thread_history

router = APIRouter()


@router.get("/")
def read_root():
    return {"message": "Chatbot Backend is running!"}


@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    response = await call_model(request)
    return response

@router.get("/history/{thread_id}")
async def history_endpoint(thread_id: str):
    history = await get_thread_history(thread_id)
    return {"messages": history}
