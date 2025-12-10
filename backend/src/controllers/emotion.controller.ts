// backend/src/controllers/emotion.controller.ts
import { Request, Response } from "express";
import { detectEmotion } from "../services/emotion.service.js";

// Emotion to action mapping for autistic children
function getActionFromEmotion(emotion: string, confidence: number): string {
    const normalizedEmotion = emotion.toLowerCase();
    
    // Lower threshold since model predictions are not very confident
    const CONFIDENCE_THRESHOLD = 0.35;
    
    // Emotions that require calming intervention
    const CALMING_EMOTIONS = ["fear", "sad", "angry", "stressed"];
    
    // Positive/neutral emotions
    const NORMAL_EMOTIONS = ["happy", "calm", "neutral", "surprise"];
    
    console.log(`🎯 Evaluating emotion: ${normalizedEmotion} (confidence: ${confidence.toFixed(3)})`);
    
    if (confidence < CONFIDENCE_THRESHOLD) {
        // Very low confidence - don't switch modes
        console.log(`⚠️ Confidence too low (${confidence.toFixed(3)} < ${CONFIDENCE_THRESHOLD})`);
        return "stay";
    }
    
    if (CALMING_EMOTIONS.includes(normalizedEmotion)) {
        console.log(`🚨 CALMING emotion detected: ${normalizedEmotion}`);
        return "calm";
    } else if (NORMAL_EMOTIONS.includes(normalizedEmotion)) {
        console.log(`✅ NORMAL emotion detected: ${normalizedEmotion}`);
        return "normal";
    }
    
    // Default to stay if emotion is unrecognized
    console.log(`❓ Unrecognized emotion: ${normalizedEmotion}`);
    return "stay";
}

export async function detectEmotionController(req: Request, res: Response) {
    try {
        console.log("🎭 Emotion detection request received");
        
        const files = (req as any).files;
        
        console.log("📦 Files in request:", Object.keys(files || {}));
        
        if (!files || !files.image) {
            console.warn("❌ No image file in request");
            return res.status(400).json({ error: "image file required" });
        }

        console.log("📸 Image file size:", files.image.data.length, "bytes");
        
        let audio: Buffer | undefined = undefined;
        if (files.audio) {
            audio = files.audio.data as Buffer;
            console.log("🎤 ✅ AUDIO FILE FOUND:", audio.length, "bytes");
        } else {
            console.log("🎤 ❌ NO AUDIO FILE in request");
        }

        const image = files.image.data as Buffer;

        // Call ML service
        const inference = await detectEmotion(image, audio);
        
        console.log("🤖 ML Inference result:", inference);

        // Handle error from ML service
        if (inference?.error) {
            console.error("❌ ML service error:", inference.error);
            return res.status(500).json({ error: inference.error });
        }

        const emotion = inference.emotion || "neutral";
        const confidence = inference.confidence ?? 0.5;
        const method = inference.method || "unknown";

        // Determine action based on emotion and confidence
        const action = getActionFromEmotion(emotion, confidence);

        console.log(`✅ Detected: ${emotion} (${confidence.toFixed(2)}) → ${action} [${method}]`);

        return res.json({ 
            emotion, 
            confidence, 
            action,
            method,
            details: inference.details || null,
            all_scores: inference.all_scores || null
        });
    } catch (error) {
        console.error("💥 detectEmotionController error:", error);
        return res.status(500).json({ 
            error: "Failed to detect emotion",
            details: error instanceof Error ? error.message : String(error)
        });
    }
}