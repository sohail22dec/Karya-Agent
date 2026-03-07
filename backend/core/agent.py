from typing import List, Dict, Any
from schemas import ChatRequest, ChatResponse
from core.graph import graph, SYSTEM_MESSAGE
from langchain_core.messages import HumanMessage, SystemMessage


async def call_model(req: ChatRequest) -> ChatResponse:
    config = {"configurable": {"thread_id": req.thread_id}}

    initial_state = {"messages": [SYSTEM_MESSAGE, HumanMessage(content=req.message)]}

    final_state = await graph.ainvoke(initial_state, config)

    ai_msg = final_state["messages"][-1]
    return ChatResponse(
        id=ai_msg.id or str(hash(ai_msg.content)),
        role="agent",
        content=ai_msg.content,
    )


async def get_thread_history(thread_id: str) -> List[Dict[str, Any]]:
    """Retrieves the message history for a given thread from the LangGraph persistence layer."""
    config = {"configurable": {"thread_id": thread_id}}

    try:
        # Get the current state of the graph for this thread
        state = await graph.aget_state(config)

        if not state or "messages" not in state.values:
            return []

        messages = state.values["messages"]
        history = []

        for msg in messages:
            # Skip system messages in the returned UI history
            if isinstance(msg, SystemMessage):
                continue

            role = "user" if isinstance(msg, HumanMessage) else "agent"
            history.append(
                {
                    "id": msg.id or str(hash(msg.content)),
                    "role": role,
                    "content": msg.content,
                }
            )

        return history
    except Exception as e:
        print(f"Error fetching history: {e}")
        return []
