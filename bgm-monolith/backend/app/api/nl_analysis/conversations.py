from fastapi import APIRouter, Depends, HTTPException, Response
from app.api.deps import get_conv_store
from app.api.nl_analysis.schemas import (
    ConversationCreate,
    ConversationUpdate,
    ConversationOut,
    ConversationListOut,
    MergeRequest,
)

router = APIRouter(prefix="/conversations")


@router.post("", status_code=201, response_model=ConversationOut)
async def create_conversation(
    body: ConversationCreate,
    store=Depends(get_conv_store),
):
    conv = await store.create(
        title=body.title,
        model_name=body.model_name,
        mode=body.mode,
    )
    return conv


@router.get("", response_model=ConversationListOut)
async def list_conversations(
    q: str | None = None,
    offset: int = 0,
    limit: int = 20,
    store=Depends(get_conv_store),
):
    if q:
        items = await store.search(q)
        total = await store.count(query=q)
    else:
        items = await store.list_all(offset=offset, limit=limit)
        total = await store.count()
    return {"items": items, "total": total}


@router.get("/{conv_id}", response_model=ConversationOut)
async def get_conversation(conv_id: str, store=Depends(get_conv_store)):
    conv = await store.get(conv_id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conv


@router.patch("/{conv_id}", response_model=ConversationOut)
async def update_conversation(
    conv_id: str,
    body: ConversationUpdate,
    store=Depends(get_conv_store),
):
    updates = body.model_dump(exclude_none=True)
    conv = await store.update(conv_id, **updates)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conv


@router.delete("/{conv_id}", status_code=204)
async def delete_conversation(conv_id: str, store=Depends(get_conv_store)):
    deleted = await store.delete(conv_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return Response(status_code=204)


@router.post("/merge")
async def merge_conversations(body: MergeRequest, store=Depends(get_conv_store)):
    merged_count = 0
    not_found = []
    for conv_id in body.ids:
        result = await store.update(conv_id, folder=body.folder)
        if result is not None:
            merged_count += 1
        else:
            not_found.append(conv_id)
    return {"merged": merged_count, "not_found": not_found}
