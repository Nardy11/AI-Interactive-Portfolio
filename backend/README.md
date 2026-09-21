# AI Speech / NLP Backend — Free Version

This is the standalone FastAPI service for the portfolio assistant.

## Free deployment architecture

The expensive server-side speech/NLP stack was intentionally disabled.

The original implementation used Whisper, SentenceTransformer/PyTorch, spaCy, NLTK, Sumy, pydub and gTTS. Those dependencies made the Vercel Python bundle several GB.

They are preserved as comments/documentation in `NLP.py`, but are **not installed**.

The free version uses:

- Browser Web Speech API for speech-to-text
- Browser SpeechSynthesis for text-to-speech
- Pure-Python keyword/cosine-style retrieval for the portfolio FAQ
- PyPDF2 + requests only for CV PDF summaries

This makes the backend suitable for a lightweight Vercel Hobby deployment.

## Vercel settings

Create a separate Vercel project from the same GitHub repository.

- Repository: `Nardy11/AI-Interactive-Portfolio`
- Root Directory: `backend`
- Framework Preset: Other
- Build Command: leave empty
- Output Directory: leave empty
- Install Command: `pip install -r requirements.txt`

Environment variables:

```text
FRONTEND_URLS=https://ai-interactive-portfolio.vercel.app
CV1_URL=https://ai-interactive-portfolio.vercel.app/cv1.pdf
CV2_URL=https://ai-interactive-portfolio.vercel.app/cv2.pdf
```

No Whisper model download is required.

## Frontend environment variable

On the portfolio Vercel project:

```text
NEXT_PUBLIC_API_URL=https://YOUR-BACKEND.vercel.app
```

The browser transcribes the question and sends the transcript to:

```text
POST /nlp/ask
```

## Endpoints

- `GET /`
- `GET /health`
- `GET /nlp/start-assistant`
- `GET /nlp/stop-assistant`
- `POST /nlp/ask`

`/nlp/stream-audio` remains as a compatibility endpoint but is intentionally disabled because audio transcription is now performed by the browser.

## Local development

```bash
cd backend
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
