import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parents[1] / "backend"
sys.path.insert(0, str(backend_dir))

from fastapi import FastAPI
from NLP import nlp_app

app = FastAPI(title="AI Interactive Portfolio API")
app.mount("/api/nlp", nlp_app)

@app.get("/api")
def api_root():
    return {"message": "AI Interactive Portfolio API running"}
