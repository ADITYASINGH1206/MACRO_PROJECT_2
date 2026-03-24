# Quick Start Guide - 30 Minute Setup

Get the entire system running on your local machine in **30 minutes**.

## Prerequisites (5 minutes)

✅ **Verify you have:**
- Node.js 18+ (`node -v`)
- Python 3.11+ (`python --version`)
- Git (`git --version`)
- Text editor (VS Code recommended)

✅ **Get Supabase Credentials:**
1. Go to https://supabase.com
2. Create free account
3. Create new project
4. Copy Project URL and API Key from Settings

## Setup (25 minutes)

### Step 1: Create Environment Files (2 min)

#### Backend `.env` - `backend/.env`
```env
NODE_ENV=development
PORT=5000
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_KEY=YOUR_API_KEY_HERE
JWT_SECRET=your-secret-key-must-be-32-characters-minimum-here!!!
ML_SERVICE_URL=http://localhost:5001
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=info
```

#### Frontend `.env` - `frontend/.env`
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

#### ML Service `.env` - `ml-service/.env`
```env
FLASK_ENV=development
PORT=5001
DEBUG=True
```

### Step 2: Setup Database (5 min)
 
1. Open Supabase dashboard
2. Go to SQL Editor
3. Run this SQL FIRST:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

4. Copy all SQL from [03-DATABASE.md](./03-DATABASE.md)
5. Paste and execute in Supabase SQL Editor
6. Verify all 5 tables created:
   - users
   - students
   - courses
   - course_enrollments
   - attendance

### Step 3: Start Backend (3 min)

**Windows:**
```bash
start-backend.bat
```

**macOS/Linux:**
```bash
cd backend
npm install
npm run dev
```

✅ Should see: "Server running on port 5000"

### Step 4: Start Frontend (3 min)

**Windows (new terminal):**
```bash
start-frontend.bat
```

**macOS/Linux (new terminal):**
```bash
cd frontend
npm install
npm start
```

✅ Should see: Browser opens to http://localhost:3000

### Step 5: Start ML Service (3 min)

**Windows (new terminal):**
```bash
start-ml-service.bat
```

**macOS/Linux (new terminal):**
```bash
cd ml-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

✅ Should see: "Running on http://127.0.0.1:5001"

## Verify Setup (5 minutes)

### Check All Services Running

1. **Backend Health:**
   ```bash
   curl http://localhost:5000/health
   ```
   Should return: `{"status":"ok"}`

2. **ML Service Health:**
   ```bash
   curl http://localhost:5001/health
   ```
   Should return: `{"status":"ok"}`

3. **Frontend:** Open http://localhost:3000
   - Should see login page
   - No console errors
   - Responsive design works

### Test Features

1. **Register:**
   - Click "Register"
   - Enter email and password
   - Click register
   - Should succeed

2. **Login:**
   - Use registered credentials
   - Should see dashboard
   - No error messages

3. **Attendance:**
   - Go to Attendance tab
   - Try uploading an image
   - Should detect faces or show error gracefully

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### npm install fails
```bash
npm cache clean --force
npm install
```

### Python dependencies error
```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### "Cannot connect to Supabase"
- Verify SUPABASE_URL format: `https://xxx.supabase.co`
- Check SUPABASE_KEY is correct
- Verify internet connection
- Check Supabase project is active

### Frontend blank page
- Check browser console (F12) for errors
- Verify REACT_APP_API_URL is set correctly
- Restart frontend: `npm start`

### ML Service won't start
- Verify Python 3.11+ installed
- Check requirements.txt installed: `pip list | grep torch`
- Verify models exist: `ml-service/models/best.pt`

### Can't login
- Verify backend is running: `curl http://localhost:5000/health`
- Check .env credentials are correct
- Check browser console for API errors
- Verify Supabase database created

## Next Steps

✅ **Done with setup!**

- **Understand system:** See [04-ARCHITECTURE.md](./04-ARCHITECTURE.md)
- **API reference:** See [02-API.md](./02-API.md)
- **Database help:** See [03-DATABASE.md](./03-DATABASE.md)
- **Deploy to production:** See [05-DEPLOYMENT.md](./05-DEPLOYMENT.md)
- **Full reference:** See [06-README.md](./06-README.md)

## Common Commands

```bash
# Restart a service
Ctrl + C  (in terminal)
Then run the start command again

# See backend logs
(same terminal where it's running)

# See frontend logs
(same terminal where it's running)

# See ML logs
(same terminal where it's running)

# Test API endpoint
curl http://localhost:5000/students  (should require auth)
```

## Checklist

- [ ] All 3 services running
- [ ] No error messages
- [ ] Frontend loads
- [ ] Can register user
- [ ] Can login
- [ ] Dashboard visible
- [ ] No console errors

When all checked, you're ready to develop! 🚀

---

**Setup Time:** 30 minutes
**Status:** ✅ Complete
**Next:** Explore [02-API.md](./02-API.md) for available endpoints
