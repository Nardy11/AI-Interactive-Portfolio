import math
import os
import re
from collections import Counter
from io import BytesIO

import requests
import PyPDF2
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ============================================================
# ORIGINAL HEAVY AI STACK — DISABLED FOR FREE VERCEL DEPLOYMENT
# ============================================================
# The original backend used:
#
#   import nltk
#   import spacy
#   from sentence_transformers import SentenceTransformer
#   from faster_whisper import WhisperModel
#   from gtts import gTTS
#   from pydub import AudioSegment
#   from sklearn.metrics.pairwise import cosine_similarity
#   from sumy.summarizers.lsa import LsaSummarizer
#
# and loaded:
#
#   model = SentenceTransformer("all-MiniLM-L6-v2")
#   whisper_model = WhisperModel("base", device="cpu", compute_type="int8")
#
# Those packages/models are the reason the Python deployment became several GB.
# They are intentionally NOT installed in this free version.
#
# Speech recognition is now performed by the browser's Web Speech API.
# The backend receives the transcript through /nlp/ask.
# ============================================================


cv_sections_sbert = {
    "personal": [
        "I am Nardy Attaalla, a 22-year-old male from Cairo, Egypt.",
        "I was born on March 1, 2003, and currently live in Heliopolis, Cairo.",
        "I am Egyptian by nationality.",
        "My email address is nardymichelle2003@gmail.com.",
        "My phone number is +20 01286290269.",
        "I have a GitHub profile at Nardy11 and a LinkedIn profile at nardy-attallah.",
    ],

    "education": [
        "I studied Computer Science and Engineering at the German University in Cairo from October 2020 to July 2025.",
        "I earned a Bachelor of Science degree with a thesis on Cooperative Perception and Control for Connected Vehicles.",
        "My bachelor project was graded Excellent (A+).",
    ],

    "experience": [
        "I worked as a Flutter app developer intern at ESG& Company in Cairo from June to August 2024.",
        "At ESG& Company, I developed mobile apps and a website using Flutter and Firebase for multiple roles.",
        "I interned as a fullstack Flutter and Firebase developer at the German University in Cairo from August to October 2024.",
        "During the German University in Cairo internship, I developed both frontend Flutter apps and backend Firebase services as part of a team.",
        "I worked as a Flutter app developer intern at Egyptian Electrical Solution (EES) in March 2025.",
        "At EES, I built a Flutter mobile app and a web dashboard using Firebase to manage factory materials and products.",
    ],

    "projects": [
        # ML Projects
        "I developed a machine learning project to predict heart failure using real medical datasets, including classification and clustering models.",
        "I built a computer vision which is machine learning project for my bachelor (CPAC) using YOLOv5, YOLOv8, and TensorFlow for object detection, lane detection, and autonomous driving integration with LiDAR, ROS, and stereo cameras.",
        "During my Mentorness internship, I conducted data analysis project and created visualizations with PowerBI while managing SQL datasets.",
        "I implemented a virtual mouse in this portofolio website using computer vision libraries such as opencv and mediapipe which is a small machine learning project.",
        "I am being implemented as a virtual assistant in this portofolio website using Natural language processing libraries such as nltk , sentence_transformers ,and sklearn.metrics.pairwise which is a small machine learning project.",
       
        # App Development Projects
        "I developed an e-commerce application using React Native and Firebase, implementing user authentication, product catalog, and shopping cart functionalities.",
        "I built a Flutter + Firebase website and app for Climate Edge Company to monitor industrial pollution with secure login, data submission workflows, and a pollution calculator.",
        "I created a Flutter scientific calculator app called eesCalculator with product data storage and interactive calculations.",
        
        # Web Development Projects
        "I developed an interactive website of games using HTML, CSS, and JavaScript with mini-games like Rock-Paper-Scissors and Tic-Tac-Toe.",
        "I created a full-stack website named Elhaani Virtual Clinic using React, Redux, Node.js, Express, MongoDB, and Stripe payments, with patient-doctor management, appointments, chat/video calls, and admin dashboards.",
        "I developed this portofolio website using Next.js and Tailwind along as front-end with Fastapi as my backend for easy integration with machine learning models",
        
        # Backend / Spring Boot Projects
        "I implemented a backend e-commerce system using Spring Boot with user, product, cart, and order management, including 75 unit tests for CRUD operations.",
        "I built a social media backend using Spring Boot, MongoDB, and Docker, with REST APIs, Nginx load balancing, and JMeter performance testing.",
        "I developed a ride-sharing service backend using Spring Boot, PostgreSQL, and MongoDB with complete CRUD operations and layered architecture.",
        
        # Game / VR / AR Projects
        "I developed a Marvel-themed Java OOP game using object-oriented programming principles and design patterns.",
        "I built Diablo Crimson Abyss game, an action RPG in Unity with dynamic environments and RPG mechanics.",
        "I created a VR gaming experience for L'Oreal using Unity with AI-generated characters.",
        "I developed an AR game Yu-Gi-Oh! project using Unity and marker-based tracking for augmented reality gameplay.",
    ],

    "certificates": [
        "I earned the Introduction to AI Certificate from Helsinki University in May 2023, covering AI fundamentals, search algorithms, probability, Bayes' rule, Naive Bayes, regression, nearest neighbor, neural networks, and societal impact.",
        "I completed the Building AI Certificate in July 2023, covering optimization, probability, Bayes' rule, regression, nearest neighbor, text processing, overfitting, and deep learning.",
        "I finished the Supervised Machine Learning course in January 2025, covering linear regression, logistic regression, decision trees, and model evaluation.",
        "I completed the Advanced Learning Algorithms course in January 2025, learning optimization methods, neural networks, debugging, and model fine-tuning.",
        "I completed the Unsupervised Learning, Recommenders, and Reinforcement Learning course in January 2025, covering clustering, anomaly detection, recommender systems, and reinforcement learning.",
        "I earned the Machine Learning in Production Certificate from DeepLearning.AI in February 2025, focusing on designing, deploying, and monitoring ML systems, error analysis, deployment strategies, and data-centric development.",
        "I completed the Web Development Challenger Track in May 2022, covering HTML, CSS, and JavaScript.",
        "I earned a SQL Certificate from SoloLearn in October 2022, covering SQL fundamentals with exercises and quizzes.",
    ],

    "skills": [
        "I am proficient in Python, SQL, and JavaScript frameworks.",
        "I have experience with AI frameworks such as Caffe, Darknet, and YOLO.",
        "I use libraries including OpenCV, PCL, TensorFlow, and ROS for ML and CV projects.",
        "I have experience with PyTorch and TensorFlow.",
        "I am skilled in Flutter and Dart for mobile app development.",
        "I can develop applications with React and React Native.",
        "I am proficient in Spring Boot for backend development.",
        "I have full-stack development experience with the MERN Stack.",
        "I work with PostgreSQL and MongoDB databases.",
        "I use Docker and Docker Compose for containerization.",
        "I am experienced in designing Microservices architectures.",
        "I have worked with RabbitMQ for messaging systems.",
        "I use Redis for caching and data storage optimization.",
        "I manage load balancing with Nginx.",
        "I perform performance testing using JMeter.",
        "I write unit tests to ensure code reliability.",
        "I can solve technical problems and collaborate effectively in teams.",
        "I use Git for version control.",
        "I am familiar with Microsoft Word, Excel, and PowerPoint.",
        "I can program in Java for backend and game projects.",
    ],

    "languages": [
        "My mother tongue is Arabic.",
        "I speak English at the B2 level.",
        "I am bilingual in Arabic and English.",
    ],

    "volunteering": [
        "I was part of the marketing and fundraising team at BRUKE Student Club in Cairo, securing sponsorships and organizing events.",
        "I worked as an usher in events including Water Day, COVID-19 awareness campaigns, and Phoenix events.",
        "I participated in the Web Development IEEE Student Branch, learning frontend and backend development and building websites, earning the Most Committed Member award.",
    ],
}


faq_pairs = {
    # ---------------- PERSONAL ----------------
    "What is your name?": "my name is Nardy Attaalla",
    "How old are you?": "I'm 22-year-old ",
    "Where are you from?": "I am from Cairo, Egypt.",
    "Where do you live?": "I currently live in Heliopolis, Cairo.",
    "What is your nationality?": "I am Egyptian.",
    "What is your email?": "My email address is nardymichelle2003@gmail.com.",
    "What is your phone number?": "My phone number is +20 01286290269.",
    "What is your github?": "My GitHub profile is Nardy11 ",
    "What is your linkedin?": "My LinkedIn profile is nardy-attallah.",

    # ---------------- EDUCATION ----------------
    "What did you study?": "I studied Computer Science and Engineering at the German University in Cairo from October 2020 to July 2025.",
    "What degree do you have?": "I earned a Bachelor of Science degree with a thesis on Cooperative Perception and Control for Connected Vehicles.",
    "What was your bachelor thesis?": "My bachelor project was graded Excellent (A+).",

    # ---------------- EXPERIENCE ----------------
    "Where did you intern?": "I worked as a Flutter app developer intern at ESG& Company in Cairo from June to August 2024.",
    "What did you do at esg company?": "At ESG& Company, I developed mobile apps and a website using Flutter and Firebase for multiple roles.",
    "Did you intern at guc?": "I interned as a fullstack Flutter and Firebase developer at the German University in Cairo from August to October 2024.",
    "What did you do at guc internship?": "During the German University in Cairo internship, I developed both frontend Flutter apps and backend Firebase services as part of a team.",
    "Did you work at ees?": "I worked as a Flutter app developer intern at Egyptian Electrical Solution (EES) in March 2025.",
    "What did you do at ees?": "At EES, I built a Flutter mobile app and a web dashboard using Firebase to manage factory materials and products.",

    # ---------------- PROJECTS ----------------
    "Tell me about your heart failure project?": "I developed a machine learning project to predict heart failure using real medical datasets, including classification and clustering models.",
    "What was your bachelor project?": "I built a computer vision which is machine learning project for my bachelor (CPAC) using YOLOv5, YOLOv8, and TensorFlow for object detection, lane detection, and autonomous driving integration with LiDAR, ROS, and stereo cameras.",
    "What did you do in mentorness internship?": "During my Mentorness internship, I conducted data analysis project and created visualizations with PowerBI while managing SQL datasets.",
    "Did you build a virtual mouse?": "I implemented a virtual mouse in this portofolio website using computer vision libraries such as opencv and mediapipe which is a small machine learning project.",
    "Are you also a virtual assistant?": "I am being implemented as a virtual assistant in this portofolio website using Natural language processing libraries such as nltk , sentence_transformers ,and sklearn.metrics.pairwise which is a small machine learning project.",
    "What apps did you build?": "I developed an e-commerce application using React Native and Firebase, implementing user authentication, product catalog, and shopping cart functionalities.",
    "Did you work with climate edge company?": "I built a Flutter + Firebase website and app for Climate Edge Company to monitor industrial pollution with secure login, data submission workflows, and a pollution calculator.",
    "What is eescalculator?": "I created a Flutter scientific calculator app called eesCalculator with product data storage and interactive calculations.",
    "Did you make any websites?": "I developed an interactive website of games using HTML, CSS, and JavaScript with mini-games like Rock-Paper-Scissors and Tic-Tac-Toe.",
    "What is elhaani clinic project?": "I created a full-stack website named Elhaani Virtual Clinic using React, Redux, Node.js, Express, MongoDB, and Stripe payments, with patient-doctor management, appointments, chat/video calls, and admin dashboards.",
    "Did you build your portfolio?": "I developed this portofolio website using Next.js and Tailwind along as front-end with Fastapi as my backend for easy integration with machine learning models",
    "Did you do spring boot projects?": "I implemented a backend e-commerce system using Spring Boot with user, product, cart, and order management, including 75 unit tests for CRUD operations.",
    "What social media project did you build?": "I built a social media backend using Spring Boot, MongoDB, and Docker, with REST APIs, Nginx load balancing, and JMeter performance testing.",
    "What ride sharing app did you make?": "I developed a ride-sharing service backend using Spring Boot, PostgreSQL, and MongoDB with complete CRUD operations and layered architecture.",
    "Did you build any games?": "I developed a Marvel-themed Java OOP game using object-oriented programming principles and design patterns.",
    "What is diablo crimson abyss?": "I built Diablo Crimson Abyss game, an action RPG in Unity with dynamic environments and RPG mechanics.",
    "Did you do any vr projects?": "I created a VR gaming experience for L'Oreal using Unity with AI-generated characters.",
    "Did you do any ar projects?": "I developed an AR game Yu-Gi-Oh! project using Unity and marker-based tracking for augmented reality gameplay.",

    # ---------------- CERTIFICATES ----------------
    "What certificates do you have?": "I earned the Introduction to AI Certificate from Helsinki University in May 2023, covering AI fundamentals, search algorithms, probability, Bayes' rule, Naive Bayes, regression, nearest neighbor, neural networks, and societal impact.",
    "Did you complete building ai?": "I completed the Building AI Certificate in July 2023, covering optimization, probability, Bayes' rule, regression, nearest neighbor, text processing, overfitting, and deep learning.",
    "Did you study supervised learning?": "I finished the Supervised Machine Learning course in January 2025, covering linear regression, logistic regression, decision trees, and model evaluation.",
    "What did you learn in advanced learning algorithms?": "I completed the Advanced Learning Algorithms course in January 2025, learning optimization methods, neural networks, debugging, and model fine-tuning.",
    "What did you learn in unsupervised learning?": "I completed the Unsupervised Learning, Recommenders, and Reinforcement Learning course in January 2025, covering clustering, anomaly detection, recommender systems, and reinforcement learning.",
    "What is your ml in production certificate?": "I earned the Machine Learning in Production Certificate from DeepLearning.AI in February 2025, focusing on designing, deploying, and monitoring ML systems, error analysis, deployment strategies, and data-centric development.",
    "Do you know web development?": "I completed the Web Development Challenger Track in May 2022, covering HTML, CSS, and JavaScript.",
    "Do you know sql?": "I earned a SQL Certificate from SoloLearn in October 2022, covering SQL fundamentals with exercises and quizzes.",

    # ---------------- SKILLS ----------------
    "What programming languages do you know?": "I am proficient in Python, SQL, and JavaScript frameworks.",
    "Do you know ai frameworks?": "I have experience with AI frameworks such as Caffe, Darknet, and YOLO.",
    "What libraries do you use?": "I use libraries including OpenCV, PCL, TensorFlow, and ROS for ML and CV projects.",
    "Do you know pytorch?": "I have experience with PyTorch and TensorFlow.",
    "What mobile skills do you have?": "I am skilled in Flutter and Dart for mobile app development.",
    "Do you know react?": "I can develop applications with React and React Native.",
    "Do you know spring boot?": "I am proficient in Spring Boot for backend development.",
    "Do you know mern?": "I have full-stack development experience with the MERN Stack.",
    "What databases do you use?": "I work with PostgreSQL and MongoDB databases.",
    "Do you use docker?": "I use Docker and Docker Compose for containerization.",
    "Do you know microservices?": "I am experienced in designing Microservices architectures.",
    "Do you know rabbitmq?": "I have worked with RabbitMQ for messaging systems.",
    "Do you know redis?": "I use Redis for caching and data storage optimization.",
    "Do you know nginx?": "I manage load balancing with Nginx.",
    "Do you do performance testing?": "I perform performance testing using JMeter.",
    "Do you write unit tests?": "I write unit tests to ensure code reliability.",
    "What soft skills do you have?": "I can solve technical problems and collaborate effectively in teams.",
    "Do you use git?": "I use Git for version control.",
    "Do you know ms office?": "I am familiar with Microsoft Word, Excel, and PowerPoint.",
    "Do you code in java?": "I can program in Java for backend and game projects.",

    # ---------------- LANGUAGES ----------------
    "What languages do you speak?": "My mother tongue is Arabic.",
    "Do you speak english?": "I speak English at the B2 level.",
    "Are you bilingual?": "I am bilingual in Arabic and English.",

    # ---------------- VOLUNTEERING ----------------
    "Did you volunteer?": "I was part of the marketing and fundraising team at BRUKE Student Club in Cairo, securing sponsorships and organizing events.",
    "What events did you work at?": "I worked as an usher in events including Water Day, COVID-19 awareness campaigns, and Phoenix events.",
    "Did you join ieee?": "I participated in the Web Development IEEE Student Branch, learning frontend and backend development and building websites, earning the Most Committed Member award.",
}

_STOP_WORDS = {
    "a", "an", "and", "are", "as", "at", "be", "but", "by", "for",
    "from", "how", "i", "in", "is", "it", "me", "my", "of", "on",
    "or", "that", "the", "this", "to", "was", "what", "where",
    "which", "who", "with", "you", "your"
}




_STOP_WORDS = {
    "a", "an", "and", "are", "as", "at", "be", "but", "by", "for",
    "from", "how", "i", "in", "is", "it", "me", "my", "of", "on",
    "or", "that", "the", "this", "to", "was", "what", "where",
    "which", "who", "with", "you", "your", "do", "did", "can"
}


def text_preprocessing(sentence: str) -> list[str]:
    words = re.findall(r"[a-z0-9]+", sentence.lower())
    return [word for word in words if word not in _STOP_WORDS]


def _similarity(question: str, answer: str) -> float:
    """Small pure-Python cosine similarity; no sklearn/PyTorch required."""
    q = Counter(text_preprocessing(question))
    a = Counter(text_preprocessing(answer))

    if not q or not a:
        return 0.0

    common = set(q) & set(a)
    numerator = sum(q[word] * a[word] for word in common)
    q_norm = math.sqrt(sum(value * value for value in q.values()))
    a_norm = math.sqrt(sum(value * value for value in a.values()))

    if not q_norm or not a_norm:
        return 0.0

    return numerator / (q_norm * a_norm)


def _best_answer(question: str, answers: list[str]) -> str:
    if not answers:
        return "I could not find an answer for that question."

    scores = [_similarity(question, answer) for answer in answers]
    return answers[max(range(len(scores)), key=scores.__getitem__)]


def NLP_start(user_question: str, threshold: float = 0.12):
    normalized = user_question.strip().lower()

    if normalized in {"can you summarize cv1?", "can you summarize machine learning cv?"}:
        return summarize_cv1(), "contact"

    if normalized in {"can you summarize cv2?", "can you summarize software cv?"}:
        return summarize_cv2(), "contact"

    # Exact FAQ match first.
    for question, answer in faq_pairs.items():
        if normalized == question.lower():
            return answer, "home"

    question_words = set(text_preprocessing(user_question))

    if question_words & {"skill", "skills", "framework", "technology", "tool"}:
        section, position = "skills", "skills"
    elif question_words & {"project", "projects", "developed", "built", "application", "app", "website", "game", "machine"}:
        section, position = "projects", "projects"
    elif question_words & {"certificate", "certificates", "course", "track"}:
        section, position = "certificates", "timeline"
    elif question_words & {"education", "study", "university", "thesis", "degree"}:
        section, position = "education", "timeline"
    elif question_words & {"experience", "worked", "intern", "job", "company"}:
        section, position = "experience", "testimonials"
    elif question_words & {"volunteer", "club", "fundraising", "ieee"}:
        section, position = "volunteering", "home"
    else:
        candidates = []
        for section_name, answers in cv_sections_sbert.items():
            for answer in answers:
                candidates.append((section_name, answer, _similarity(user_question, answer)))

        section, best_answer, best_score = max(
            candidates,
            key=lambda item: item[2],
        )
        position = "home"

        if best_score < threshold:
            return "I could not find a close answer for that question.", position

        return best_answer, position

    answers = cv_sections_sbert.get(section, [])
    answer = _best_answer(user_question, answers)

    if _similarity(user_question, answer) < threshold:
        return "I could not find a close answer for that question.", position

    return answer, position


def fetch_pdf_text(url: str) -> str:
    response = requests.get(url, timeout=15)
    response.raise_for_status()

    reader = PyPDF2.PdfReader(BytesIO(response.content))
    return "\n".join(page.extract_text() or "" for page in reader.pages)


def summarize_text(text: str, sentence_count: int = 5) -> str:
    # Lightweight extractive summary replacing Sumy.
    sentences = [
        sentence.strip()
        for sentence in re.split(r"(?<=[.!?])\s+", text)
        if sentence.strip()
    ]

    if len(sentences) <= sentence_count:
        return " ".join(sentences)

    # Keep the first few meaningful sentences; this is intentionally simple
    # to avoid bringing a large NLP summarization stack into Vercel.
    return " ".join(sentences[:sentence_count])


def summarize_cv1():
    url = os.getenv(
        "CV1_URL",
        "https://ai-interactive-portfolio.vercel.app/cv1.pdf",
    )
    return "Summary of cv1: " + summarize_text(fetch_pdf_text(url))


def summarize_cv2():
    url = os.getenv(
        "CV2_URL",
        "https://ai-interactive-portfolio.vercel.app/cv2.pdf",
    )
    return "Summary of cv2: " + summarize_text(fetch_pdf_text(url))


nlp_app = FastAPI(title="AI Portfolio Lightweight NLP")

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "FRONTEND_URLS",
        "https://ai-interactive-portfolio.vercel.app",
    ).split(",")
    if origin.strip()
]

nlp_app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=False,
)


@nlp_app.get("/start-assistant")
def start_assistant():
    return {"status": "Voice assistant ready"}


@nlp_app.get("/stop-assistant")
def stop_assistant():
    return {"status": "Voice assistant stopped"}


class QuestionRequest(BaseModel):
    question: str


@nlp_app.post("/ask")
async def ask_question(payload: QuestionRequest):
    try:
        question = payload.question.strip()

        if not question:
            return {"error": "Question is empty"}

        answer_text, section = NLP_start(question)
        return {"text": answer_text, "section": section}

    except Exception as exc:
        return {"error": str(exc)}


# Compatibility endpoint.
# Audio transcription was intentionally moved to the browser so this backend
# remains small enough for a free Vercel deployment.
@nlp_app.post("/stream-audio")
async def stream_audio():
    return {
        "error": "Audio transcription is handled by the browser in the free deployment. Use /ask with the transcript."
    }
