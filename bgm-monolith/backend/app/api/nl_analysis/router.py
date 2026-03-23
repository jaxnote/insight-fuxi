from fastapi import APIRouter
from app.api.nl_analysis import conversations, messages

router = APIRouter()
router.include_router(conversations.router, tags=["conversations"])
router.include_router(messages.router, tags=["messages"])
