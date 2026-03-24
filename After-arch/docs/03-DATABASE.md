# Database Schema & Setup

Complete PostgreSQL database schema for the attendance system with Supabase.

## Prerequisites

**IMPORTANT:** Enable pgvector extension FIRST before creating tables.

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Then proceed with table creation below.

---

## Tables

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'student',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Students Table
```sql
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_number VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  department VARCHAR(100),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  face_embedding VECTOR(128),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Courses Table
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_code VARCHAR(50) UNIQUE NOT NULL,
  course_name VARCHAR(255) NOT NULL,
  instructor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  semester INT,
  academic_year VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Course Enrollments Table
```sql
CREATE TABLE course_enrollments (
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrollment_date TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (student_id, course_id)
);
```

### Attendance Table
```sql
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIMESTAMP NOT NULL,
  status VARCHAR(20),
  confidence FLOAT,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, course_id, date)
);
```

---

## Indexes (For Performance)

```sql
CREATE INDEX idx_students_roll_number ON students(roll_number);
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX idx_attendance_course_date ON attendance(course_id, date);
CREATE INDEX idx_course_enrollments_student ON course_enrollments(student_id);
CREATE INDEX idx_course_enrollments_course ON course_enrollments(course_id);
```

---

## Row Level Security (RLS)

Enable RLS on sensitive tables:

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
```

### RLS Policies

```sql
-- Users can see their own data
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text);

-- Students can see their own attendance
CREATE POLICY "Students see own attendance"
  ON attendance FOR SELECT
  USING (student_id = auth.uid()::text);

-- Instructors can see their course attendance
CREATE POLICY "Instructors view course attendance"
  ON attendance FOR SELECT
  USING (
    course_id IN (
      SELECT id FROM courses WHERE instructor_id = auth.uid()::text
    )
  );
```

---

## Setup Instructions

### Step 1: Create Extension
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Step 2: Create Tables
Execute all table creation SQL in order:
1. Users
2. Students
3. Courses
4. Course Enrollments
5. Attendance

### Step 3: Create Indexes
```sql
CREATE INDEX idx_students_roll_number ON students(roll_number);
-- ... (all indexes from above)
```

### Step 4: Enable RLS
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ... (all RLS policies from above)
```

---

## Data Relationships

```
users (1) ──→ (N) students
users (1) ──→ (N) courses (as instructor)
students (N) ──→ (M) courses (via course_enrollments)
students (1) ──→ (N) attendance
courses (1) ──→ (N) attendance
```

---

## Sample Data (For Testing)

```sql
-- Insert test user
INSERT INTO users (email, password, name, role) 
VALUES ('teacher@example.com', 'hashed_password', 'Dr. Smith', 'teacher');

-- Insert test students
INSERT INTO students (roll_number, name, email, phone, department, user_id)
VALUES 
  ('CS001', 'Alice Johnson', 'alice@example.com', '9876543210', 'CS', (SELECT id FROM users LIMIT 1)),
  ('CS002', 'Bob Smith', 'bob@example.com', '9876543211', 'CS', NULL);

-- Insert test course
INSERT INTO courses (course_code, course_name, instructor_id, semester, academic_year)
VALUES ('CS101', 'Data Structures', (SELECT id FROM users WHERE role='teacher' LIMIT 1), 3, '2024');

-- Enroll students
INSERT INTO course_enrollments (student_id, course_id)
SELECT s.id, c.id FROM students s, courses c LIMIT 2;
```

---

## Backup & Recovery

### Backup Database
```bash
# Via Supabase Dashboard
Settings → Backups → Download

# Via pg_dump
pg_dump "postgresql://user:password@db.supabase.co:5432/postgres" > backup.sql
```

### Restore Database
```bash
psql "postgresql://user:password@db.supabase.co:5432/postgres" < backup.sql
```

---

## Troubleshooting

### "type 'vector' does not exist"
→ Run `CREATE EXTENSION IF NOT EXISTS vector;` first

### "multiple primary keys" error
→ Remove the separate `id` column from junction tables

### "Foreign key constraint fails"
→ Ensure referenced record exists in parent table

### RLS Policy Not Working
→ Verify `auth.uid()` matches your user ID format

---

**Database Status:** ✅ Ready for Production
**Schema Version:** 1.0
**Last Updated:** 2024
