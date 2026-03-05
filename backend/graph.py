from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from models import AgentState

load_dotenv()

llm = ChatGroq(model_name="llama-3.3-70b-versatile", temperature=0.7)

SYSTEM_MESSAGE = SystemMessage(
    content="You are a helpful AI assistant. Answer concisely and accurately.",
    id="system_message_1",
)


async def call_model_node(state: AgentState):
    response = await llm.ainvoke(state["messages"])
    return {"messages": [response]}


builder = StateGraph(AgentState)
builder.add_node("agent", call_model_node)
builder.add_edge(START, "agent")
builder.add_edge("agent", END)

memory = MemorySaver()
graph = builder.compile(checkpointer=memory)
