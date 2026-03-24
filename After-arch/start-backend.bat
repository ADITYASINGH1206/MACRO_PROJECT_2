@echo off
REM Start Backend Server for Windows

echo Starting Backend Server...
cd backend

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
)

REM Start the server
echo Backend running on http://localhost:5000
call npm run dev
