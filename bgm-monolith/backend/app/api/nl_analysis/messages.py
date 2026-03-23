from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_conv_store
from app.api.nl_analysis.schemas import MessageCreate, MessageOut, MessageListOut

router = APIRouter(prefix="/conversations")


@router.post("/{conv_id}/messages", status_code=201, response_model=MessageOut)
async def add_message(
    conv_id: str,
    body: MessageCreate,
    store=Depends(get_conv_store),
):
    conv = await store.get(conv_id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    msg = await store.add_message(
        conv_id,
        role=body.role,
        content_type=body.content_type,
        content=body.content,
    )
    return msg


@router.get("/{conv_id}/messages", response_model=MessageListOut)
async def get_messages(conv_id: str, store=Depends(get_conv_store)):
    conv = await store.get(conv_id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    items = await store.get_messages(conv_id)
    return {"items": items}
