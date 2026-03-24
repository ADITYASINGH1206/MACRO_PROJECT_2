import sys
import os
import face_recognition
from supabase import create_client, Client
from dotenv import load_dotenv

# Load env robustly from the local directory
ML_CORE_DIR = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(ML_CORE_DIR, ".env")
load_dotenv(env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def enroll_student(user_id, image_path):
    if not os.path.exists(image_path):
        print(f"[ERROR] Image file not found: {image_path}")
        return

    print(f"[*] Processing image: {image_path}...")
    image = face_recognition.load_image_file(image_path)
    encodings = face_recognition.face_encodings(image)

    if not encodings:
        print("[ERROR] No face detected in the image.")
        return

    encoding = encodings[0].tolist() # Convert numpy array to list for JSON/Supabase
    
    print(f"[*] Connecting to Supabase...")
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Check if user exists in profiles
    profile = supabase.table('profiles').select('id').eq('id', user_id).execute()
    if not profile.data:
        print(f"[ERROR] User ID {user_id} not found in 'profiles' table. Create the profile first.")
        return

    data = {
        "user_id": user_id,
        "embedding": encoding
    }

    try:
        response = supabase.table('face_data').upsert(data).execute()
        print(f"[SUCCESS] Face enrolled for user {user_id}")
    except Exception as e:
        print(f"[ERROR] Failed to upload embedding: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python enroll_face.py <USER_ID> <IMAGE_PATH>")
        print("Example: python enroll_face.py f5dfc9a0-388e-49b9-87c1-ae21b228b3db student_photo.jpg")
    else:
        enroll_student(sys.argv[1], sys.argv[2])
