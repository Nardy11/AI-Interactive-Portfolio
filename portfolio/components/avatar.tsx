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
  AnimationAction, LoopRepeat
} from "three";
import { Mic, Square, Send } from "lucide-react";

interface AvatarOverlayProps {
  isTalking: boolean;
  onTalkingEnd?: () => void;
}

function AvatarModel({ isTalking, onTalkingEnd }: AvatarOverlayProps) {
  const { scene } = useGLTF("/assistant.glb");
  const mixerRef = useRef<AnimationMixer | null>(null);
  const clock = useRef(new Clock());
  const morphMeshesRef = useRef<(Mesh | SkinnedMesh)[]>([]);
  const [idleAction, setIdleAction] = useState<AnimationAction | null>(null);
  const [talkAction, setTalkAction] = useState<AnimationAction | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const finishedListenerRef = useRef<((event: any) => void) | null>(null);
  var   rotate =0;

  useEffect(() => {
    if (!scene) return;

    const mixer = new AnimationMixer(scene);
    mixerRef.current = mixer;

    const loader = new FBXLoader();
    let loadedCount = 0;

    // Load idle animation
    loader.load(
      "/idle.fbx",
      (fbx: any) => {
        try {
          if (fbx.animations && fbx.animations[0]) {
            const action = mixer.clipAction(fbx.animations[0]);
            action.play();
            setIdleAction(action);
          }

          // Collect morph meshes from the main scene
          const morphs: (Mesh | SkinnedMesh)[] = [];
          scene.traverse((child: any) => {
            if ((child.isMesh || child.isSkinnedMesh) && child.morphTargetDictionary) {
              morphs.push(child);
            }
          });
          morphMeshesRef.current = morphs;

          loadedCount++;
          if (loadedCount === 2) setIsLoaded(true);
        } catch (error) {
          console.error("Error loading idle animation:", error);
        }
      }
    );

    // Load talking animation
    loader.load(
      "/talking.fbx",
      (fbx: any) => {
        try {
          if (fbx.animations && fbx.animations[0]) {
            const action = mixer.clipAction(fbx.animations[0]);
            action.loop = LoopOnce;
            action.clampWhenFinished = true;
            setTalkAction(action);
          }

          loadedCount++;
          if (loadedCount === 2) setIsLoaded(true);
        } catch (error) {
          console.error("Error loading talking animation:", error);
        }
      }
    );

    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
    };
  }, [scene]);

  useEffect(() => {
    if (!isLoaded || !mixerRef.current || !idleAction || !talkAction) return;

    const mixer = mixerRef.current;

    if (isTalking) {
      // Fade out idle, play talking in loop
      idleAction.fadeOut(0.2);
      talkAction.reset();
      talkAction.fadeIn(0.2);
      talkAction.setLoop(LoopRepeat, Infinity); // <-- loop infinitely
      talkAction.play();
    } else {
      // Stop talking, go back to idle
      if (!idleAction.isRunning()) {
        idleAction.reset();
        idleAction.fadeIn(0.2);
        idleAction.play();
      }
      talkAction.fadeOut(0.2);
    }
  }, [isTalking, isLoaded, idleAction, talkAction]);

  // Animation loop and morph target animation
  useFrame(() => {
    const mixer = mixerRef.current;
    if (mixer) {
      mixer.update(clock.current.getDelta());
    }

    if (isTalking) {
      // Animate morph targets for lip sync
      const time = clock.current.getElapsedTime();

      morphMeshesRef.current.forEach((mesh) => {
        const dict = (mesh as any).morphTargetDictionary;
        const influences = (mesh as any).morphTargetInfluences;
        if (!dict || !influences) return;

        // More realistic mouth movement patterns
        if (dict.mouthOpen !== undefined) {
          influences[dict.mouthOpen] = Math.max(0, 0.4 + Math.sin(time * 8) * 0.4);
        }
        if (dict.mouthSmile !== undefined) {
          influences[dict.mouthSmile] = 0.1 + Math.sin(time * 3) * 0.15;
        }
        if (dict.mouthFunnel !== undefined) {
          influences[dict.mouthFunnel] = Math.max(0, Math.sin(time * 6 + 1) * 0.3);
        }
        if (dict.mouthPucker !== undefined) {
          influences[dict.mouthPucker] = Math.max(0, Math.sin(time * 5 + 2) * 0.2);
        }
      });
    } else {
      // Gradually reset morph targets when not talking
      morphMeshesRef.current.forEach((mesh) => {
        const influences = (mesh as any).morphTargetInfluences;
        if (!influences) return;

        for (let i = 0; i < influences.length; i++) {
          influences[i] *= 0.9; // Gradual fade out
        }
      });
    }
  });

  if (!scene) return null;

  return (
    <primitive
      object={scene}
      rotation={[0.2, 0, 0]}
      position={[0, -1, 0]}
      scale={1}
    />
  );
}

// PCM → WAV encoder function
function audioBufferToWav(buffer: AudioBuffer) {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const result = new DataView(new ArrayBuffer(length));
  let offset = 0;

  function writeString(s: string) {
    for (let i = 0; i < s.length; i++) {
      result.setUint8(offset + i, s.charCodeAt(i));
    }
    offset += s.length;
  }

  function writeUint32(d: number) {
    result.setUint32(offset, d, true);
    offset += 4;
  }

  function writeUint16(d: number) {
    result.setUint16(offset, d, true);
    offset += 2;
  }

  // RIFF header
  writeString("RIFF");
  writeUint32(length - 8);
  writeString("WAVE");

  // fmt chunk
  writeString("fmt ");
  writeUint32(16);
  writeUint16(1);
  writeUint16(numOfChan);
  writeUint32(buffer.sampleRate);
  writeUint32(buffer.sampleRate * numOfChan * 2);
  writeUint16(numOfChan * 2);
  writeUint16(16);

  // data chunk
  writeString("data");
  writeUint32(length - offset - 4);

  const channels: Float32Array[] = [];
  for (let i = 0; i < numOfChan; i++) {
    channels.push(buffer.getChannelData(i));
  }

  let interleaved = new Float32Array(buffer.length * numOfChan);
  let index = 0;
  for (let i = 0; i < buffer.length; i++) {
    for (let j = 0; j < numOfChan; j++) {
      interleaved[index++] = channels[j][i];
    }
  }

  let volume = 1;
  for (let i = 0; i < interleaved.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, interleaved[i] * volume));
    result.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return result.buffer;
}

export default function AvatarOverlay() {

  const [isTalking, setIsTalking] = useState(false);
  // 🎙️ Mic streaming states
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  // 🔊 Audio playback state
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const handleTalkingEnd = useCallback(() => {
    setIsTalking(false);
  }, []);

  // Convert WebM/Opus blob -> WAV Blob (no saving, just in-memory)
  const convertWebmToWav = async (blob: Blob): Promise<Blob> => {
    const arrayBuffer = await blob.arrayBuffer();
    const audioCtx = new AudioContext();
    const decoded = await audioCtx.decodeAudioData(arrayBuffer);

    // Create WAV from raw PCM
    const wavBuffer = audioBufferToWav(decoded);
    return new Blob([wavBuffer], { type: "audio/wav" });
  };

  // ✅ Start recording but don't send yet
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecordedChunks([]);
      console.log("🎙️ Recording started...");
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert('Could not access microphone. Please check your permissions.');
    }
  };

  // 🛑 Stop recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setMediaRecorder(null);
      console.log("🛑 Recording stopped.");
    }
  };

  const [statusText, setStatusText] = useState("💬 Ready to record");

  const sendRecording = async () => {
  if (recordedChunks.length === 0) return;

  const blob = new Blob(recordedChunks, { type: "audio/webm" });
  const wavBlob = await convertWebmToWav(blob);
  const formData = new FormData();
  formData.append("file", wavBlob, `recording-${Date.now()}.wav`);
  setRecordedChunks([]);

  setStatusText("🤔 Thinking...");

  try {
      const response = await fetch("http://localhost:8000/nlp/stream-audio", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const  text  = await response.json(); // backend returns { text: "..." }
      console.log("Recognized text:", text);

      setStatusText("🗣️ AI Speaking...");
      setIsTalking(true);

      // Frontend TTS
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = speechSynthesis.getVoices().find(v => v.name.includes("Male")) || null;
      utterance.rate = 1; // normal speed
      utterance.onend = () => {
        setIsTalking(false);
        setStatusText("💬 Ready to record");
      };
      speechSynthesis.speak(utterance);
    } else {
      setStatusText("❌ Failed to get response");
    }
  } catch (err) {
    console.error(err);
    setStatusText("❌ Error occurred");
  }
};


  // Computed states based on mediaRecorder and recordedChunks
  const isRecording = mediaRecorder !== null;
  const hasRecording = recordedChunks.length > 0 && !isRecording;

  return (
    <div className="fixed bottom-0 right-0 h-screen w-[400px] z-50 pointer-events-none">
      <Canvas camera={{ position: [0.5, 0.5, 3], fov: 40 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[2, 2, 2]} intensity={0.6} />
        <pointLight position={[-2, 2, 2]} intensity={0.4} />
        <AvatarModel isTalking={isTalking} onTalkingEnd={handleTalkingEnd} />
      </Canvas>

      <div className="absolute bottom-10 right-10 z-50 pointer-events-auto">
        <div className="flex flex-col space-y-3">
          {/* Record Button */}
          <button
            className={`flex items-center justify-center px-4 py-2 rounded-full transition-all duration-200 ${isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-green-500 hover:bg-green-600'
              } text-white shadow-lg`}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isTalking}
          >
            <Mic className="w-5 h-5 mr-2" />
            {isRecording ? 'Recording...' : 'Record'}
          </button>

          {/* Stop Button */}
          <button
            className="flex items-center justify-center px-4 py-2 rounded-full bg-gray-500 hover:bg-gray-600 text-white shadow-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={stopRecording}
            disabled={!isRecording}
          >
            <Square className="w-5 h-5 mr-2" />
            Stop
          </button>

          {/* Send Button */}
          <button
            className="flex items-center justify-center px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={sendRecording}
            disabled={!hasRecording || isTalking}
          >
            <Send className="w-5 h-5 mr-2" />
            Send
          </button>

          <div className="text-center text-xl">
            {statusText}
          </div>

        </div>
      </div>
    </div>
  );
}