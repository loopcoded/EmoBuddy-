#!/bin/bash

# Emotion Detection Route Diagnostic Script
# Run this to identify routing issues

echo "🔍 Emotion Detection Diagnostic"
echo "================================"
echo ""

# Detect backend port
BACKEND_URL="http://localhost:8080"

echo "1️⃣ Testing Backend Health..."
HEALTH=$(curl -s $BACKEND_URL/health)
if [ $? -eq 0 ]; then
    echo "✅ Backend is running on port 8080"
    echo "   Response: $HEALTH"
else
    echo "❌ Backend not responding on port 8080"
    echo "   Make sure backend is running: npm run dev"
    exit 1
fi
echo ""

echo "2️⃣ Testing Emotion Route (expect 400, not 404)..."
EMOTION_TEST=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST $BACKEND_URL/api/emotion/detect)
HTTP_CODE=$(echo "$EMOTION_TEST" | grep HTTP_CODE | cut -d: -f2)
RESPONSE=$(echo "$EMOTION_TEST" | grep -v HTTP_CODE)

echo "   HTTP Status: $HTTP_CODE"
echo "   Response: $RESPONSE"

if [ "$HTTP_CODE" == "404" ]; then
    echo "❌ PROBLEM: Route not found (404)"
    echo "   This means the route isn't registered correctly"
    echo ""
    echo "🔧 Troubleshooting steps:"
    echo "   1. Check backend console for 'Registered Routes' output"
    echo "   2. Verify emotion.routes.ts exports default router"
    echo "   3. Verify app.ts imports and uses emotionRoutes"
    echo "   4. Restart backend server after changes"
elif [ "$HTTP_CODE" == "400" ]; then
    echo "✅ Route exists! (400 = Bad Request, expected without image)"
elif [ "$HTTP_CODE" == "500" ]; then
    echo "⚠️  Route exists but server error (500)"
    echo "   Response: $RESPONSE"
else
    echo "⚠️  Unexpected status: $HTTP_CODE"
fi
echo ""

echo "3️⃣ Testing ML Inference Service..."
ML_URL="http://localhost:8005"
ML_TEST=$(curl -s -w "\nHTTP_CODE:%{http_code}" $ML_URL/docs 2>&1)
ML_CODE=$(echo "$ML_TEST" | grep HTTP_CODE | cut -d: -f2)

if [ "$ML_CODE" == "200" ]; then
    echo "✅ ML service is running on port 8005"
elif [ "$ML_CODE" == "000" ] || [ -z "$ML_CODE" ]; then
    echo "❌ ML service not running on port 8005"
    echo "   Start it with: python ml-inference/service.py"
else
    echo "⚠️  ML service returned: $ML_CODE"
fi
echo ""

echo "4️⃣ Testing with Sample Image..."
# Create a tiny test image (1x1 PNG)
TEST_IMG="test_image.png"
echo -e '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82' > $TEST_IMG

FULL_TEST=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST $BACKEND_URL/api/emotion/detect \
    -F "image=@$TEST_IMG" 2>&1)
FULL_CODE=$(echo "$FULL_TEST" | grep HTTP_CODE | cut -d: -f2)
FULL_RESPONSE=$(echo "$FULL_TEST" | grep -v HTTP_CODE)

echo "   HTTP Status: $FULL_CODE"
echo "   Response: $FULL_RESPONSE"

if [ "$FULL_CODE" == "200" ]; then
    echo "✅ Full pipeline working!"
elif [ "$FULL_CODE" == "500" ]; then
    echo "⚠️  Backend processing error"
    echo "   Check backend logs for ML service connection issues"
elif [ "$FULL_CODE" == "404" ]; then
    echo "❌ Still getting 404 with image upload"
else
    echo "⚠️  Unexpected result"
fi

# Cleanup
rm -f $TEST_IMG
echo ""
echo "================================"
echo "Diagnostic Complete!"