#!/usr/bin/env python3
"""
Check if all required modules can be imported.
Run this from D:/EB/EB directory (inner EB) to verify setup.

Your structure:
D:/EB/
├── EB/                    ← Run from here
│   ├── ml-inference/
│   ├── backend/
│   └── frontend/
└── EMOBUDDY/              ← Models are here
"""

import sys
from pathlib import Path

print("="*60)
print("🔍 Python Environment Check")
print("="*60)
print()

# Check working directory
cwd = Path.cwd()
print(f"📂 Current Directory: {cwd}")
print(f"   (Should be D:/EB/EB - inner EB folder)")
print()

# Check directory structure
ml_inference = cwd / "ml-inference"
backend = cwd / "backend"
frontend = cwd / "frontend"
parent = cwd.parent
emobuddy = parent / "EMOBUDDY"

print("📁 Directory Structure Check:")
if ml_inference.exists():
    print(f"   ✅ ml-inference/ found")
else:
    print(f"   ❌ ml-inference/ NOT found")

if backend.exists():
    print(f"   ✅ backend/ found")
else:
    print(f"   ❌ backend/ NOT found")

if frontend.exists():
    print(f"   ✅ frontend/ found")
else:
    print(f"   ❌ frontend/ NOT found")

print()
print(f"📂 Parent Directory: {parent}")
print(f"   (Should be D:/EB - outer folder)")
print()

if emobuddy.exists():
    print(f"   ✅ EMOBUDDY/ found at: {emobuddy}")
else:
    print(f"   ❌ EMOBUDDY/ NOT found at: {emobuddy}")
    print()
    print("⚠️  ERROR: Your directory structure doesn't match expected layout")
    print()
    print("Expected structure:")
    print("  D:/EB/")
    print("  ├── EB/              ← You should run this script from here")
    print("  │   ├── ml-inference/")
    print("  │   ├── backend/")
    print("  │   └── frontend/")
    print("  └── EMOBUDDY/        ← Models should be here")
    sys.exit(1)

# Check for model files
models_dir = emobuddy / "static" / "models"
print()
print(f"📦 Model Files Check:")
print(f"   Looking in: {models_dir}")
print()

model_files = [
    "face_autism_efficientnet.weights.h5",
    "autism_voice_best.weights.h5",
    "fusion_model_final.keras"
]

for model_file in model_files:
    model_path = models_dir / model_file
    if model_path.exists():
        size = model_path.stat().st_size / (1024*1024)  # MB
        print(f"   ✅ {model_file} ({size:.1f} MB)")
    else:
        print(f"   ❌ {model_file} NOT found")

print()
print("🐍 Python Path:")
for i, p in enumerate(sys.path):
    print(f"   {i+1}. {p}")

print()
print("="*60)
print("📦 Checking Required Packages")
print("="*60)
print()

packages = [
    "tensorflow",
    "numpy",
    "PIL",
    "librosa",
    "fastapi",
    "uvicorn"
]

all_ok = True
for pkg in packages:
    try:
        if pkg == "PIL":
            import PIL
            version = PIL.__version__
        else:
            mod = __import__(pkg)
            version = getattr(mod, '__version__', 'unknown')
        print(f"✅ {pkg:15s} {version}")
    except ImportError:
        print(f"❌ {pkg:15s} NOT INSTALLED")
        all_ok = False

print()

if not all_ok:
    print("⚠️  Missing packages detected!")
    print("   Install with: pip install tensorflow numpy pillow librosa fastapi uvicorn")
    print()

print("="*60)
print("📥 Checking EMOBUDDY Models Import")
print("="*60)
print()

# Add parent directory to path (where EMOBUDDY is)
sys.path.insert(0, str(parent))
print(f"✓ Added to Python path: {parent}")
print()

try:
    from EMOBUDDY.models.face_emotion_model import FaceAutismEfficientNet
    print("✅ FaceAutismEfficientNet imported successfully")
except Exception as e:
    print(f"❌ FaceAutismEfficientNet import failed: {e}")
    all_ok = False

try:
    from EMOBUDDY.models.voice_emotion_model import VoiceEmotionModel
    print("✅ VoiceEmotionModel imported successfully")
except Exception as e:
    print(f"❌ VoiceEmotionModel import failed: {e}")
    all_ok = False

try:
    from EMOBUDDY.models.emotion_fusion_enhanced import FusionModel
    print("✅ FusionModel imported successfully")
except Exception as e:
    print(f"❌ FusionModel import failed: {e}")
    all_ok = False

print()
print("="*60)
print("📊 Summary")
print("="*60)
print()

if all_ok:
    print("✅ All checks passed! Your environment is ready.")
    print()
    print("Next step: Start the ML service")
    print("  Windows: start_ml_service.bat")
    print("  Linux/Mac: ./start_ml_service.sh")
    print()
    print("From directory: D:/EB/EB")
else:
    print("❌ Some checks failed. Please fix the issues above.")
    print()
    print("Common fixes:")
    print("  1. Run from D:/EB/EB directory (inner EB folder)")
    print("  2. Install missing packages: pip install -r requirements.txt")
    print("  3. Verify EMOBUDDY is in D:/EB/EMOBUDDY")

print("="*60)