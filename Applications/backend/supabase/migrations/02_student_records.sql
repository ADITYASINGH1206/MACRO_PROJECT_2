-- 1. Create Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  faculty_name TEXT,
  credits INTEGER DEFAULT 3
);

-- 2. Create Enrollments Table
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- 3. Create Academic Records Table
CREATE TABLE IF NOT EXISTS public.academic_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  gpa DECIMAL(3,2) DEFAULT 0.00,
  attendance_percentage INTEGER DEFAULT 0,
  credits_completed INTEGER DEFAULT 0,
  total_credits INTEGER DEFAULT 120,
  degree_progress INTEGER DEFAULT 0
);

-- 4. Seed Initial Data (Student: Julian Thorne)
-- Note: Replace UUIDs with actual values from your database if running manually
INSERT INTO public.courses (name, code, description, faculty_name, credits) VALUES
('Advanced Algorithms', 'CS401', 'Complex problem solving and algorithm analysis.', 'Dr. Alan Turing', 4),
('Human-Computer Interaction', 'CS302', 'Designing intuitive user interfaces.', 'Prof. Don Norman', 3),
('Machine Learning', 'CS405', 'Foundations of statistical learning.', 'Dr. Fei-Fei Li', 4),
('Software Engineering', 'CS301', 'Principles of software lifecycle.', 'Prof. Grace Hopper', 3)
ON CONFLICT (code) DO NOTHING;

-- To be executed after profile creation:
/*
INSERT INTO public.academic_records (student_id, gpa, attendance_percentage, credits_completed, total_credits, degree_progress)
VALUES ('<STUDENT_ID>', 3.92, 88, 82, 120, 68);

INSERT INTO public.enrollments (student_id, course_id)
SELECT '<STUDENT_ID>', id FROM public.courses;
*/
