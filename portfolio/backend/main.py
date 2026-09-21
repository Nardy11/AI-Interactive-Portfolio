from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from CV import cv_app
from NLP import nlp_app

main_app = FastAPI()
allowed_origins = [
    origin.strip()
    for origin in os.getenv("FRONTEND_URLS", "http://localhost:3000").split(",")
    if origin.strip()
]
main_app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=False,
)
# Global variables for voice assistant control
assistant_active = False
assistant_thread = None

# Mount both apps
main_app.mount("/cv", cv_app)
main_app.mount("/nlp", nlp_app)

# Root endpoint
@main_app.get("/")
def root():
    return {"message": "Main API running"}
