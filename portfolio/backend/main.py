from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from CV import cv_app
from NLP import nlp_app

main_app = FastAPI()
main_app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
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
