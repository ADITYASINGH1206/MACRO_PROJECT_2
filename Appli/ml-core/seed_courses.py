"""
Seed Courses Script
===================
1. Adds new columns to the courses table: course_type, semester, branch, total_students, faculty_name
2. Inserts the 9 real university courses from the user's curriculum
"""

import psycopg2
import os
import sys
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
load_dotenv()

DB_HOST = os.getenv("DB_HOST", "db.bfhcrnjlcaijrenkfyqb.supabase.co")
DB_NAME = os.getenv("DB_NAME", "postgres")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_PORT = os.getenv("DB_PORT", "5432")

COURSES_DATA = [
    ("27242201", "Data Science", "THEORY", 4, "Artificial Intelligence and Data Science", 81, "Dr. Abhishek Bhatt"),
    ("27242202", "THEORY OF COMPUTATION", "THEORY", 4, "Artificial Intelligence and Data Science", 81, "Dr. Bhagat Singh Raghuwanshi"),
    ("27242203", "Software Engineering", "THEORY", 4, "Artificial Intelligence and Data Science", 81, "Dr. Neelam Sharma"),
    ("27242204", "Network and Web Security", "THEORY", 4, "Artificial Intelligence and Data Science", 82, "Ms. Archana Acharya"),
    ("27242205", "Calculus & Optimization Techniques", "THEORY", 4, "Artificial Intelligence and Data Science", 81, "Dilip Kumar Mishra"),
    ("27242206", "Data Science Lab", "LAB", 4, "Artificial Intelligence and Data Science", 81, "Dr. Abhishek Bhatt"),
    ("27242207", "Java Programming Lab", "LAB", 4, "Artificial Intelligence and Data Science", 80, "Dr. Sumit Dhariwal"),
    ("27242208", "Competitive Programming Lab AIDS", "LAB", 4, "Artificial Intelligence and Data Science", 81, "Pooja Tripathi"),
    ("27242209", "Semester Proficiency", "OTHER", 4, "Artificial Intelligence and Data Science", 80, "Dr. Sumit Dhariwal"),
]

def main():
    print("==================================================")
    print("  Seed Courses - University Curriculum")
    print("==================================================")
    
    try:
        conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASSWORD, port=DB_PORT)
        cur = conn.cursor()
        print("[OK] Connected to database")
        
        # 1. Extend the schema safely
        print("\n[STEP 1] Extending courses table schema...")
        cur.execute("""
            ALTER TABLE public.courses 
            ADD COLUMN IF NOT EXISTS course_type TEXT DEFAULT 'THEORY',
            ADD COLUMN IF NOT EXISTS semester INTEGER DEFAULT 4,
            ADD COLUMN IF NOT EXISTS branch TEXT DEFAULT 'Artificial Intelligence and Data Science',
            ADD COLUMN IF NOT EXISTS total_students INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS faculty_name TEXT;
        """)
        conn.commit()
        print("[OK] Schema extended successfully")

        # 2. Delete the placeholder CS101 course if it exists
        cur.execute("DELETE FROM public.courses WHERE course_code = 'CS101'")
        conn.commit()
        
        # 3. Insert real courses
        print("\n[STEP 2] Seeding 9 real courses...")
        for code, name, ctype, sem, branch, students, faculty in COURSES_DATA:
            cur.execute("""
                INSERT INTO public.courses (course_code, course_name, course_type, semester, branch, total_students, faculty_name)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (course_code) 
                DO UPDATE SET 
                    course_name = EXCLUDED.course_name,
                    course_type = EXCLUDED.course_type,
                    semester = EXCLUDED.semester,
                    branch = EXCLUDED.branch,
                    total_students = EXCLUDED.total_students,
                    faculty_name = EXCLUDED.faculty_name;
            """, (code, name, ctype, sem, branch, students, faculty))
        
        conn.commit()
        print("[OK] Seeded 9 courses successfully!")
        
        # Verify
        cur.execute("SELECT COUNT(*) FROM public.courses")
        count = cur.fetchone()[0]
        print(f"\n[DONE] Total courses in database: {count}")
        
        conn.close()
        
    except Exception as e:
        print("[ERROR] %s" % str(e))
        sys.exit(1)

if __name__ == "__main__":
    main()
