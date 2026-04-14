@echo off
echo [*] Initializing High-Speed Neural Vision Server...
echo [*] Environment: Architecture B (FastAPI + WebSockets)
cd /d "%~dp0"
..\.venv\Scripts\python.exe vision_server.py
