import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parents[1] / "backend"
sys.path.insert(0, str(backend_dir))

from fastapi import FastAPI
from pydantic import BaseModel
from NLP import nlp_app, NLP_start

app = FastAPI(title="AI Interactive Portfolio API")
app.mount("/api/nlp", nlp_app)

class Question(BaseModel):
    question: str

@app.get("/api")
def api_root():
    return {"message": "AI Interactive Portfolio API running"}

@app.post("/api/nlp/ask")
def ask_question(payload: Question):
    try:
        text, section = NLP_start(payload.question.strip())
        return {"text": text, "section": section}
    except Exception as exc:
        return {"error": str(exc)}
