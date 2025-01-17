from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db
from .routers import user_router
from app.routers import translate_banglish,training_data
from app.routers import document
from app.utils.embeddings import init_collections


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    init_collections()
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(training_data.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(translate_banglish.router)
app.include_router(document.router)


@app.get("/")
async def root():
    return {"message": "Welcome to ByteForgers!"}
