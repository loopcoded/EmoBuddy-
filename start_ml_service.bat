@echo off
REM Start ML Service for your structure:
REM D:/EB/EB (this folder - contains ml-inference, backend, frontend)
REM D:/EB/EMOBUDDY (sibling folder - contains models)
REM
REM Run this from D:\EB\EB directory

echo ====================================
echo Starting ML Inference Service
echo ====================================
echo.

REM Check if we're in the inner EB directory
if not exist "ml-inference" (
    echo ERROR: ml-inference directory not found
    echo Please run this script from D:\EB\EB directory
    echo Current directory: %CD%
    pause
    exit /b 1
)

REM Check if EMOBUDDY exists in parent directory
if not exist "..\EMOBUDDY" (
    echo ERROR: EMOBUDDY directory not found in parent folder
    echo Expected at: %CD%\..\EMOBUDDY
    echo.
    echo Your structure should be:
    echo   D:\EB\
    echo   ├── EB\              ^(you are here^)
    echo   │   ├── ml-inference\
    echo   │   ├── backend\
    echo   │   └── frontend\
    echo   └── EMOBUDDY\        ^(should exist here^)
    echo.
    pause
    exit /b 1
)

REM Get parent directory (D:\EB) and add to PYTHONPATH
cd ..
set PARENT_DIR=%CD%
cd EB
set PYTHONPATH=%PYTHONPATH%;%PARENT_DIR%

echo Working Directory: %CD%
echo Parent Directory: %PARENT_DIR%
echo Python Path: %PYTHONPATH%
echo.

REM Check if models exist
echo Checking for model files...
if exist "..\EMOBUDDY\static\models\face_autism_efficientnet.weights.h5" (
    echo   [OK] Face model weights found
) else (
    echo   [!]  Face model weights not found at ..\EMOBUDDY\static\models\
)

if exist "..\EMOBUDDY\static\models\autism_voice_best.weights.h5" (
    echo   [OK] Voice model weights found
) else (
    echo   [!]  Voice model weights not found
)

if exist "..\EMOBUDDY\static\models\fusion_model_final.keras" (
    echo   [OK] Fusion model weights found
) else (
    echo   [!]  Fusion model weights not found
)

echo.
echo Starting service on port 8005...
echo Press Ctrl+C to stop
echo.

cd ml-inference
python service.py

pause