# Quick Start - Local Development (No Docker)

Run all 3 services in separate terminal windows/tabs for local development.

## Prerequisites

- Node.js 18+ installed ([Download](https://nodejs.org/))
- Python 3.11+ installed ([Download](https://www.python.org/))
- Git installed ([Download](https://git-scm.com/))

## Setup Environment Variables

### 1. Backend (.env)

Create `backend/.env`:
```env
NODE_ENV=development
PORT=5000
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=your-key-here
JWT_SECRET=your-secret-key-32-chars-minimum
ML_SERVICE_URL=http://localhost:5001
FRONTEND_URL=http://localhost:3000
```

### 2. Frontend (.env)

Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

### 3. ML Service (.env)

Create `ml-service/.env`:
```env
FLASK_ENV=development
PORT=5001
DEBUG=True
```

---

## Start Services (Windows)

Open **3 separate Command Prompt/PowerShell windows** in the `After-arch` directory:

### Terminal 1 - Backend (Port 5000)
```bash
start-backend.bat
```
Or manually:
```bash
cd backend
npm install
npm run dev
```

### Terminal 2 - Frontend (Port 3000)
```bash
start-frontend.bat
```
Or manually:
```bash
cd frontend
npm install
npm start
```

### Terminal 3 - ML Service (Port 5001)
```bash
start-ml-service.bat
```
Or manually:
```bash
cd ml-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

---

## Start Services (macOS/Linux)

Open **3 separate terminal tabs** and run:

### Terminal 1 - Backend
```bash
chmod +x start-backend.sh
./start-backend.sh
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm start
```

### Terminal 3 - ML Service
```bash
cd ml-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

---

## Access the Application

Once all 3 services are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **ML Service**: http://localhost:5001

---

## Verification Checklist

- [ ] Backend starts without errors on port 5000
- [ ] Frontend opens in browser on port 3000
- [ ] ML Service starts without errors on port 5001
- [ ] Can see login page in browser
- [ ] No console errors in any terminal

---

## Troubleshooting

### Port Already in Use
```bash
# Windows - Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux - Find and kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

### npm install fails
```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install
```

### Python Dependencies Error
```bash
# Upgrade pip first
python -m pip install --upgrade pip

# Then install requirements
pip install -r requirements.txt
```

### Supabase Connection Error
- Verify SUPABASE_URL and SUPABASE_KEY in `backend/.env`
- Check internet connection
- Verify Supabase project is active

### ML Service Model Not Found
- Ensure `ml-service/models/best.pt` exists
- Check file size > 100MB
- Download model if missing

---

## Development Workflow

1. **Make changes** to any service
2. **Auto-reload happens**:
   - Backend: nodemon (auto-restart)
   - Frontend: React dev server (hot reload)
   - ML: Manually restart Python app (or install auto-reload)
3. **Check browser/console** for errors

---

## Next Steps

- Review API docs: `docs/02-API.md`
- Check database setup: `docs/03-DATABASE.md`
- See architecture: `docs/04-ARCHITECTURE.md`
- All documentation in: `docs/` folder

---

**Ready to develop!** 🚀
