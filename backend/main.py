import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import uvicorn

# Load env file from the parent directory where React stores it
load_dotenv(dotenv_path="../.env")

# Must import agent after loading dot env so it gets the key
from agent import process_chat, memory

app = FastAPI(title="Amoryst Aura AI Backend")

# Allow requests from React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:8081", "http://localhost:8082", "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    session_id: str
    message: str

from typing import List

class ChatResponse(BaseModel):
    response: str
    ui_actions: List[dict]

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    try:
        if not os.getenv("VITE_GEMINI_API_KEY"):
            raise Exception("VITE_GEMINI_API_KEY not found in environment.")
        
        result = await process_chat(req.session_id, req.message)
        return {
            "response": result["response"],
            "ui_actions": result["ui_actions"]
        }
    except Exception as e:
        print(f"Error processing chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/clear")
async def clear_memory(req: dict):
    session_id = req.get("session_id")
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    
    # Wipe conversation state
    # The in-memory saver supports deleting an entire thread by ID.
    memory.delete_thread(session_id)
    return {"status": "cleared"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
