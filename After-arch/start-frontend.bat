@echo off
REM Start Frontend for Windows

echo Starting Frontend...
cd frontend

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
)

REM Start the app
echo Frontend running on http://localhost:3000
call npm start
