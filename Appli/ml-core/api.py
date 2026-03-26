from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import face_recognition
import numpy as np
import base64
import psycopg2
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow all domains for local dev

DB_HOST = os.getenv("DB_HOST", "db.bfhcrnjlcaijrenkfyqb.supabase.co")
DB_NAME = os.getenv("DB_NAME", "postgres")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_PORT = os.getenv("DB_PORT", "5432")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_db():
    return psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASSWORD, port=DB_PORT)

def decode_base64_image(base64_string):
    if ',' in base64_string:
        base64_string = base64_string.split(',')[1]
    img_data = base64_string.encode()
    nparr = np.frombuffer(base64.b64decode(img_data), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img

@app.route('/api/students/register', methods=['POST'])
def register_student():
    data = request.json
    email = data.get('email')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    student_id_number = data.get('student_id_number')
    course_id = data.get('course_id')
    image_b64 = data.get('image')

    if not all([email, first_name, last_name, student_id_number, course_id, image_b64]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        # 1. Process image and get embedding
        img = decode_base64_image(image_b64)
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        locations = face_recognition.face_locations(rgb)
        if not locations:
            return jsonify({"error": "No face detected in image"}), 400
        
        encodings = face_recognition.face_encodings(rgb, locations)
        if not encodings:
            return jsonify({"error": "Could not extract facial features"}), 400
            
        embedding = encodings[0]
        vector_str = "[" + ",".join(map(str, embedding.tolist())) + "]"

        # 2. Get or Create Auth User
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT id FROM auth.users WHERE email = %s", (email,))
        row = cur.fetchone()
        
        if row:
            user_id = str(row[0])
        else:
            # Create user via standard Sign Up since Service Role key is unavailable
            auth_res = supabase.auth.sign_up({
                "email": email,
                "password": "password123", # default password
                "options": {
                    "data": {"role": "student"}
                }
            })
            user_id = auth_res.user.id

        # 3. Ensure user_profile exists
        cur.execute("SELECT id FROM public.user_profiles WHERE id = %s", (user_id,))
        if not cur.fetchone():
            cur.execute(
                "INSERT INTO public.user_profiles (id, email, first_name, last_name, role) VALUES (%s, %s, %s, %s, %s)",
                (user_id, email, first_name, last_name, 'student')
            )

        # 4. Ensure student_profile + setup embedding
        cur.execute("SELECT id FROM public.student_profiles WHERE id = %s", (user_id,))
        if not cur.fetchone():
            cur.execute(
                "INSERT INTO public.student_profiles (id, student_id_number, facial_embedding) VALUES (%s, %s, %s)",
                (user_id, student_id_number, vector_str)
            )
        else:
            cur.execute(
                "UPDATE public.student_profiles SET facial_embedding = %s WHERE id = %s",
                (vector_str, user_id)
            )

        # 5. Enroll in course
        cur.execute("SELECT id FROM public.enrollments WHERE student_id = %s AND course_id = %s", (user_id, course_id))
        if not cur.fetchone():
            cur.execute(
                "INSERT INTO public.enrollments (student_id, course_id) VALUES (%s, %s)",
                (user_id, course_id)
            )

        conn.commit()
        conn.close()

        return jsonify({"message": f"Successfully registered {first_name} {last_name}!", "user_id": user_id}), 200

    except Exception as e:
        print(f"Error in register_student: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/attendance/recognize', methods=['POST'])
def recognize_attendance():
    """
    Receives a frame from the faculty camera, matches multiple faces,
    and returns the recognized student IDs and names.
    Does NOT log attendance to DB yet (Faculty clicks "Save All" on frontend).
    """
    data = request.json
    image_b64 = data.get('image')

    if not image_b64:
        return jsonify({"error": "Missing image"}), 400

    try:
        img = decode_base64_image(image_b64)
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        locations = face_recognition.face_locations(rgb)
        
        if not locations:
            return jsonify({"recognized": []}), 200
            
        encodings = face_recognition.face_encodings(rgb, locations)
        
        conn = get_db()
        cur = conn.cursor()
        
        recognized_students = []
        MATCH_THRESHOLD = 0.55 # Slightly stricter threshold to prevent false positives
        
        for encoding in encodings:
            vector_str = "[" + ",".join(map(str, encoding.tolist())) + "]"
            
            # Query db for nearest match
            query = f"""
                SELECT sp.id, sp.student_id_number, up.first_name, up.last_name, sp.facial_embedding <=> '{vector_str}' AS distance
                FROM public.student_profiles sp
                JOIN public.user_profiles up ON sp.id = up.id
                WHERE sp.facial_embedding IS NOT NULL
                ORDER BY distance ASC
                LIMIT 1;
            """
            cur.execute(query)
            result = cur.fetchone()
            
            if result:
                student_id = result[0]
                student_id_number = result[1]
                first_name = result[2]
                last_name = result[3]
                distance = result[4]
                
                if distance < MATCH_THRESHOLD:
                    recognized_students.append({
                        "id": student_id,
                        "student_id_number": student_id_number,
                        "name": f"{first_name} {last_name}",
                        "distance": distance
                    })

        conn.close()
        
        # Filter duplicates (incase of multiple hits on same person)
        unique_students = {s['id']: s for s in recognized_students}.values()

        return jsonify({"recognized": list(unique_students)}), 200

    except Exception as e:
        print(f"Error in recognize_attendance: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    print("Starting ML-Core API on port 5001...")
    # Use threaded=True, threaded execution is default in Flask 1.0+
    app.run(host='0.0.0.0', port=5001, debug=True)
