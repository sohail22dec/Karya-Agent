from typing import Annotated, TypedDict
from langgraph.graph.message import add_messages
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(description="The message from the user to the agent.")


class ChatResponse(BaseModel):
    response: str = Field(description="The response from the agent.")


class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
