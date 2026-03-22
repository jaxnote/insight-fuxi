from pydantic import BaseModel, Field
from typing import Optional


class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None


class ProjectOut(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    created_at: str


class ProjectListOut(BaseModel):
    items: list[ProjectOut]
    total: int


class FileUpload(BaseModel):
    path: str = Field(..., min_length=1)
    content: str  # base64 编码的文件内容


class FileMoveRequest(BaseModel):
    new_path: str = Field(..., min_length=1)


class FileInfo(BaseModel):
    path: str


class FileTreeOut(BaseModel):
    items: list[FileInfo]
