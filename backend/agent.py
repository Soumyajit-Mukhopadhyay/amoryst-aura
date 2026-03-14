import datetime
from ddgs import DDGS
import os
from dotenv import load_dotenv
from pydantic import SecretStr
from typing import TypedDict, Annotated, Sequence, List
import operator

from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import FAISS
from langchain_core.tools import tool
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage, ToolMessage
from langchain_core.runnables import RunnableConfig
from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver

load_dotenv()

gemini_api_key = os.getenv("VITE_GEMINI_API_KEY")

# Initialize LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    api_key=SecretStr(gemini_api_key) if gemini_api_key is not None else None,
    max_tokens=2048,
)

_retriever = None

def get_retriever():
    global _retriever
    if _retriever is None:
        loaders = [
            TextLoader("knowledge.md"),
            TextLoader("../README.md")
        ]
        docs = []
        for loader in loaders:
            docs.extend(loader.load())

        embeddings = GoogleGenerativeAIEmbeddings(
            model="models/gemini-embedding-001",
            api_key=SecretStr(gemini_api_key) if gemini_api_key is not None else None,
        )
        vector_store = FAISS.from_documents(docs, embeddings)
        _retriever = vector_store.as_retriever()
    return _retriever


# Define State
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    ui_actions: List[dict]  # Custom state to track UI commands


# Core Tools
@tool
def search_knowledge(query: str) -> str:
    """Retrieve internal knowledge about Amoryst Aura's brand, perfumes, ingredients, or physical stores."""
    r = get_retriever()
    docs = r.invoke(query)
    return "\n\n".join([doc.page_content for doc in docs])


@tool
def search_the_web(query: str) -> str:
    """Search the public internet for real-time information not found in the brand knowledge."""
    try:
        with DDGS() as ddgs:
            results = [r for r in ddgs.text(query, max_results=5)]
            if not results:
                return "No useful results found."
            return "\n\n".join([f"Title: {r['title']}\nSnippet: {r['body']}\nURL: {r['href']}" for r in results])
    except Exception as e:
        return f"Error performing web search: {e}"

@tool
def get_current_date_time() -> str:
    """Get the current date and time."""
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")


# UI Emulator Tools (These don't mutate backend state, but simply return structured data for the frontend to execute)
@tool
def navigate_to_section(section_id: str) -> str:
    """Navigate the user's browser to a specific section of the page. Valid sections: 'hero', 'collections', 'philosophy', 'ingredients', 'stores'."""
    return f"UI_ACTION_INVOKED:nav:{section_id}"


@tool
def navigate_map(store_id: str) -> str:
    """Fly the map to a specific Amoryst Aura store. Valid IDs: '1' through '8'. Check knowledge base for matching IDs to cities."""
    return f"UI_ACTION_INVOKED:map:{store_id}"


@tool
def add_to_cart(perfume_id: str, size: int) -> str:
    """Add a specific perfume to the user's shopping cart. Valid IDs: 'twilight', 'horizon', 'eclipse', 'oasis', 'mirage', 'elysium', 'reserve-saffron'. Size is usually 50 or 100."""
    return f"UI_ACTION_INVOKED:cart:{perfume_id}:{size}"


@tool
def open_scent_quiz() -> str:
    """Open the interactive Scent Finder / Quiz modal for the user."""
    return "UI_ACTION_INVOKED:quiz"


tools = [
    search_knowledge,
    search_the_web,
    get_current_date_time,
    navigate_to_section,
    navigate_map,
    add_to_cart,
    open_scent_quiz,
]
llm_with_tools = llm.bind_tools(tools)


# Define Graph Nodes
def call_model(state: AgentState):
    messages = state["messages"]
    # Check if system prompt is present, if not insert it
    if not messages or not isinstance(messages[0], SystemMessage):
        system_msg = SystemMessage(
            content="You are Amara, the hyper-premium, luxury fragrance concierge for Amoryst Aura. Your tone is sophisticated, slightly poetic, incredibly knowledgeable, but concise. ALWAYS use `search_knowledge` tool to look up catalog details or store locations. If a user asks a general question outside your knowledge, use `search_the_web`. If they ask for the current date or time, use `get_current_date_time`. If a user asks to buy or add to bag, use `add_to_cart`. If they want to navigate, use `navigate_to_section`. If they want you to show them a store on the map, use `navigate_map`."
        )
        messages = [system_msg] + list(messages)

    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}


def parse_ui_actions(state: AgentState):
    """Scan latest message for UI ACTION tags returned by tools and strip them from display text"""
    messages = state["messages"]
    latest_msg = messages[-1]

    ui_actions = []

    # Process ToolMessages that contain our special UI_ACTION string
    if (
        hasattr(latest_msg, "content")
        and isinstance(latest_msg.content, str)
        and "UI_ACTION_INVOKED" in latest_msg.content
    ):
        action_parts = latest_msg.content.split("UI_ACTION_INVOKED:")[1].split(":")
        action_type = action_parts[0]

        if action_type == "nav":
            ui_actions.append({"type": "navigate", "payload": action_parts[1]})
        elif action_type == "map":
            ui_actions.append({"type": "map", "payload": action_parts[1]})
        elif action_type == "cart":
            ui_actions.append(
                {
                    "type": "add_to_cart",
                    "payload": {"id": action_parts[1], "size": action_parts[2]},
                }
            )
        elif action_type == "quiz":
            ui_actions.append({"type": "open_quiz", "payload": None})

    return {"ui_actions": ui_actions}


def route_tools(state: AgentState):
    """Determine whether to use tools or end"""
    last_message = state["messages"][-1]
    if getattr(last_message, "tool_calls", None):
        return "tools"
    return END


# Build Graph
builder = StateGraph(AgentState)
builder.add_node("agent", call_model)
builder.add_node("tools", ToolNode(tools))
builder.add_node("action_parser", parse_ui_actions)  # Custom node that runs after tools

# Define Edges
builder.add_edge(START, "agent")
builder.add_conditional_edges("agent", route_tools, {"tools": "tools", END: END})
builder.add_edge("tools", "action_parser")
builder.add_edge("action_parser", "agent")

# Memory
memory = MemorySaver()
graph = builder.compile(checkpointer=memory)


async def process_chat(session_id: str, message: str) -> dict:
    """Entry point for API"""
    config = RunnableConfig(configurable={"thread_id": session_id})

    # Run graph
    result_state = None
    for s in graph.stream(
        {"messages": [HumanMessage(content=message)], "ui_actions": []},
        config=config,
        stream_mode="values",
    ):
        result_state = s

    if not result_state:
        return {
            "response": "I apologize, but I encountered an error processing your request.",
            "ui_actions": [],
        }

    final_messages = result_state["messages"]
    ui_actions = result_state.get("ui_actions", [])

    # The last message is the final AI response
    ai_response = final_messages[-1].content

    # Handle case where content might be a list of blocks (Gemini can return structured content)
    if isinstance(ai_response, list):
        text_content: List[str] = []
        for block in ai_response:
            if isinstance(block, dict) and block.get("type") == "text":
                text_content.append(str(block.get("text", "")))
            elif isinstance(block, str):
                text_content.append(block)
        ai_response = " ".join(text_content)

    return {"response": ai_response, "ui_actions": ui_actions}
