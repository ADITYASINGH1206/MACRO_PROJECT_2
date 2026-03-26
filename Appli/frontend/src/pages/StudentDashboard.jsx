import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield, LogOut, CalendarCheck, BookOpen, User,
  Clock, TrendingUp, CheckCircle, XCircle, Loader2,
  BarChart3
} from 'lucide-react';
import { supabase } from '../lib/supabase.js';

const TABS = [
  { id: 'attendance', label: 'My Attendance', icon: CalendarCheck },
  { id: 'courses', label: 'My Courses', icon: BookOpen },
  { id: 'profile', label: 'Profile', icon: User },
];

/* ──────────────────────────── MY ATTENDANCE TAB ──────────────────────────── */
function MyAttendance({ userId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('attendance_logs')
        .select('*, courses(course_name, course_code)')
        .eq('student_id', userId)
        .order('timestamp', { ascending: false });
      setLogs(data || []);
      setLoading(false);
    })();
  }, [userId]);

  const presentCount = logs.filter(l => l.status === 'present' || l.status === 'override').length;
  const totalCount = logs.length;
  const percentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  return (
    <div>
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#0b1326] rounded-xl p-4 border border-[#2d3449]/50 text-center">
          <BarChart3 className="w-6 h-6 mx-auto mb-2 text-[#4cd7f6]" />
          <p className="text-2xl font-bold text-white">{totalCount}</p>
          <p className="text-xs text-[#918fa1]">Total Sessions</p>
        </div>
        <div className="bg-[#0b1326] rounded-xl p-4 border border-[#2d3449]/50 text-center">
          <CheckCircle className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
          <p className="text-2xl font-bold text-emerald-300">{presentCount}</p>
          <p className="text-xs text-[#918fa1]">Present</p>
        </div>
        <div className="bg-[#0b1326] rounded-xl p-4 border border-[#2d3449]/50 text-center">
          <TrendingUp className="w-6 h-6 mx-auto mb-2 text-[#ddb8ff]" />
          <p className="text-2xl font-bold" style={{ color: percentage >= 75 ? '#86efac' : percentage >= 50 ? '#fbbf24' : '#f87171' }}>{percentage}%</p>
          <p className="text-xs text-[#918fa1]">Attendance Rate</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-[#918fa1] mb-2">
          <span>Overall Attendance</span>
          <span>{percentage}%</span>
        </div>
        <div className="h-3 bg-[#0b1326] rounded-full overflow-hidden border border-[#2d3449]/50">
          <div className="h-full rounded-full bg-gradient-to-r from-[#4f46e5] to-[#4cd7f6] transition-all duration-700"
            style={{ width: `${percentage}%` }} />
        </div>
      </div>

      {/* Log List */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#4cd7f6]" /></div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 text-[#918fa1]">
          <CalendarCheck className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No attendance records found.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-2">
          {logs.map((log, i) => (
            <div key={log.id || i} className="flex items-center justify-between bg-[#0b1326] rounded-xl p-4 border border-[#2d3449]/50">
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${log.status === 'present' || log.status === 'override' ? 'bg-emerald-900/50' : 'bg-red-900/50'}`}>
                  {log.status === 'present' || log.status === 'override'
                    ? <CheckCircle className="w-4 h-4 text-emerald-300" />
                    : <XCircle className="w-4 h-4 text-red-300" />}
                </div>
                <div>
                  <p className="font-medium text-white">{log.courses?.course_name || 'Unknown Course'}</p>
                  <p className="text-xs text-[#918fa1]">{log.courses?.course_code || '—'}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded-full ${log.status === 'present' ? 'bg-emerald-900/50 text-emerald-300' : log.status === 'override' ? 'bg-amber-900/50 text-amber-300' : 'bg-red-900/50 text-red-300'}`}>
                  {log.status}
                </span>
                <p className="text-xs text-[#918fa1] mt-1 flex items-center justify-end gap-1">
                  <Clock className="w-3 h-3" /> {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────── MY COURSES TAB ──────────────────────────── */
function MyCourses({ userId }) {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('enrollments')
        .select('*, courses(course_name, course_code, user_profiles(first_name, last_name))')
        .eq('student_id', userId);
      setEnrollments(data || []);
      setLoading(false);
    })();
  }, [userId]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-6">Enrolled Courses</h3>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#4cd7f6]" /></div>
      ) : enrollments.length === 0 ? (
        <div className="text-center py-12 text-[#918fa1]">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>You are not enrolled in any courses yet.</p>
          <p className="text-xs mt-1">Ask your faculty to add you to a course.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {enrollments.map(en => (
            <div key={en.id} className="bg-[#0b1326] rounded-xl p-5 border border-[#2d3449]/50 hover:border-[#4cd7f6]/30 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-white text-lg">{en.courses?.course_name}</h4>
                  <p className="text-sm text-[#918fa1] mt-1">{en.courses?.course_code}</p>
                </div>
                <div className="px-3 py-1 bg-[#4f46e5]/20 text-[#c3c0ff] text-xs rounded-full">
                  Active
                </div>
              </div>
              {en.courses?.user_profiles && (
                <p className="text-xs text-[#918fa1] mt-3">
                  Faculty: {en.courses.user_profiles.first_name} {en.courses.user_profiles.last_name}
                </p>
              )}
              <p className="text-xs text-[#918fa1] mt-1">
                Enrolled: {new Date(en.enrolled_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────── PROFILE TAB ──────────────────────────── */
function ProfileTab({ session, userId }) {
  const [profile, setProfile] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: up } = await supabase.from('user_profiles').select('*').eq('id', userId).single();
      setProfile(up);
      const { data: sp } = await supabase.from('student_profiles').select('student_id_number, facial_embedding').eq('id', userId).single();
      setStudentProfile(sp);
      setLoading(false);
    })();
  }, [userId]);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#4cd7f6]" /></div>;

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#4cd7f6] to-[#4f46e5] flex items-center justify-center text-2xl font-bold text-white mb-4">
          {profile?.first_name?.[0] || session.user.email[0].toUpperCase()}
        </div>
        <h3 className="text-xl font-bold text-white">{profile ? `${profile.first_name} ${profile.last_name}` : session.user.email}</h3>
        <p className="text-sm text-[#918fa1]">Student</p>
      </div>

      <div className="space-y-4">
        <div className="bg-[#0b1326] rounded-xl p-4 border border-[#2d3449]/50">
          <p className="text-xs text-[#918fa1] uppercase tracking-wider mb-1">Email</p>
          <p className="text-white">{session.user.email}</p>
        </div>

        <div className="bg-[#0b1326] rounded-xl p-4 border border-[#2d3449]/50">
          <p className="text-xs text-[#918fa1] uppercase tracking-wider mb-1">Student ID</p>
          <p className="text-white">{studentProfile?.student_id_number || 'Not assigned — ask faculty'}</p>
        </div>

        <div className="bg-[#0b1326] rounded-xl p-4 border border-[#2d3449]/50">
          <p className="text-xs text-[#918fa1] uppercase tracking-wider mb-1">Face Registration</p>
          <div className="flex items-center gap-2 mt-1">
            {studentProfile?.facial_embedding ? (
              <><CheckCircle className="w-5 h-5 text-emerald-400" /><span className="text-emerald-300 font-medium">Enrolled</span></>
            ) : (
              <><XCircle className="w-5 h-5 text-amber-400" /><span className="text-amber-300 font-medium">Not enrolled — contact faculty</span></>
            )}
          </div>
        </div>

        <div className="bg-[#0b1326] rounded-xl p-4 border border-[#2d3449]/50">
          <p className="text-xs text-[#918fa1] uppercase tracking-wider mb-1">Account Created</p>
          <p className="text-white">{new Date(session.user.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────── MAIN STUDENT DASHBOARD ──────────────────────────── */
export default function StudentDashboard({ session, onLogout }) {
  const [activeTab, setActiveTab] = useState('attendance');
  const userId = session.user.id;

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-sans">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-[#0b1326]/80 backdrop-blur-xl border-b border-[#2d3449]/50">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4cd7f6] to-[#4f46e5] flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>Student Portal</h1>
              <p className="text-xs text-[#918fa1]">{session.user.email}</p>
            </div>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-[#2d3449] hover:bg-[#3a4260] rounded-xl text-sm transition">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <div className="flex gap-2 p-1.5 bg-[#131b2e] rounded-2xl border border-[#2d3449]/50">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${activeTab === tab.id ? 'bg-gradient-to-r from-[#4cd7f6] to-[#4f46e5] text-white shadow-lg' : 'text-[#918fa1] hover:text-white hover:bg-[#2d3449]/50'}`}>
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-[#131b2e] rounded-2xl p-6 border border-[#2d3449]/50 shadow-xl min-h-[500px]">
          {activeTab === 'attendance' && <MyAttendance userId={userId} />}
          {activeTab === 'courses' && <MyCourses userId={userId} />}
          {activeTab === 'profile' && <ProfileTab session={session} userId={userId} />}
        </div>
      </div>
    </div>
  );
}
