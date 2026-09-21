import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from NLP import nlp_app

app = FastAPI(title="AI Interactive Portfolio Backend")

allowed_origins = [
    origin.strip()
    for origin in os.getenv("FRONTEND_URLS", "https://ai-interactive-portfolio.vercel.app").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=False,
)

app.mount("/nlp", nlp_app)

@app.get("/")
def root():
    return {"message": "AI Interactive Portfolio Backend running"}

@app.get("/health")
def health():
    return {"status": "ok"}
