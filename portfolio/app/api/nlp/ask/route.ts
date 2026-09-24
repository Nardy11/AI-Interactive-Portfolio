import { NextResponse } from "next/server";

type Entry = {
  section: string;
  position: string;
  answer: string;
  aliases?: string[];
};

const entries: Entry[] = [
  { section: "personal", position: "home", answer: "My name is Nardy Attalla. I am a Computer Science and Engineering graduate from the German University in Cairo.", aliases: ["name", "who are you", "nardy attalla"] },
  { section: "personal", position: "contact", answer: "I am from Cairo, Egypt.", aliases: ["where are you from", "location", "cairo", "egypt"] },
  { section: "education", position: "timeline", answer: "I studied Computer Science and Engineering at the German University in Cairo from 2020 to 2025.", aliases: ["education", "university", "guc", "study", "degree"] },
  { section: "education", position: "timeline", answer: "My bachelor thesis was Cooperative Perception and Control (CPAC) for Connected Vehicles, developed with Valeo mentorship. My graduation project received an A+.", aliases: ["thesis", "bachelor project", "cpac", "valeo", "graduation project"] },
  { section: "experience", position: "testimonials", answer: "My experience includes software development, Flutter internships, freelance FlutterFlow work, and software engineering work. I have worked with ESG& Company, GUC, Egyptian Electrical Solution, and other engineering environments.", aliases: ["experience", "work", "internships", "intern", "jobs", "companies"] },
  { section: "experience", position: "testimonials", answer: "At ESG& Company I worked on Flutter and Firebase applications and web functionality.", aliases: ["esg", "esg company", "flutter internship"] },
  { section: "experience", position: "testimonials", answer: "At the German University in Cairo internship, I worked with Flutter and Firebase on application development.", aliases: ["guc internship", "guc intern"] },
  { section: "experience", position: "testimonials", answer: "At Egyptian Electrical Solution (EES), I built a Flutter mobile application and a web dashboard using Firebase.", aliases: ["ees", "egyptian electrical solution"] },
  { section: "projects", position: "projects", answer: "My CPAC project is a computer-vision project for connected vehicles. It used YOLOv5, YOLOv8, TensorFlow, ROS, stereo cameras and LiDAR-related integration.", aliases: ["cpac", "computer vision", "connected vehicles", "yolo", "object detection"] },
  { section: "projects", position: "projects", answer: "I built a heart-failure prediction machine-learning project using classification and clustering techniques.", aliases: ["heart failure", "machine learning project", "ml project"] },
  { section: "projects", position: "projects", answer: "I built a gold-price prediction machine-learning project.", aliases: ["gold price", "gold prediction"] },
  { section: "projects", position: "projects", answer: "I built a virtual mouse using computer vision and hand tracking. It uses MediaPipe and TensorFlow.js in the browser to move a virtual pointer, click, and scroll.", aliases: ["virtual mouse", "computer vision mouse", "hand tracking"] },
  { section: "projects", position: "projects", answer: "This portfolio itself is a Next.js and TypeScript project with interactive computer-vision navigation and an NLP assistant.", aliases: ["portfolio", "website", "nextjs", "next.js"] },
  { section: "projects", position: "projects", answer: "I have built full-stack applications using React, Node.js, Express, MongoDB, Firebase and other backend technologies.", aliases: ["full stack", "fullstack", "backend", "react", "node"] },
  { section: "projects", position: "projects", answer: "I have worked on mobile applications using Flutter, Dart, React Native and Firebase.", aliases: ["mobile", "flutter", "dart", "react native", "apps"] },
  { section: "projects", position: "projects", answer: "I have also worked on game and interactive projects, including Unity-based projects and web games.", aliases: ["games", "unity", "game development"] },
  { section: "skills", position: "skills", answer: "My main web stack includes React, Next.js, TypeScript, JavaScript, Tailwind CSS and Node.js.", aliases: ["web skills", "web stack", "frontend", "front end", "javascript", "typescript"] },
  { section: "skills", position: "skills", answer: "For backend and databases I have worked with Node.js, Express, FastAPI, MongoDB, PostgreSQL, Firebase and Spring Boot.", aliases: ["backend skills", "database", "databases", "express", "fastapi", "spring boot"] },
  { section: "skills", position: "skills", answer: "For machine learning and computer vision I have worked with Python, TensorFlow, PyTorch, YOLO, OpenCV, MediaPipe and ROS.", aliases: ["ml", "machine learning", "ai", "computer vision", "opencv", "tensorflow", "pytorch"] },
  { section: "skills", position: "skills", answer: "I use Docker and Docker Compose and have worked with microservices, RabbitMQ, Redis and Nginx.", aliases: ["docker", "microservices", "rabbitmq", "redis", "nginx", "devops"] },
  { section: "skills", position: "skills", answer: "I use Git for version control and have experience building and deploying web applications.", aliases: ["git", "deployment", "deploy", "github"] },
  { section: "certificates", position: "timeline", answer: "My machine-learning learning includes supervised learning, advanced learning algorithms, unsupervised learning, recommenders, reinforcement learning, and machine learning in production.", aliases: ["certificates", "courses", "machine learning courses", "ml courses"] },
  { section: "languages", position: "home", answer: "My native language is Arabic and I use English professionally. I am also learning French.", aliases: ["languages", "arabic", "english", "french"] },
  { section: "contact", position: "contact", answer: "You can contact me through the email, LinkedIn and GitHub links in the Contact section of the portfolio.", aliases: ["contact", "email", "linkedin", "github", "reach me"] },
];

const stopWords = new Set(["a","an","and","are","as","at","be","but","by","can","do","did","for","from","how","i","in","is","it","me","my","of","on","or","the","this","to","was","what","where","which","who","with","you","your","tell","about"]);

function tokens(text: string): string[] {
  return text.toLowerCase().replace(/next\.js/g, "nextjs").match(/[a-z0-9]+/g)?.filter((token) => !stopWords.has(token)) ?? [];
}

function score(query: string, entry: Entry): number {
  const queryTokens = tokens(query);
  if (!queryTokens.length) return 0;
  const haystack = tokens([entry.answer, ...(entry.aliases ?? [])].join(" "));
  const queryCounts = new Map<string, number>();
  const hayCounts = new Map<string, number>();

  for (const token of queryTokens) queryCounts.set(token, (queryCounts.get(token) ?? 0) + 1);
  for (const token of haystack) hayCounts.set(token, (hayCounts.get(token) ?? 0) + 1);

  let dot = 0;
  let qNorm = 0;
  let hNorm = 0;
  for (const value of queryCounts.values()) qNorm += value * value;
  for (const value of hayCounts.values()) hNorm += value * value;
  for (const [token, value] of queryCounts) dot += value * (hayCounts.get(token) ?? 0);

  const cosine = qNorm && hNorm ? dot / (Math.sqrt(qNorm) * Math.sqrt(hNorm)) : 0;
  const exactAlias = (entry.aliases ?? []).some((alias) => query.toLowerCase().includes(alias.toLowerCase()));
  return cosine + (exactAlias ? 0.65 : 0);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { question?: unknown };
    const question = typeof body.question === "string" ? body.question.trim() : "";

    if (!question) {
      return NextResponse.json({ error: "Question is empty" }, { status: 400 });
    }

    const ranked = entries.map((entry) => ({ entry, score: score(question, entry) })).sort((a, b) => b.score - a.score);
    const best = ranked[0];

    if (!best || best.score < 0.16) {
      return NextResponse.json({
        text: "I could not find a close answer for that. Try asking about my projects, skills, education, experience or technologies.",
        section: "home",
      });
    }

    return NextResponse.json({ text: best.entry.answer, section: best.entry.position });
  } catch (error) {
    console.error("NLP API error:", error);
    return NextResponse.json({ error: "The assistant could not process that question." }, { status: 500 });
  }
}
