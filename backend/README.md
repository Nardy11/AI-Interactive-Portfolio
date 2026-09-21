# AI Speech / NLP Backend

Standalone FastAPI service for the portfolio's voice assistant.

## Vercel project settings

Create a **separate Vercel project** from the same GitHub repository:

- Repository: `Nardy11/AI-Interactive-Portfolio`
- Root Directory: `backend`
- Framework Preset: Other / FastAPI
- Build Command: leave empty
- Output Directory: leave empty
- Install Command: `pip install -r requirements.txt`

Vercel detects `main.py` as the FastAPI entrypoint.

### Environment variables

Set:

```text
FRONTEND_URLS=https://ai-interactive-portfolio.vercel.app
VERCEL_SUPPORT_LARGE_FUNCTIONS=1
WHISPER_MODEL=tiny.en
CV1_URL=https://ai-interactive-portfolio.vercel.app/cv1.pdf
CV2_URL=https://ai-interactive-portfolio.vercel.app/cv2.pdf
```

`VERCEL_SUPPORT_LARGE_FUNCTIONS=1` enables Vercel's large-function support for existing projects.

## Endpoints

- `GET /`
- `GET /health`
- `GET /nlp/start-assistant`
- `GET /nlp/stop-assistant`
- `POST /nlp/stream-audio`
- `POST /nlp/ask`

## Frontend configuration

The Next.js portfolio is deployed as a different Vercel project.

Set this frontend environment variable:

```text
NEXT_PUBLIC_API_URL=https://YOUR-AI-BACKEND.vercel.app
```

The frontend sends microphone recordings to:

```text
https://YOUR-AI-BACKEND.vercel.app/nlp/stream-audio
```

Browser speech synthesis is used for the assistant's spoken response, so the backend only handles transcription and NLP.

## Local backend

```bash
cd backend
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The backend uses `faster-whisper` with `tiny.en` by default and TF-IDF retrieval instead of SentenceTransformer/PyTorch. This keeps the Vercel function substantially smaller while retaining the portfolio FAQ/NLP behavior.

faster-whisper uses PyAV for audio decoding, so a system FFmpeg installation is not required for basic transcription.
