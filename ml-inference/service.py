from pathlib import Path
import sys
import os

# Path resolution
script_dir = Path(__file__).resolve().parent
inner_eb = script_dir.parent
outer_eb = inner_eb.parent

sys.path.insert(0, str(outer_eb))
print(f"📂 Script location: {script_dir}")
print(f"📂 Added to Python path: {outer_eb}")
print(f"📂 EMOBUDDY should be at: {outer_eb / 'EMOBUDDY'}")

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from PIL import Image
import io
import librosa
import random

app = FastAPI(title="Emotion Detection ML Service")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================================================================
# MODEL LOADING
# ================================================================
USE_MOCK = False
MODEL_STATUS = {}

face_model = None
voice_model = None
fusion_model = None

FACE_EMOTIONS = ["angry", "fear", "happy", "neutral", "sad", "surprise"]
VOICE_EMOTIONS = ["angry", "fear", "happy", "sad", "surprise"]
FUSION_EMOTIONS = ["angry", "fear", "happy", "sad", "surprise"]

try:
    print("📦 Loading EMOBUDDY models...")

    from EMOBUDDY.models.face_emotion_model import FaceAutismEfficientNet
    from EMOBUDDY.models.voice_emotion_model import VoiceEmotionModel
    import tensorflow as tf

    FACE_WEIGHTS = str(outer_eb / "EMOBUDDY/static/models/face_autism_efficientnet.weights.h5")
    VOICE_WEIGHTS = str(outer_eb / "EMOBUDDY/static/models/autism_voice_best.weights.h5")
    FUSION_MODEL = str(outer_eb / "EMOBUDDY/static/models/fusion_model_final.keras")

    face_exists = os.path.exists(FACE_WEIGHTS)
    voice_exists = os.path.exists(VOICE_WEIGHTS)
    fusion_exists = os.path.exists(FUSION_MODEL)

    MODEL_STATUS = {
        "face_exists": face_exists,
        "voice_exists": voice_exists,
        "fusion_exists": fusion_exists
    }

    # ---------------- FACE MODEL ----------------
    print("🧩 Building face model...")
    face_builder = FaceAutismEfficientNet(input_shape=(224, 224, 3), num_classes=6)
    face_model = face_builder.build(backbone_trainable=False)

    if face_exists:
        face_builder.load_weights(FACE_WEIGHTS)
        print("✅ Face model loaded")
    else:
        print("⚠️ Face weights missing — using untrained model")

    # ---------------- VOICE MODEL ----------------
    print("🔊 Building voice model...")
    voice_builder = VoiceEmotionModel(input_shape=(64, 64, 1))
    voice_model = voice_builder.build_model()

    if voice_exists:
        voice_builder.load_weights(VOICE_WEIGHTS)
        print("✅ Voice model loaded")
    else:
        print("⚠️ Voice weights missing — using untrained model")

    # ---------------- FUSION MODEL ----------------
    if fusion_exists:
        print("🔮 Loading fusion model...")
        fusion_model = tf.keras.models.load_model(FUSION_MODEL)
        print("✅ Fusion model loaded")
    else:
        print("⚠️ Fusion model missing")

    USE_MOCK = False

except Exception as e:
    import traceback
    print("❌ Failed to load models:", e)
    print(traceback.format_exc())
    USE_MOCK = True


# ================================================================
# HELPERS
# ================================================================
def normalize_label_name(name: str) -> str:
    mapping = {
        "anger": "angry",
        "joy": "happy",
        "natural": "neutral",
        "neutral": "neutral",
        "sadness": "sad",
        "sad": "sad",
        "fear": "fear",
        "surprise": "surprise",
        "happy": "happy",
        "angry": "angry"
    }
    return mapping.get(name.lower(), name.lower())


def preprocess_image(img_bytes):
    """Face preprocessing — DO NOT DIVIDE BY 255."""
    image_pil = Image.open(io.BytesIO(img_bytes))
    if image_pil.mode != "RGB":
        image_pil = image_pil.convert("RGB")

    image_pil = image_pil.resize((224, 224))
    arr = np.array(image_pil, dtype=np.float32)
    arr = np.expand_dims(arr, 0)
    return arr


def preprocess_audio(audio_bytes):
    """Convert audio to mel spectrogram for voice model."""
    import tempfile
    try:
        with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as tmp:
            tmp.write(audio_bytes)
            tmp_path = tmp.name

        y, sr = librosa.load(tmp_path, sr=22050, mono=True)
        os.unlink(tmp_path)

        if len(y) < 5000:
            y = np.pad(y, (0, 5000 - len(y)))

        mel = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=64)
        mel_db = librosa.power_to_db(mel, ref=np.max)
        mel_db = (mel_db - mel_db.min()) / (mel_db.max() - mel_db.min() + 1e-8)

        if mel_db.shape[1] < 64:
            mel_db = np.pad(mel_db, ((0, 0), (0, 64 - mel_db.shape[1])))
        else:
            mel_db = mel_db[:, :64]

        mel_db = mel_db[..., np.newaxis]
        mel_db = np.expand_dims(mel_db, 0)

        return mel_db

    except Exception as e:
        print("❌ Audio preprocess failed:", e)
        raise


# ================================================================
# PREDICTION FUNCTIONS
# ================================================================
def predict_face_emotion(img_bytes):
    arr = preprocess_image(img_bytes)
    preds = face_model.predict(arr, verbose=0)[0]

    idx = int(np.argmax(preds))
    emotion = normalize_label_name(FACE_EMOTIONS[idx])
    conf = float(preds[idx])

    print(f"😊 FACE: {emotion} ({conf:.3f})")
    return emotion, conf, preds


def predict_voice_emotion(audio_bytes):
    mel = preprocess_audio(audio_bytes)
    preds = voice_model.predict(mel, verbose=0)[0]

    idx = int(np.argmax(preds))
    emotion = normalize_label_name(VOICE_EMOTIONS[idx])
    conf = float(preds[idx])

    print(f"🎤 VOICE: {emotion} ({conf:.3f})")
    return emotion, conf, preds


def predict_fusion(img_bytes, audio_bytes):
    img = preprocess_image(img_bytes)
    mel = preprocess_audio(audio_bytes)

    preds = fusion_model.predict([img, mel], verbose=0)[0]

    idx = int(np.argmax(preds))
    emotion = normalize_label_name(FUSION_EMOTIONS[idx])
    conf = float(preds[idx])

    print(f"🔮 FUSION: {emotion} ({conf:.3f})")
    return emotion, conf, preds


# ================================================================
# API ENDPOINTS
# ================================================================
@app.get("/")
def root():
    return {"service": "ml-inference", "mock": USE_MOCK}


@app.post("/predict-emotion")
async def predict_emotion(image: UploadFile = File(...), audio: UploadFile = File(None)):
    if USE_MOCK:
        e = random.choice(["angry", "happy", "sad", "neutral"])
        c = random.uniform(0.5, 0.9)
        return {"emotion": e, "confidence": c, "method": "mock", "all_scores": {}}

    try:
        img_bytes = await image.read()
        audio_bytes = await audio.read() if audio else None

        print(f"📸 IMG: {len(img_bytes)} bytes")
        if audio_bytes:
            print(f"🎤 AUDIO: {len(audio_bytes)} bytes")

        # ---- CASE 1: Fusion ----
        if fusion_model is not None and audio_bytes and len(audio_bytes) > 500:
            emotion, conf, scores = predict_fusion(img_bytes, audio_bytes)
            return {
                "emotion": emotion,
                "confidence": conf,
                "method": "fusion",
                "all_scores": {FUSION_EMOTIONS[i]: float(scores[i]) for i in range(len(scores))}
            }

        # ---- CASE 2: Face + Voice hybrid ----
        if audio_bytes and len(audio_bytes) > 500:
            fe, fc, fs = predict_face_emotion(img_bytes)
            ve, vc, vs = predict_voice_emotion(audio_bytes)

            if fe == ve:
                final = fe
                conf = min(0.99, (fc + vc) / 2 * 1.15)
                method = "both_agree"
            else:
                if fc >= vc:
                    final, conf, method = fe, fc, "face_dominant"
                else:
                    final, conf, method = ve, vc, "voice_dominant"

            return {
                "emotion": final,
                "confidence": float(conf),
                "method": method,
                "details": {
                    "face": {"emotion": fe, "confidence": fc},
                    "voice": {"emotion": ve, "confidence": vc},
                }
            }

        # ---- CASE 3: Face only ----
        emotion, conf, scores = predict_face_emotion(img_bytes)
        return {
            "emotion": emotion,
            "confidence": conf,
            "method": "face_only",
            "all_scores": {FACE_EMOTIONS[i]: float(scores[i]) for i in range(len(scores))}
        }

    except Exception as e:
        import traceback
        print("❌ ERROR:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


# ================================================================
if __name__ == "__main__":
    print("🚀 Starting ML Inference Service...")
    uvicorn.run("service:app", host="0.0.0.0", port=8005, log_level="info")
