#!/bin/bash

# Start ML Service for your structure:
# D:/EB/EB (this folder - contains ml-inference, backend, frontend)
# D:/EB/EMOBUDDY (sibling folder - contains models)
#
# Run this from D:/EB/EB directory

echo "🚀 Starting ML Inference Service"
echo "================================"
echo ""

# Check if we're in the inner EB directory
if [ ! -d "ml-inference" ]; then
    echo "❌ Error: ml-inference directory not found"
    echo "   Please run this script from D:/EB/EB directory"
    echo "   Current directory: $(pwd)"
    exit 1
fi

# Check if EMOBUDDY exists in parent directory
if [ ! -d "../EMOBUDDY" ]; then
    echo "❌ Error: EMOBUDDY directory not found in parent folder"
    echo "   Expected at: $(pwd)/../EMOBUDDY"
    echo ""
    echo "Your structure should be:"
    echo "  D:/EB/"
    echo "  ├── EB/              (you are here)"
    echo "  │   ├── ml-inference/"
    echo "  │   ├── backend/"
    echo "  │   └── frontend/"
    echo "  └── EMOBUDDY/        (should exist here)"
    echo ""
    exit 1
fi

# Get parent directory (D:/EB) and add to PYTHONPATH
PARENT_DIR=$(cd .. && pwd)
export PYTHONPATH="${PYTHONPATH}:${PARENT_DIR}"

echo "📂 Working Directory: $(pwd)"
echo "📂 Parent Directory: $PARENT_DIR"
echo "🐍 Python Path: $PYTHONPATH"
echo ""

# Check if models exist
echo "📦 Checking for model files..."
if [ -f "../EMOBUDDY/static/models/face_autism_efficientnet.weights.h5" ]; then
    echo "  ✅ Face model weights found"
else
    echo "  ⚠️  Face model weights not found at ../EMOBUDDY/static/models/"
fi

if [ -f "../EMOBUDDY/static/models/autism_voice_best.weights.h5" ]; then
    echo "  ✅ Voice model weights found"
else
    echo "  ⚠️  Voice model weights not found"
fi

if [ -f "../EMOBUDDY/static/models/fusion_model_final.keras" ]; then
    echo "  ✅ Fusion model weights found"
else
    echo "  ⚠️  Fusion model weights not found"
fi

echo ""
echo "🔄 Starting service on port 8005..."
echo "   Press Ctrl+C to stop"
echo ""

cd ml-inference
python service.py