// backend/src/services/emotion.service.ts
import axios from "axios";
import FormData from "form-data";

const INFERENCE_URL = process.env.INFERENCE_URL || "http://localhost:8005/predict-emotion";

export async function detectEmotion(image: Buffer, audio?: Buffer) {
    try {
        console.log("🔗 Calling ML service at:", INFERENCE_URL);
        
        const form = new FormData();

        form.append("image", image, {
            filename: "frame.jpg",
            contentType: "image/jpeg",
        });

        if (audio) {
            form.append("audio", audio, {
                filename: "audio.webm",
                contentType: "audio/webm",
            });
        }

        const res = await axios.post(INFERENCE_URL, form, {
            headers: form.getHeaders(),
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeout: 60000,
        });

        console.log("✅ ML service response:", res.data);
        
        // Expect { emotion: 'sad', confidence: 0.9 }
        return res.data;
    } catch (error) {
        console.error("❌ ML service call failed:", error);
        
        if (axios.isAxiosError(error)) {
            if (error.code === "ECONNREFUSED") {
                throw new Error(`ML service not running at ${INFERENCE_URL}`);
            }
            if (error.response) {
                throw new Error(`ML service error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            }
        }
        
        throw error;
    }
}