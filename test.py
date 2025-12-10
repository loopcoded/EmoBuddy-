#!/usr/bin/env python3
"""
End-to-end test for emotion detection pipeline.
Tests both the ML service and backend API.
"""

import requests
import io
from PIL import Image
import numpy as np

# URLs
ML_SERVICE_URL = "http://localhost:8005"
BACKEND_URL = "http://localhost:8080/api"

def create_test_image():
    """Create a simple test image (red square)."""
    img = Image.new('RGB', (224, 224), color='red')
    buf = io.BytesIO()
    img.save(buf, format='JPEG')
    buf.seek(0)
    return buf

def test_ml_service():
    """Test ML inference service directly."""
    print("\n" + "="*50)
    print("1️⃣ Testing ML Service (port 8005)")
    print("="*50)
    
    try:
        # Test health endpoint
        res = requests.get(f"{ML_SERVICE_URL}/")
        print(f"✅ ML Service Status: {res.json()}")
        
        # Test prediction
        img_buffer = create_test_image()
        files = {"image": ("test.jpg", img_buffer, "image/jpeg")}
        
        res = requests.post(f"{ML_SERVICE_URL}/predict-emotion", files=files)
        
        if res.status_code == 200:
            data = res.json()
            if "error" in data:
                print(f"❌ ML Service Error: {data['error']}")
                return False
            else:
                print(f"✅ ML Prediction: {data['emotion']} (confidence: {data['confidence']:.2f})")
                return True
        else:
            print(f"❌ ML Service failed: {res.status_code}")
            print(f"   Response: {res.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ ML Service not running on port 8005")
        print("   Start it: python ml-inference/service.py")
        return False
    except Exception as e:
        print(f"❌ ML Service test failed: {e}")
        return False

def test_backend_api():
    """Test backend API."""
    print("\n" + "="*50)
    print("2️⃣ Testing Backend API (port 8080)")
    print("="*50)
    
    try:
        # Test health endpoint
        res = requests.get("http://localhost:8080/health")
        print(f"✅ Backend Health: {res.json()}")
        
        # Test emotion detection endpoint
        img_buffer = create_test_image()
        files = {"image": ("test.jpg", img_buffer, "image/jpeg")}
        
        res = requests.post(f"{BACKEND_URL}/emotion/detect", files=files)
        
        if res.status_code == 200:
            data = res.json()
            print(f"✅ Backend Response:")
            print(f"   Emotion: {data.get('emotion')}")
            print(f"   Confidence: {data.get('confidence', 0):.2f}")
            print(f"   Action: {data.get('action')}")
            return True
        else:
            print(f"❌ Backend failed: {res.status_code}")
            print(f"   Response: {res.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Backend not running on port 8080")
        print("   Start it: npm run dev in backend folder")
        return False
    except Exception as e:
        print(f"❌ Backend test failed: {e}")
        return False

def test_frontend_proxy():
    """Test Next.js API route proxy."""
    print("\n" + "="*50)
    print("3️⃣ Testing Frontend Proxy (port 3000)")
    print("="*50)
    
    try:
        img_buffer = create_test_image()
        files = {"image": ("test.jpg", img_buffer, "image/jpeg")}
        
        res = requests.post("http://localhost:3000/api/emotion/detect", files=files)
        
        if res.status_code == 200:
            data = res.json()
            print(f"✅ Frontend Proxy Working:")
            print(f"   Emotion: {data.get('emotion')}")
            print(f"   Confidence: {data.get('confidence', 0):.2f}")
            print(f"   Action: {data.get('action')}")
            return True
        else:
            print(f"⚠️  Frontend proxy issue: {res.status_code}")
            print(f"   Response: {res.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("⚠️  Frontend not running on port 3000")
        print("   This is optional - you can call backend directly")
        return None
    except Exception as e:
        print(f"⚠️  Frontend test failed: {e}")
        return None

def main():
    print("\n🧪 Emotion Detection Pipeline Test")
    print("="*50)
    
    results = {}
    
    # Test each component
    results['ml_service'] = test_ml_service()
    results['backend'] = test_backend_api()
    results['frontend'] = test_frontend_proxy()
    
    # Summary
    print("\n" + "="*50)
    print("📊 Test Summary")
    print("="*50)
    
    for component, result in results.items():
        if result is True:
            status = "✅ PASS"
        elif result is False:
            status = "❌ FAIL"
        else:
            status = "⚠️  SKIP"
        print(f"{component:15s} {status}")
    
    # Overall status
    critical_pass = results['ml_service'] and results['backend']
    
    if critical_pass:
        print("\n✅ Core pipeline is working!")
        print("You can now test in the browser.")
    else:
        print("\n❌ Core pipeline has issues - check errors above")
    
    print("="*50)

if __name__ == "__main__":
    main()