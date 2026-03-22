from fastapi import APIRouter
from app.api.nl_analysis.router import router as nl_analysis_router

api_router = APIRouter()
api_router.include_router(nl_analysis_router, prefix="/nl-analysis")
