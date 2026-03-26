"""
Face Registration & Attendance Script
=====================================
1. Opens webcam and captures your face
2. Generates a 128-dim facial embedding using face_recognition
3. Creates user_profiles + student_profiles entries in Supabase
4. Stores the facial embedding in the pgvector column
5. Logs an attendance record
"""

import cv2
import face_recognition
import psycopg2
import numpy as np
import os
import sys
from dotenv import load_dotenv
from datetime import datetime

# Fix Windows terminal encoding
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

load_dotenv()

# --- Database Config ---
DB_HOST = os.getenv("DB_HOST", "db.bfhcrnjlcaijrenkfyqb.supabase.co")
DB_NAME = os.getenv("DB_NAME", "postgres")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_PORT = os.getenv("DB_PORT", "5432")

def get_db():
    return psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASSWORD, port=DB_PORT)

def find_auth_user(email):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id FROM auth.users WHERE email = %s", (email,))
    row = cur.fetchone()
    conn.close()
    return str(row[0]) if row else None

def ensure_user_profile(user_id, email, first_name, last_name, role='student'):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id FROM public.user_profiles WHERE id = %s", (user_id,))
    if not cur.fetchone():
        cur.execute(
            "INSERT INTO public.user_profiles (id, email, first_name, last_name, role) VALUES (%s, %s, %s, %s, %s)",
            (user_id, email, first_name, last_name, role)
        )
        conn.commit()
        print("[OK] Created user_profile for %s %s" % (first_name, last_name))
    else:
        print("[INFO] user_profile already exists for %s" % email)
    conn.close()

def ensure_student_profile(user_id, student_id_number):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id FROM public.student_profiles WHERE id = %s", (user_id,))
    if not cur.fetchone():
        cur.execute(
            "INSERT INTO public.student_profiles (id, student_id_number) VALUES (%s, %s)",
            (user_id, student_id_number)
        )
        conn.commit()
        print("[OK] Created student_profile with ID: %s" % student_id_number)
    else:
        print("[INFO] student_profile already exists")
    conn.close()

def save_embedding(user_id, embedding):
    vector_str = "[" + ",".join(map(str, embedding.tolist())) + "]"
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "UPDATE public.student_profiles SET facial_embedding = %s WHERE id = %s",
        (vector_str, user_id)
    )
    conn.commit()
    conn.close()
    print("[OK] Facial embedding saved (%d dimensions)" % len(embedding))

def ensure_course(faculty_id=None):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id FROM public.courses LIMIT 1")
    row = cur.fetchone()
    if row:
        course_id = str(row[0])
        print("[INFO] Using existing course: %s" % course_id)
    else:
        cur.execute(
            "INSERT INTO public.courses (course_code, course_name) VALUES (%s, %s) RETURNING id",
            ("CS101", "Introduction to Computer Science")
        )
        course_id = str(cur.fetchone()[0])
        conn.commit()
        print("[OK] Created default course CS101: %s" % course_id)
    conn.close()
    return course_id

def ensure_enrollment(student_id, course_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id FROM public.enrollments WHERE student_id = %s AND course_id = %s", (student_id, course_id))
    if not cur.fetchone():
        cur.execute(
            "INSERT INTO public.enrollments (student_id, course_id) VALUES (%s, %s)",
            (student_id, course_id)
        )
        conn.commit()
        print("[OK] Enrolled student in course")
    else:
        print("[INFO] Already enrolled")
    conn.close()

def log_attendance(student_id, course_id, status='present'):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO public.attendance_logs (student_id, course_id, status, timestamp) VALUES (%s, %s, %s, %s)",
        (student_id, course_id, status, datetime.utcnow().isoformat() + "Z")
    )
    conn.commit()
    conn.close()
    print("[OK] Attendance logged as '%s' at %s UTC" % (status, datetime.utcnow().strftime('%H:%M:%S')))

def capture_face():
    print("\n[CAMERA] Opening camera... Look at the camera and press SPACE to capture (or Q to quit)")
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("[ERROR] Cannot open camera!")
        return None

    embedding = None
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        cv2.putText(frame, "Press SPACE to capture, Q to quit", (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        cv2.imshow("Face Registration - Ethereal Sentinel", frame)
        key = cv2.waitKey(1) & 0xFF

        if key == ord(' '):
            print("[CAPTURE] Processing frame...")
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            locations = face_recognition.face_locations(rgb)
            
            if locations:
                encodings = face_recognition.face_encodings(rgb, locations)
                if encodings:
                    embedding = encodings[0]
                    for (top, right, bottom, left) in locations:
                        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 3)
                        cv2.putText(frame, "CAPTURED!", (left, top - 10),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
                    cv2.imshow("Face Registration - Ethereal Sentinel", frame)
                    cv2.waitKey(2000)
                    print("[OK] Face detected! Embedding shape: %s" % str(embedding.shape))
                    break
                else:
                    print("[WARN] Face found but couldn't extract features. Try again.")
            else:
                print("[WARN] No face detected! Make sure your face is visible and well-lit.")

        elif key == ord('q'):
            print("[CANCELLED] Cancelled by user")
            break

    cap.release()
    cv2.destroyAllWindows()
    return embedding


# =================== MAIN ===================
if __name__ == "__main__":
    EMAIL = "sharad2@gmail.com"
    FIRST_NAME = "Sharad"
    LAST_NAME = "Student"
    STUDENT_ID = "STU-SHARAD-001"

    print("=" * 50)
    print("  Ethereal Sentinel - Face Registration")
    print("=" * 50)

    # Step 1: Find auth user
    print("\n[STEP 1] Looking up %s in Supabase Auth..." % EMAIL)
    user_id = find_auth_user(EMAIL)
    if not user_id:
        print("[ERROR] %s not found in auth.users! Sign up on the frontend first." % EMAIL)
        sys.exit(1)
    print("[OK] Found user: %s" % user_id)

    # Step 2: Create profiles
    print("\n[STEP 2] Setting up database profiles...")
    ensure_user_profile(user_id, EMAIL, FIRST_NAME, LAST_NAME, 'student')
    ensure_student_profile(user_id, STUDENT_ID)

    # Step 3: Create course & enrollment
    print("\n[STEP 3] Setting up course & enrollment...")
    course_id = ensure_course()
    ensure_enrollment(user_id, course_id)

    # Step 4: Capture face
    embedding = capture_face()
    if embedding is None:
        print("[ERROR] No face captured. Exiting.")
        sys.exit(1)

    # Step 5: Save embedding
    print("\n[STEP 5] Saving facial embedding to database...")
    save_embedding(user_id, embedding)

    # Step 6: Log attendance
    print("\n[STEP 6] Logging attendance...")
    log_attendance(user_id, course_id, 'present')

    print("\n" + "=" * 50)
    print("  ALL DONE! Face registered + Attendance logged!")
    print("  Check the Faculty Dashboard 'Live Feed' tab")
    print("=" * 50)
