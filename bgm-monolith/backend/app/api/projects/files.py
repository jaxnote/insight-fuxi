import base64
from fastapi import APIRouter, HTTPException, Depends, Response
from app.api.projects.schemas import FileUpload, FileMoveRequest, FileTreeOut
from app.api.deps import get_file_store_dep

router = APIRouter(prefix="/projects/{proj_id}/files")


@router.post("", status_code=201)
async def upload_file(proj_id: str, body: FileUpload, store=Depends(get_file_store_dep)):
    try:
        content = base64.b64decode(body.content)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid base64 content")
    try:
        result = await store.save(proj_id, body.path, content)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return result


@router.get("", response_model=FileTreeOut)
async def get_file_tree(proj_id: str, store=Depends(get_file_store_dep)):
    items = await store.list_tree(proj_id)
    return {"items": items}


@router.delete("/{file_path:path}", status_code=204)
async def delete_file(proj_id: str, file_path: str, store=Depends(get_file_store_dep)):
    try:
        result = await store.delete(proj_id, file_path)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    if not result:
        raise HTTPException(status_code=404, detail="File not found")
    return Response(status_code=204)


@router.patch("/{file_path:path}")
async def move_file(proj_id: str, file_path: str, body: FileMoveRequest, store=Depends(get_file_store_dep)):
    try:
        result = await store.move(proj_id, file_path, body.new_path)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    if not result:
        raise HTTPException(status_code=404, detail="File not found")
    return {"src": file_path, "dst": body.new_path}
