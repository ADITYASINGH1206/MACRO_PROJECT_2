# 🎓 Biometric Attendance System (High-Speed Neural Engine)

A high-performance classroom attendance system utilizing **YOLOv8** for person tracking and **Face_Recognition** for identification. This project integrates a React frontend, a Node.js backend gateway, and a FastAPI-based machine learning core.

## 🏗️ Architecture

- **`/frontend`**: React + Vite dashboard for Faculty and Students.
- **`/backend`**: Node.js + Express API gateway (Supabase integration).
- **`/ml-core`**: FastAPI + WebSockets vision server for real-time face identification.
- **`best.pt`**: Trained YOLOv8 model for facial region extraction.

---

## 🚀 Quick Start

### 1. Requirements
- Node.js (v18+)
- Python (3.8+)
- Supabase Account

### 2. Environment Setup
Copy the `.env.example` to the appropriate directories and fill in your Supabase credentials.
- `backend/.env`
- `ml-core/.env`

### 3. Installation

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

**ML Core:**
```bash
# Create a virtual environment in the project root
python -m venv .venv
source .venv/Scripts/activate # Windows: .venv\Scripts\activate
pip install -r ml-core/requirements.txt
```

### 4. Running the System

Start the components in separate terminals:

1. **Backend:** `cd backend && npm run dev`
2. **Frontend:** `cd frontend && npm run dev`
3. **ML Vision Server:** The backend will launch this automatically when tracking starts, or run manually: `cd ml-core && run_vision_server.bat`

---

## 🛠️ Management

- **Face Enrollment**: To add a new student, use the `Enroll Student` form on the Faculty Dashboard. This uploads a 128D embedding to the Supabase `face_data` table.
- **Attendance Logic**: Students not identified during a session are automatically marked **Absent** at the end of the day to ensure full record integrity.

---

## 📝 Notes
- Ensure your webcam is accessible.
- The system defaults to high-precision matching (Tolerance: 0.6).
- All timestamps are handled in UTC for consistent multi-region synchronization.
