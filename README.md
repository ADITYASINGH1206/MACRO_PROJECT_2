# 🎓 Biometric Attendance System (High-Speed Neural Engine)

A high-performance classroom attendance system leveraging an edge-optimized edge-cloud architecture. It utilizes **YOLOv8 ByteTrack** for hyper-fast spatial person tracking and **Face_Recognition + Cosine Similarity** for resilient frame-buffered identification. 

This project integrates a React frontend, a Node.js backend gateway, and a highly-threaded FastAPI machine learning core for zero-lag surveillance edge cameras.

## 🏗️ Architecture

- **`/frontend`**: React + Vite dashboard for Faculty and Students.
- **`/backend`**: Node.js + Express API gateway handling Supabase integrations.
- **`/ml-core`**: FastAPI Neural Vision Server housing the `TrackedAttendancePipeline`.
  - **Zero-lag Threading**: Camera multi-threading dynamically drops old frames preventing buffer lock.
  - **ByteTrack State Engine**: Uses YOLO `persist=True` to carry rigid integer IDs across occlusions, preventing ID-switching.
  - **Frame Consensus**: Demands 3 concurrent Cosine Similarity face-hits (`> 0.45` threshold) before a tracked face is securely sent to the API.

---

## 🚀 Quick Start

### 1. Requirements
- Node.js (v18+)
- Python (3.8+)
- Supabase Account

### 2. Environment Setup
Copy `.env.example` to the subsequent directories and fill in your Supabase credentials:
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
cd ml-core
pip install -r requirements.txt
```

### 4. Running the System

Start the components in parallel:

1. **Backend:** `cd backend && npm run dev`
2. **Frontend:** `cd frontend && npm run dev`
3. **ML Vision Server:** Run directly to spool up the web-socket server: `cd ml-core && python vision_server.py`
*(Alternatively, you can test the raw tracker UI offline via `cd ml-core && python tracked_pipeline.py`)*

---

## 🛠️ Management

- **Face Enrollment**: To add a new student, use the `Enroll Student` form on the Faculty Dashboard. This commits a facial embedding to the Supabase pgvector infrastructure.
- **Performance Tuning**: You can adjust Tracker behaviour by modifying `ml-core/bytetrack.yaml` or adjust Thresholds inside `ml-core/tracked_pipeline.py`.
- **Absentee Logic**: Students not positively identified via 3-frame consensus during an active class period are automatically flipped back to **Absent** upon boundary resets.

---

## 📝 Notes
- Ensure your primary webcam is not locked by other applications (`CAMERA_ID=0`).
- The neural tracker relies heavily on `ultralytics>=8.4.41` to support latest `fuse_score` metric integrations.
- System metrics strictly enforce mathematical Cosine Similarity (`target_threshold=0.45`) rather than Euclidean distance formulas.
