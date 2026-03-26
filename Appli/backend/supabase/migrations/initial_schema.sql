-- Enable the vector extension for storing facial embeddings using pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Create ENUMs for roles and attendance status
CREATE TYPE user_role AS ENUM ('faculty', 'student');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'override');

-- 1. User Profiles Table
-- This table links to Supabase's built-in auth.users table.
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Student Profiles Table
-- Dedicated table for students to store their custom IDs and facial embeddings.
-- Standard 'face_recognition' library outputs a 128-dimensional embedding vector.
CREATE TABLE public.student_profiles (
    id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE PRIMARY KEY,
    student_id_number TEXT UNIQUE NOT NULL,
    facial_embedding vector(128)
);

-- 3. Courses Table
CREATE TABLE public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_code TEXT UNIQUE NOT NULL,
    course_name TEXT NOT NULL,
    faculty_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enrollments Table
-- Maps students to their enrolled courses
CREATE TABLE public.enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id, course_id)
);

-- 5. Attendance Logs Table
CREATE TABLE public.attendance_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status attendance_status NOT NULL DEFAULT 'present',
    logged_by UUID REFERENCES public.user_profiles(id) -- Used to track if Faculty manually overrode attendance
);

-- Enable basic Row Level Security (Policies to be defined later)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;
