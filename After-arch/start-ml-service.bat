@echo off
REM Start ML Service for Windows

echo Starting ML Service...
cd ml-service

REM Create virtual environment if it doesn't exist
if not exist "venv" (
  echo Creating virtual environment...
  python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install/upgrade pip
python -m pip install --upgrade pip

REM Install dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Start Flask app
echo ML Service running on http://localhost:5001
python app.py
