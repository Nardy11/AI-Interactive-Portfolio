import os
import re
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

nlp_app = FastAPI()

allowed_origins = [
    origin.strip()
    for origin in os.getenv("FRONTEND_URLS", "http://localhost:3000").split(",")
    if origin.strip()
]
nlp_app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

faq_pairs = {
    "What is your name?": "my name is Nardy Attaalla",
    "How old are you?": "I'm 22-year-old",
    "Where are you from?": "I am from Cairo, Egypt.",
    "Where do you live?": "I currently live in Heliopolis, Cairo.",
    "What is your nationality?": "I am Egyptian.",
    "What is your email?": "My email address is nardymichelle2003@gmail.com.",
    "What is your phone number?": "My phone number is +20 01286290269.",
    "What is your github?": "My GitHub profile is Nardy11",
    "What is your linkedin?": "My LinkedIn profile is nardy-attallah.",
    "What did you study?": "I studied Computer Science and Engineering at the German University in Cairo from October 2020 to July 2025.",
    "What degree do you have?": "I earned a Bachelor of Science degree with a thesis on Cooperative Perception and Control for Connected Vehicles.",
    "What was your bachelor thesis?": "My bachelor project was graded Excellent (A+).",
    "Where did you intern?": "I worked as a Flutter app developer intern at ESG& Company in Cairo from June to August 2024.",
    "What did you do at esg company?": "At ESG& Company, I developed mobile apps and a website using Flutter and Firebase for multiple roles.",
    "Did you intern at guc?": "I interned as a fullstack Flutter and Firebase developer at the German University in Cairo from August to October 2024.",
    "What did you do at guc internship?": "During the German University in Cairo internship, I developed both frontend Flutter apps and backend Firebase services as part of a team.",
    "Did you work at ees?": "I worked as a Flutter app developer intern at Egyptian Electrical Solution (EES) in March 2025.",
    "What did you do at ees?": "At EES, I built a Flutter mobile app and a web dashboard using Firebase to manage factory materials and products.",
    "Tell me about your heart failure project?": "I developed a machine learning project to predict heart failure using real medical datasets, including classification and clustering models.",
    "What was your bachelor project?": "I built a computer vision machine learning project for my bachelor (CPAC) using YOLOv5, YOLOv8, and TensorFlow for object detection, lane detection, and autonomous driving integration with LiDAR, ROS, and stereo cameras.",
    "What did you do in mentorness internship?": "During my Mentorness internship, I conducted a data analysis project and created visualizations with PowerBI while managing SQL datasets.",
    "Did you build a virtual mouse?": "I implemented a virtual mouse in this portfolio website using computer vision libraries such as OpenCV and MediaPipe.",
    "Are you also a virtual assistant?": "I implemented a virtual assistant in this portfolio website using NLP techniques.",
    "What apps did you build?": "I developed an e-commerce application using React Native and Firebase, implementing user authentication, product catalog, and shopping cart functionalities.",
    "Did you work with climate edge company?": "I built a Flutter + Firebase website and app for Climate Edge Company to monitor industrial pollution with secure login, data submission workflows, and a pollution calculator.",
    "What is eescalculator?": "I created a Flutter scientific calculator app called eesCalculator with product data storage and interactive calculations.",
    "Did you make any websites?": "I developed an interactive website of games using HTML, CSS, and JavaScript with mini-games like Rock-Paper-Scissors and Tic-Tac-Toe.",
    "What is elhaani clinic project?": "I created a full-stack website named Elhaani Virtual Clinic using React, Redux, Node.js, Express, MongoDB, and Stripe payments, with patient-doctor management, appointments, chat/video calls, and admin dashboards.",
    "Did you build your portfolio?": "I developed this portfolio website using Next.js and Tailwind as the frontend with FastAPI as the backend.",
    "Did you do spring boot projects?": "I implemented a backend e-commerce system using Spring Boot with user, product, cart, and order management, including 75 unit tests for CRUD operations.",
    "What social media project did you build?": "I built a social media backend using Spring Boot, MongoDB, and Docker, with REST APIs, Nginx load balancing, and JMeter performance testing.",
    "What ride sharing app did you make?": "I developed a ride-sharing service backend using Spring Boot, PostgreSQL, and MongoDB with complete CRUD operations and layered architecture.",
    "Did you build any games?": "I developed a Marvel-themed Java OOP game using object-oriented programming principles and design patterns.",
    "What is diablo crimson abyss?": "I built Diablo Crimson Abyss game, an action RPG in Unity with dynamic environments and RPG mechanics.",
    "Did you do any vr projects?": "I created a VR gaming experience for L'Oreal using Unity with AI-generated characters.",
    "Did you do any ar projects?": "I developed an AR game Yu-Gi-Oh! project using Unity and marker-based tracking for augmented reality gameplay.",
    "What certificates do you have?": "I earned AI and machine learning certificates from Helsinki University and DeepLearning.AI, along with web development and SQL certificates.",
    "Did you complete building ai?": "I completed the Building AI Certificate in July 2023.",
    "Did you study supervised learning?": "I finished the Supervised Machine Learning course in January 2025.",
    "What did you learn in advanced learning algorithms?": "I completed the Advanced Learning Algorithms course in January 2025.",
    "What did you learn in unsupervised learning?": "I completed the Unsupervised Learning, Recommenders, and Reinforcement Learning course in January 2025.",
    "What is your ml in production certificate?": "I earned the Machine Learning in Production Certificate from DeepLearning.AI in February 2025.",
    "Do you know web development?": "I completed the Web Development Challenger Track in May 2022.",
    "Do you know sql?": "I earned a SQL Certificate from SoloLearn in October 2022.",
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
    "What languages do you speak?": "My mother tongue is Arabic.",
    "Do you speak english?": "I speak English at the B2 level.",
    "Are you bilingual?": "I am bilingual in Arabic and English.",
    "Did you volunteer?": "I was part of the marketing and fundraising team at BRUKE Student Club in Cairo, securing sponsorships and organizing events.",
    "What events did you work at?": "I worked as an usher in events including Water Day, COVID-19 awareness campaigns, and Phoenix events.",
    "Did you join ieee?": "I participated in the Web Development IEEE Student Branch and earned the Most Committed Member award.",
}

sections = {
    "skills": ["I am proficient in Python, SQL, JavaScript, React, React Native, Flutter, Spring Boot, PostgreSQL, MongoDB, Docker, Redis, RabbitMQ, Nginx, Git, and microservices."],
    "projects": [
        "I developed machine learning, computer vision, mobile, web, backend, Unity, VR, and AR projects.",
        "My portfolio includes a browser-side virtual mouse and an NLP-powered virtual assistant.",
    ],
    "education": ["I studied Computer Science and Engineering at the German University in Cairo from October 2020 to July 2025."],
    "experience": ["I completed internships at ESG& Company, the German University in Cairo, Egyptian Electrical Solution, and Mentorness."],
    "certificates": ["I completed certificates and courses in AI, machine learning, production ML, web development, and SQL."],
    "volunteering": ["I participated in BRUKE Student Club and the IEEE Student Branch at GUC."],
    "personal": ["I am Nardy Attaalla, an Egyptian computer science and engineering graduate based in Cairo."],
    "languages": ["My mother tongue is Arabic and I speak English at B2 level."],
}

def text_preprocessing(sentence: str) -> str:
    return " ".join(re.findall(r"[a-z0-9]+", sentence.lower()))

def keyword_section(question: str) -> str:
    q = text_preprocessing(question)
    if any(word in q.split() for word in ["skill", "skills", "framework", "technology", "tool", "database"]):
        return "skills"
    if any(word in q.split() for word in ["project", "projects", "developed", "built", "application", "app", "website", "game", "machine"]):
        return "projects"
    if any(word in q.split() for word in ["certificate", "certificates", "course", "track"]):
        return "certificates"
    if any(word in q.split() for word in ["education", "study", "studied", "university", "thesis", "degree"]):
        return "education"
    if any(word in q.split() for word in ["experience", "worked", "intern", "job", "company"]):
        return "experience"
    if any(word in q.split() for word in ["volunteer", "club", "fundraising", "ieee"]):
        return "volunteering"
    return "personal"

def normalize_question(question: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", question.lower()).strip()

def NLP_start(user_question: str):
    normalized = normalize_question(user_question)

    for question, answer in faq_pairs.items():
        if normalized == normalize_question(question):
            return answer, "home"

    section = keyword_section(user_question)
    answers = sections.get(section, sections["personal"])
    tokens = set(normalized.split())

    if tokens:
        scored = sorted(
            answers,
            key=lambda answer: len(tokens.intersection(set(text_preprocessing(answer).split()))),
            reverse=True,
        )
        return scored[0], section

    return answers[0], section

@nlp_app.post("/stream-audio")
async def stream_audio(file: UploadFile = File(...)):
    try:
        await file.read()
        return {
            "text": "Voice recognition is handled in the browser. Please use the Ask button in the portfolio assistant.",
            "section": "home",
        }
    except Exception as exc:
        return {"error": str(exc)}

@nlp_app.get("/start-assistant")
def start_assistant():
    return {"status": "Voice assistant ready"}

@nlp_app.get("/stop-assistant")
def stop_assistant():
    return {"status": "Voice assistant stopped"}

@nlp_app.get("/cv1-summary")
def cv1_summary():
    return {"text": f"CV1 is available here: {os.getenv('CV1_URL', '/cv1.pdf')}"}

@nlp_app.get("/cv2-summary")
def cv2_summary():
    return {"text": f"CV2 is available here: {os.getenv('CV2_URL', '/cv2.pdf')}"}
