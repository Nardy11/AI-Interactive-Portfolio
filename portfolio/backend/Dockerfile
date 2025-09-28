# 1. Base image
FROM python:3.12-slim

# 2. Set working directory
WORKDIR /app

# 3. Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsndfile1 \
    libportaudio2 \
    portaudio19-dev \
    build-essential \
    wget \
    git \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# 4. Copy project files
COPY . /app

# 5. Install Python dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# 6. Download Spacy model
RUN python -m spacy download en_core_web_md

# 7. Expose port
EXPOSE 8000

# 8. Start FastAPI app with uvicorn
CMD ["uvicorn", "main:main_app", "--host", "0.0.0.0", "--port", "8000"]
