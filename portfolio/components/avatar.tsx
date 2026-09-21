"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
// @ts-ignore
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import {
  AnimationMixer,
  Clock,
  LoopOnce,
  Mesh,
  SkinnedMesh,
  AnimationAction,
  LoopRepeat,
} from "three";
import { Mic, Square, Send } from "lucide-react";

interface AvatarOverlayProps {
  isTalking: boolean;
  onTalkingEnd?: () => void;
}

function AvatarModel({ isTalking }: AvatarOverlayProps) {
  const { scene } = useGLTF("/assistant.glb");
  const mixerRef = useRef<AnimationMixer | null>(null);
  const clock = useRef(new Clock());
  const morphMeshesRef = useRef<(Mesh | SkinnedMesh)[]>([]);
  const [idleAction, setIdleAction] = useState<AnimationAction | null>(null);
  const [talkAction, setTalkAction] = useState<AnimationAction | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!scene) return;

    const mixer = new AnimationMixer(scene);
    mixerRef.current = mixer;
    const loader = new FBXLoader();
    let loadedCount = 0;

    loader.load("/idle.fbx", (fbx: any) => {
      if (fbx.animations?.[0]) {
        setIdleAction(mixer.clipAction(fbx.animations[0]).play());
      }
      const morphs: (Mesh | SkinnedMesh)[] = [];
      scene.traverse((child: any) => {
        if ((child.isMesh || child.isSkinnedMesh) && child.morphTargetDictionary) {
          morphs.push(child);
        }
      });
      morphMeshesRef.current = morphs;
      loadedCount += 1;
      if (loadedCount === 2) setIsLoaded(true);
    });

    loader.load("/talking.fbx", (fbx: any) => {
      if (fbx.animations?.[0]) {
        const action = mixer.clipAction(fbx.animations[0]);
        action.loop = LoopOnce;
        action.clampWhenFinished = true;
        setTalkAction(action);
      }
      loadedCount += 1;
      if (loadedCount === 2) setIsLoaded(true);
    });

    return () => mixer.stopAllAction();
  }, [scene]);

  useEffect(() => {
    if (!isLoaded || !mixerRef.current || !idleAction || !talkAction) return;

    if (isTalking) {
      idleAction.fadeOut(0.2);
      talkAction.reset();
      talkAction.fadeIn(0.2);
      talkAction.setLoop(LoopRepeat, Infinity);
      talkAction.play();
    } else {
      if (!idleAction.isRunning()) {
        idleAction.reset();
        idleAction.fadeIn(0.2);
        idleAction.play();
      }
      talkAction.fadeOut(0.2);
    }
  }, [isTalking, isLoaded, idleAction, talkAction]);

  useFrame(() => {
    const mixer = mixerRef.current;
    if (mixer) mixer.update(clock.current.getDelta());

    const time = clock.current.getElapsedTime();
    morphMeshesRef.current.forEach((mesh) => {
      const dict = (mesh as any).morphTargetDictionary;
      const influences = (mesh as any).morphTargetInfluences;
      if (!dict || !influences) return;

      if (isTalking) {
        if (dict.mouthOpen !== undefined) influences[dict.mouthOpen] = Math.max(0, 0.4 + Math.sin(time * 8) * 0.4);
        if (dict.mouthSmile !== undefined) influences[dict.mouthSmile] = 0.1 + Math.sin(time * 3) * 0.15;
        if (dict.mouthFunnel !== undefined) influences[dict.mouthFunnel] = Math.max(0, Math.sin(time * 6 + 1) * 0.3);
        if (dict.mouthPucker !== undefined) influences[dict.mouthPucker] = Math.max(0, Math.sin(time * 5 + 2) * 0.2);
      } else {
        for (let i = 0; i < influences.length; i++) influences[i] *= 0.9;
      }
    });
  });

  if (!scene) return null;
  return <primitive object={scene} rotation={[0.2, 0, 0]} position={[0, -1, 0]} scale={1} />;
}

  const [isTalking, setIsTalking] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [statusText, setStatusText] = useState("💬 Ready");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const API_URL = "https://ai-interactive-portfolio-back-end.vercel.app";

  const processRecording = useCallback(async (audioBlob: Blob) => {
    setStatusText("🤔 Transcribing...");

    try {
      const formData = new FormData();
      const extension = audioBlob.type.includes("mp4") ? "m4a" : "webm";
      formData.append("file", audioBlob, `voice.${extension}`);

      const response = await fetch(`${API_URL}/nlp/stream-audio`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Assistant request failed");
      }

      if (!data.text) {
        setStatusText("❌ No speech detected");
        return;
      }

      setStatusText("🗣️ AI Speaking...");
      setIsTalking(true);

      const utterance = new SpeechSynthesisUtterance(data.text);
      utterance.rate = 1;

      utterance.onend = () => {
        setIsTalking(false);
        setStatusText("💬 Ready");
      };

      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Assistant error:", error);
      setIsTalking(false);
      setStatusText("❌ Assistant error");
    }
  }, [API_URL]);

  const startListening = useCallback(async () => {
    if (isTalking || recognizing) return;

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setStatusText("❌ Audio recording is not supported in this browser");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      audioChunksRef.current = [];

      const preferredTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
      ];
      const mimeType = preferredTypes.find((type) => MediaRecorder.isTypeSupported(type));

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      recorder.onstart = () => {
        setRecognizing(true);
        setStatusText("🎙️ Listening...");
      };

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        setRecognizing(false);
        setStatusText("❌ Recording failed");
      };

      recorder.onstop = async () => {
        setRecognizing(false);
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;

        const chunks = audioChunksRef.current;
        audioChunksRef.current = [];

        if (!chunks.length) {
          setStatusText("❌ No audio captured");
          return;
        }

        const blob = new Blob(chunks, {
          type: recorder.mimeType || "audio/webm",
        });

        await processRecording(blob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
    } catch (error) {
      console.error("Microphone error:", error);
      setStatusText("❌ Microphone permission denied");
    }
  }, [isTalking, recognizing, processRecording]);

  const stopListening = useCallback(() => {
    const recorder = mediaRecorderRef.current;

    if (recorder && recorder.state !== "inactive") {
      setStatusText("🤔 Processing...");
      recorder.stop();
    }

    mediaRecorderRef.current = null;
    setRecognizing(false);
  }, []);

  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stop();
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      speechSynthesis.cancel();
    };
  }, []);

  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

export default function AvatarOverlay() {
  const [isTalking, setIsTalking] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [statusText, setStatusText] = useState("💬 Ready");

  const recognitionRef = useRef<any>(null);

  const API_URL = "https://ai-interactive-portfolio-back-end.vercel.app";

  const getSpeechRecognition = () => {
    if (typeof window === "undefined") return null;
    return (
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      null
    );
  };

  const startListening = useCallback(() => {
    const SpeechRecognitionCtor = getSpeechRecognition();

    if (!SpeechRecognitionCtor) {
      setStatusText("❌ Speech recognition is not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setRecognizing(true);
      setStatusText("🎙️ Listening...");
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event);
      setRecognizing(false);
      setStatusText("❌ Could not understand speech");
    };

    recognition.onend = () => {
      setRecognizing(false);
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim();

      if (!transcript) {
        setStatusText("❌ No speech detected");
        return;
      }

      setStatusText("🤔 Thinking...");

      try {
        const response = await fetch(`${API_URL}/nlp/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: transcript }),
        });

        const data = await response.json();

        if (!response.ok || data.error) {
          throw new Error(data.error || "Assistant request failed");
        }

        setStatusText("🗣️ AI Speaking...");
        setIsTalking(true);

        const utterance = new SpeechSynthesisUtterance(data.text || "");
        utterance.rate = 1;

        utterance.onend = () => {
          setIsTalking(false);
          setStatusText("💬 Ready");
        };

        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
      } catch (error) {
        console.error("Assistant error:", error);
        setIsTalking(false);
        setStatusText("❌ Assistant error");
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [API_URL]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop?.();
    recognitionRef.current = null;
    setRecognizing(false);
    setStatusText("💬 Ready");
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop?.();
      speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="fixed bottom-0 right-0 h-screen w-[400px] z-50 pointer-events-none">
      <Canvas camera={{ position: [0.5, 0.5, 3], fov: 40 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[2, 2, 2]} intensity={0.6} />
        <pointLight position={[-2, 2, 2]} intensity={0.4} />
        <AvatarModel isTalking={isTalking} />
      </Canvas>

      <div className="absolute bottom-10 right-10 z-50 pointer-events-auto">
        <div className="flex flex-col space-y-3">
          <button
            className="flex items-center justify-center px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg disabled:opacity-50"
            onClick={recognizing ? stopListening : startListening}
            disabled={isTalking}
          >
            {recognizing ? <Square className="w-5 h-5 mr-2" /> : <Mic className="w-5 h-5 mr-2" />}
            {recognizing ? "Stop" : "Ask"}
          </button>

          <button
            className="flex items-center justify-center px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
            onClick={() => {
              speechSynthesis.cancel();
              setIsTalking(false);
              setStatusText("💬 Ready");
            }}
          >
            <Send className="w-5 h-5 mr-2" />
            Stop Voice
          </button>

          <div className="text-center text-xl">{statusText}</div>
        </div>
      </div>
    </div>
  );
}
