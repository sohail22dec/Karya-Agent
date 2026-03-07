from typing import Annotated, TypedDict
from langgraph.graph.message import add_messages
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(description="The message from the user to the agent.")
    thread_id: str = Field(description="The unique ID for the conversation thread.")


class ChatResponse(BaseModel):
    id: str
    role: str
    content: str


class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
