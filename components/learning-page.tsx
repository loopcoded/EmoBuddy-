"use client";

import { useState, useEffect, useRef } from "react";
import { CalmingGameSequence } from "./learning-journey/calmgames/calming-game-sequence";
import Level1Journey from "./learning-journey/level1-journey";
import Level2Journey from "./learning-journey/level2-journey";
import Level3Journey from "./learning-journey/level3-journey";

interface ChildProfile {
  _id: string;
  name: string;
  autismSupportLevel: number;
  currentLevel: number;
  avatarConfig?: Record<string, unknown>;
}

interface LearningPageProps {
  childID: string;
  profile: ChildProfile;
}

export default function LearningPage({ childID, profile }: LearningPageProps) {
  const [isCalmingMode, setIsCalmingMode] = useState(false);
  const [lastModuleID, setLastModuleID] = useState<number | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<string[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [audioDebug, setAudioDebug] = useState<string>("Initializing...");

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Prediction buffer for smoothing
  const predictionsRef = useRef<{ emotion: string; confidence: number }[]>([]);

  // ------------------------------------------------------------
  // CAMERA + MIC SETUP (COMPLETELY REWRITTEN)
  // ------------------------------------------------------------
  useEffect(() => {
    let isActive = true;

    const enableMedia = async () => {
      try {
        console.log("🎥 Requesting camera and microphone access...");
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 }
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100
          },
        });

        if (!isActive) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        streamRef.current = stream;

        // Setup video
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          console.log("✅ Video feed active");
        }

        // Setup audio recording with proper mime type detection
        let mimeType = "";
        const possibleTypes = [
          "audio/webm;codecs=opus",
          "audio/webm",
          "audio/ogg;codecs=opus",
          "audio/mp4"
        ];

        for (const type of possibleTypes) {
          if (MediaRecorder.isTypeSupported(type)) {
            mimeType = type;
            break;
          }
        }

        if (!mimeType) {
          console.error("❌ No supported audio mime type found!");
          setAudioDebug("No audio format supported");
          return;
        }

        console.log(`🎤 Using audio format: ${mimeType}`);
        setAudioDebug(`Recording: ${mimeType}`);

        const mediaRecorder = new MediaRecorder(stream, {
          mimeType,
          audioBitsPerSecond: 128000
        });

        mediaRecorderRef.current = mediaRecorder;

        // CRITICAL: Reset chunks when starting
        audioChunksRef.current = [];
        let chunkCount = 0;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            chunkCount++;
            audioChunksRef.current.push(event.data);
            
            // Keep only last 3 seconds worth (3 chunks of 1s each)
            if (audioChunksRef.current.length > 3) {
              audioChunksRef.current.shift();
            }
            
            const totalSize = audioChunksRef.current.reduce((sum, chunk) => sum + chunk.size, 0);
            console.log(`🎤 Chunk #${chunkCount}: ${event.data.size} bytes (total: ${totalSize} bytes, ${audioChunksRef.current.length} chunks)`);
            setAudioDebug(`Chunks: ${audioChunksRef.current.length}, Size: ${totalSize}b`);
          }
        };

        mediaRecorder.onerror = (event) => {
          console.error("❌ MediaRecorder error:", event);
          setAudioDebug("Recording error");
        };

        mediaRecorder.onstart = () => {
          console.log("✅ MediaRecorder started");
          audioChunksRef.current = []; // Clear on start
        };

        mediaRecorder.onstop = () => {
          console.log("⚠️ MediaRecorder stopped");
        };

        // Start recording in 1-second chunks
        mediaRecorder.start(1000);
        console.log("🎤 Audio recording started with 1s chunks");

      } catch (err) {
        console.error("❌ Media setup error:", err);
        setAudioDebug(`Error: ${err}`);
      }
    };

    enableMedia();

    return () => {
      isActive = false;
      
      // Cleanup
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log(`Stopped ${track.kind} track`);
        });
      }

      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // ------------------------------------------------------------
  // EMOTION DETECTION LOOP (WITH AUDIO FIX)
  // ------------------------------------------------------------
  useEffect(() => {
    const detectEmotion = async () => {
      if (isCalmingMode || isDetecting) return;
      
      setIsDetecting(true);

      try {
        const video = videoRef.current;
        if (!video || video.readyState < 2) {
          setIsDetecting(false);
          return;
        }

        // Capture video frame
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          setIsDetecting(false);
          return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageBlob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", 0.85)
        );

        if (!imageBlob) {
          setIsDetecting(false);
          return;
        }

        // Create audio blob from accumulated chunks
        let audioBlob: Blob | null = null;
        const chunks = audioChunksRef.current;
        
        console.log(`🎤 Available audio chunks: ${chunks.length}`);
        
        if (chunks.length > 0) {
          const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
          console.log(`🎤 Total audio size: ${totalSize} bytes`);
          
          if (totalSize > 100) { // Very low threshold
            const mimeType = mediaRecorderRef.current?.mimeType || "audio/webm";
            audioBlob = new Blob([...chunks], { type: mimeType });
            console.log(`✅ Created audio blob: ${audioBlob.size} bytes, type: ${audioBlob.type}`);
          } else {
            console.log("⚠️ Audio too small, skipping");
          }
        } else {
          console.log("⚠️ No audio chunks available");
        }

        // Prepare form data
        const form = new FormData();
        form.append("image", imageBlob, "frame.jpg");

        if (audioBlob) {
          form.append("audio", audioBlob, "audio.webm");
          console.log("✅ Audio INCLUDED in request");
        } else {
          console.log("⚠️ Audio NOT included (sending image only)");
        }

        // Send request
        console.log("📤 Sending emotion detection request...");
        const res = await fetch("/api/emotion/detect", {
          method: "POST",
          body: form,
        });

        if (!res.ok) {
          console.warn(`⚠️ API error: ${res.status}`);
          setIsDetecting(false);
          return;
        }

        const data = await res.json();
        console.log("🎯 Emotion detected:", data);

        const emotion = data.emotion?.toLowerCase() || "neutral";
        const confidence = Number(data.confidence ?? 0);

        // Update history
        setEmotionHistory((prev) => [...prev, emotion].slice(-5));

        // Update prediction buffer for smoothing
        predictionsRef.current.push({ emotion, confidence });
        if (predictionsRef.current.length > 5) {
          predictionsRef.current.shift();
        }

        // Check for sustained negative emotions (3 consecutive)
        const recent = predictionsRef.current.slice(-3);
        const negativeCount = recent.filter(p => 
          ["angry", "sad", "fear"].includes(p.emotion) && p.confidence > 0.35
        ).length;

        const positiveCount = recent.filter(p => 
          ["happy", "neutral", "calm", "surprise"].includes(p.emotion) && p.confidence > 0.35
        ).length;

        // Switch to calming mode if 3 consecutive negative emotions
        if (negativeCount >= 3 && !isCalmingMode) {
          console.log("🚨 SUSTAINED negative emotion detected - switching to CALMING mode");
          setIsCalmingMode(true);
        }

        // Return to normal if 3 consecutive positive emotions while in calming mode
        if (positiveCount >= 3 && isCalmingMode) {
          console.log("✅ SUSTAINED positive emotion - returning to LEARNING mode");
          setIsCalmingMode(false);
        }

      } catch (err) {
        console.error("❌ Emotion detection error:", err);
      } finally {
        setIsDetecting(false);
      }
    };

    // Run detection every 2 seconds
    detectionIntervalRef.current = setInterval(detectEmotion, 2000);

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [isCalmingMode, isDetecting]);

  // ------------------------------------------------------------
  // CALMING MODE COMPLETION
  // ------------------------------------------------------------
  const handleCalmingComplete = () => {
    console.log("✅ Calming sequence completed");
    setIsCalmingMode(false);
    predictionsRef.current = []; // Reset buffer
    
    if (lastModuleID !== null) {
      window.location.hash = `#module-${lastModuleID}`;
    }
  };

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  if (isCalmingMode) {
    return (
      <>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            width: "1px",
            height: "1px",
            opacity: 0,
            position: "absolute",
            pointerEvents: "none",
          }}
        />
        <CalmingGameSequence onComplete={handleCalmingComplete} />
      </>
    );
  }

  // Select learning journey based on autism support level
  let content = null;

  switch (profile.autismSupportLevel) {
    case 1:
      content = (
        <Level1Journey
          childID={childID}
          onProgressClick={() => window.history.back()}
          onModuleChange={(id) => setLastModuleID(id)}
        />
      );
      break;

    case 2:
      content = (
        <Level2Journey
          childID={childID}
          onProgressClick={() => window.history.back()}
          onModuleChange={(id) => setLastModuleID(id)}
        />
      );
      break;

    case 3:
      content = (
        <Level3Journey
          childID={childID}
          onProgressClick={() => window.history.back()}
          onModuleChange={(id) => setLastModuleID(id)}
        />
      );
      break;

    default:
      content = (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-pink-50">
          <p className="text-gray-600 text-lg">Loading learning journey...</p>
        </div>
      );
  }

  return (
    <>
      {/* Hidden video element for emotion detection */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: "1px",
          height: "1px",
          opacity: 0,
          position: "absolute",
          pointerEvents: "none",
        }}
      />

      {/* Debug panel
      <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs z-50 max-w-xs">
        <div className="font-bold mb-2">🎥 Emotion Detection Status</div>
        <div>Mode: {isCalmingMode ? "🧘 Calming" : "📚 Learning"}</div>
        <div>Detecting: {isDetecting ? "⏳ Yes" : "✅ Idle"}</div>
        <div>Audio: {audioDebug}</div>
        <div>Recent emotions: {emotionHistory.slice(-3).join(", ") || "None yet"}</div>
        <div className="mt-2 text-xs opacity-70">
          Negative emotions (3x) → Calming mode
        </div>
      </div> */}

      {content}
    </>
  );
}