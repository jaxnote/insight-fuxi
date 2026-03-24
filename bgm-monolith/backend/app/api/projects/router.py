from fastapi import APIRouter
from app.api.projects import projects, files

router = APIRouter()
router.include_router(projects.router, tags=["projects"])
router.include_router(files.router, tags=["files"])
