from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    query: str
    is_bangla: bool
    user_id: Optional[str] = None  # To maintain separate conversation histories for different users

class ChatResponse(BaseModel):
    response: str
    context_used: bool
