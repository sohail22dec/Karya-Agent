from langchain_core.messages import HumanMessage
from schemas import ChatRequest, ChatResponse
from core.graph import graph, SYSTEM_MESSAGE


async def call_model(req: ChatRequest) -> ChatResponse:
    config = {"configurable": {"thread_id": "1"}}

    initial_state = {"messages": [SYSTEM_MESSAGE, HumanMessage(content=req.message)]}

    final_state = await graph.ainvoke(initial_state, config)

    response_content = final_state["messages"][-1].content
    return ChatResponse(response=response_content)
