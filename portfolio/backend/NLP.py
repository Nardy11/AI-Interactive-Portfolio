import re
import nltk
import sounddevice as sd
import numpy as np
from gtts import gTTS
from sentence_transformers import SentenceTransformer
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.metrics.pairwise import cosine_similarity
from faster_whisper import WhisperModel
from pathlib import Path
from pydub import AudioSegment
import queue
import time
from threading import Event
from fastapi import FastAPI, UploadFile, File, responses
import io
from fastapi.middleware.cors import CORSMiddleware
import threading
import pyttsx3
# Add these imports at the top
import asyncio
from concurrent.futures import ThreadPoolExecutor
from fastapi.responses import StreamingResponse
import PyPDF2
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer
from io import BytesIO
import requests


nltk.download("punkt_tab")
nltk.download("wordnet")
nltk.download("stopwords")
is_speaking = False  # global flag

stop_word = stopwords.words("english")
lemmatizer = WordNetLemmatizer()
model = SentenceTransformer("all-MiniLM-L6-v2")
# Use faster-whisper
whisper_model = WhisperModel("base", device="cpu", compute_type="int8")  


nlp_app = FastAPI()

nlp_app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Global variables for voice assistant control
assistant_active = False
assistant_thread = None
audio_queue = queue.Queue()
# NLP/Voice Assistant Section
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

def text_preprocessing(sentence):
    output=[]
    #make all lower case
    sentence = sentence.lower().strip()
    # Removing punctuation
    sent=re.sub(r'[^\w\s]','',sentence)
    # Tokenizing sentences
    words=nltk.word_tokenize(sent)
    # Removing stopwords 
    words=[word for word in words if not word in stop_word]
    # Lemmatizating
    for word in words:
        output.append(lemmatizer.lemmatize(word))
    # Joining back
    result=" ".join(output) 
    return result

def text_representation_cosine_similarity(questionsentence, answersentence):
    question_clean = text_preprocessing(questionsentence)
    answer_clean = text_preprocessing(answersentence)
    embeddings = model.encode([question_clean, answer_clean])
    cosine_score = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
    return cosine_score

def most_similar(arr):
    return arr.index(max(arr))


def NLP_start(user_question, threshold=0.36):
    global faq_pairs
    got_ans=False
    question_clean = user_question.lower()
    print(user_question)
    if (user_question in ["Can you summarize CV1?","Can you summarize machine learning CV?"]):
        answers=summarize_cv1()
        position="contact"
        return(answers,position)
    elif(user_question in ["Can you summarize CV2?","Can you summarize software CV?"]):
        answers=summarize_cv2()
        position="contact"
        return(answers,position)
    else:    
        if user_question in faq_pairs:
            got_ans=True
            answers=faq_pairs[user_question]
        
        question_clean = text_preprocessing(user_question)

        # Step 2: Continue with your existing CV logic
        if any(word in question_clean for word in ["skill", "framework", "technology", "tool"]):
            position="skills"
            section = "skills"
        elif any(word in question_clean for word in ["project", "developed", "built", "application", "app", "website", "game", "machine"]):
            position="projects"
            section = "projects"
        elif any(word in question_clean for word in ["certificate", "course", "track"]):
            position="timeline"
            section = "certificates"
        elif any(word in question_clean for word in ["education", "study", "university", "thesis", "degree"]):
            position="timeline"
            section = "education"
        elif any(word in question_clean for word in ["experience", "worked", "intern", "job", "company"]):
            position="testimonials"
            section = "experience"
        elif any(word in question_clean for word in ["volunteer", "club", "fundraising", "ieee"]):
            position='home'
            section = "volunteering"
        else:    
            position='home'
            if(not got_ans):
                best_section = None
                best_score = -1
                for sec, answers in cv_sections_sbert.items():
                    sims = [
                        text_representation_cosine_similarity(user_question, ans) 
                        for ans in answers
                    ]
                    if max(sims) > best_score:
                        best_score = max(sims)
                        best_section = sec
                section = best_section if best_section else "skills"
        if(not got_ans):
            answers = cv_sections_sbert[section]

            if section == "skills":
                return(" and ".join(answers),position)

            sims = [
                text_representation_cosine_similarity(user_question, ans) 
                for ans in answers
            ]
            selected = [ans for ans, score in zip(answers, sims) if score >= threshold]

            if not selected:
                selected = [answers[np.argmax(sims)]]

            return (" and ".join(selected),position)
        return (answers,position)

def process_audio_and_respond(audio_data, sample_rate):
    global is_speaking
    # Transcribe speech...
    segments, info = whisper_model.transcribe(
        audio_data,
        beam_size=5,
        language="en",
        condition_on_previous_text=False,
        vad_filter=True,
        vad_parameters=dict(min_silence_duration_ms=500)
    )

    user_question = " ".join([seg.text for seg in segments]).strip()
    if not user_question:
        return

    print(f"📝 You said2: {user_question}")
    answer_text ,section =  NLP_start(user_question)
    print(f"section: {section}")

    print(f"🤖 AI Answer: {answer_text}")

    # 🚨 Pause mic listening while speaking
    is_speaking = True
    engine = pyttsx3.init()
    engine.say(answer_text)
    engine.runAndWait()
    is_speaking = False
    return section

def fetch_pdf_text(url):
    response = requests.get(url)
    response.raise_for_status()
    pdf_file = BytesIO(response.content)
    reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

def summarize_text(text, sentence_count=5):
    parser = PlaintextParser.from_string(text, Tokenizer("english"))
    summarizer = LsaSummarizer()
    summary = summarizer(parser.document, sentence_count)
    return " ".join([str(sentence) for sentence in summary])

def summarize_cv1():
    cv1_url = "http://localhost:3000/cv1.pdf"
    text = fetch_pdf_text(cv1_url)
    return "Summary of cv1:" +summarize_text(text, sentence_count=5)

def summarize_cv2():
    cv2_url = "http://localhost:3000/cv2.pdf"
    text = fetch_pdf_text(cv2_url)
    return "Summary of cv2:" +summarize_text(text, sentence_count=5)

executor = ThreadPoolExecutor(max_workers=2)

def generate_audio_sync(text: str) -> bytes:
    """Synchronous audio generation function to run in thread pool"""
    tts = gTTS(text=text, lang='en', slow=False, tld='com')  # 'com' is faster
    audio_buffer = io.BytesIO()
    tts.write_to_fp(audio_buffer)
    audio_buffer.seek(0)
    
    # Convert MP3 to WAV for better browser compatibility
    audio_segment_response = AudioSegment.from_mp3(audio_buffer)
    wav_buffer = io.BytesIO()
    audio_segment_response.export(wav_buffer, format="wav")
    wav_buffer.seek(0)
    
    return wav_buffer.read()

@nlp_app.post("/stream-audio")
async def stream_audio(file: UploadFile = File(...)):
    global is_speaking

    # If the assistant is speaking, ignore incoming audio to avoid feedback loop
    if is_speaking:
        return {"status": "assistant is speaking, ignoring input"}

    try:
        # Mark as speaking immediately to prevent multiple requests
        is_speaking = True

        # Read uploaded audio
        contents = await file.read()

        # Decode to AudioSegment
        audio_segment = AudioSegment.from_file(io.BytesIO(contents))
        audio_segment = audio_segment.set_frame_rate(16000).set_channels(1)

        # Convert to numpy float32 normalized to [-1, 1]
        audio_np = np.array(audio_segment.get_array_of_samples()).astype(np.float32) / 32768.0

        # --- Step 1: Transcribe using Whisper ---
        segments, _ = whisper_model.transcribe(
            audio_np,
            beam_size=3,
            language="en",
            condition_on_previous_text=False,
            temperature=0.0,
            compression_ratio_threshold=2.4,
            no_speech_threshold=0.6
        )

        user_question = " ".join([seg.text for seg in segments]).strip()

        if not user_question:
            is_speaking = False
            return {"status": "no speech detected", "text": ""}

        print(f"📝 User question: {user_question}")

        # --- Step 2: NLP answer generation ---
        answer_text, section = NLP_start(user_question)
        print(f"🤖 AI Answer: {answer_text}")

        is_speaking = False

        # --- Step 3: Return **text** instead of audio ---
        return {answer_text,
        }

    except Exception as e:
        is_speaking = False
        print(f"❌ Error: {str(e)}")
        return {"error": str(e)}
    
@nlp_app.get("/start-assistant")
def start_assistant():
    global assistant_active, assistant_thread, is_speaking

    if assistant_active:
        return {"status": "Assistant already running"}

    assistant_active = True
    is_speaking = True
    engine = pyttsx3.init()
    engine.say('Hello I am your assistant. How can I help you?')
    engine.runAndWait()
    is_speaking = False

@nlp_app.get("/stop-assistant")
def stop_assistant():
    global assistant_active
    assistant_active = False
    return {"status": "Voice assistant stopped"}
