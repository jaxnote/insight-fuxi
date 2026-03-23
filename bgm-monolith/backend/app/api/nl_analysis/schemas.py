from pydantic import BaseModel, Field
from typing import Optional


class ConversationCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    model_name: str = "gpt-4o"
    mode: str = "agent"


class ConversationUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    folder: Optional[str] = None
    pinned: Optional[int] = None
    model_name: Optional[str] = None


class ConversationOut(BaseModel):
    id: str
    title: str
    folder: Optional[str] = None
    pinned: int = 0
    model_name: str
    mode: str
    token_used: int
    token_limit: int
    created_at: str


class ConversationListOut(BaseModel):
    items: list[ConversationOut]
    total: int


class MergeRequest(BaseModel):
    ids: list[str]
    folder: str


class MessageCreate(BaseModel):
    role: str
    content_type: str = "text"
    content: str = Field(..., min_length=1)


class MessageOut(BaseModel):
    id: str
    role: str
    content_type: str
    content: str
    metadata: Optional[dict] = None
    created_at: str


class MessageListOut(BaseModel):
    items: list[MessageOut]
