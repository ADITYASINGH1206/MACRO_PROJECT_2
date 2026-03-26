import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Shield, LogOut, Radio, Users, BookOpen, ClipboardEdit,
  RefreshCw, Plus, Trash2, Check, X, Search, Clock,
  TrendingUp, UserCheck, AlertCircle, Loader2, Camera
} from 'lucide-react';
import { supabase } from '../lib/supabase.js';

const TABS = [
  { id: 'live', label: 'Live Feed', icon: Radio },
  { id: 'roster', label: 'Student Roster', icon: Users },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'register', label: 'Register Student', icon: UserCheck },
  { id: 'attendance', label: 'Take Attendance', icon: Camera },
];

/* ──────────────────────────── LIVE FEED TAB ──────────────────────────── */
function LiveFeed() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecent = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('attendance_logs')
      .select('*, student_profiles(student_id_number, user_profiles(first_name, last_name)), courses(course_name, course_code)')
      .order('timestamp', { ascending: false })
      .limit(50);
    setLogs(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRecent();
    const channel = supabase
      .channel('realtime-attendance')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'attendance_logs' }, (payload) => {
        setLogs(prev => [payload.new, ...prev].slice(0, 50));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchRecent]);

  const timeAgo = (ts) => {
    const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
          <h3 className="text-lg font-semibold">Real-time Attendance Stream</h3>
        </div>
        <button onClick={fetchRecent} className="p-2 rounded-lg bg-[#2d3449] hover:bg-[#3a4260] transition">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#4cd7f6]" /></div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 text-[#918fa1]">
          <Radio className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No attendance logs yet. Waiting for camera feed…</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scroll">
          {logs.map((log, i) => (
            <div key={log.id || i} className="flex items-center justify-between bg-[#0b1326] rounded-xl p-4 border border-[#2d3449]/50 hover:border-[#4cd7f6]/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4f46e5] to-[#7c03d3] flex items-center justify-center text-sm font-bold">
                  {log.student_profiles?.user_profiles?.first_name?.[0] || '?'}
                </div>
                <div>
                  <p className="font-medium text-white">
                    {log.student_profiles?.user_profiles
                      ? `${log.student_profiles.user_profiles.first_name} ${log.student_profiles.user_profiles.last_name}`
                      : log.student_id?.substring(0, 8)}
                  </p>
                  <p className="text-xs text-[#918fa1]">
                    {log.courses?.course_code || 'Unknown Course'} · {log.student_profiles?.student_id_number || '—'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded-full ${log.status === 'present' ? 'bg-emerald-900/50 text-emerald-300' : log.status === 'override' ? 'bg-amber-900/50 text-amber-300' : 'bg-red-900/50 text-red-300'}`}>
                  {log.status}
                </span>
                <p className="text-xs text-[#918fa1] mt-1">{timeAgo(log.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────── STUDENT ROSTER TAB ──────────────────────────── */
function StudentRoster() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('student_profiles')
        .select('id, student_id_number, facial_embedding, user_profiles(first_name, last_name, email)');
      setStudents(data || []);
      setLoading(false);
    })();
  }, []);

  const filtered = students.filter(s => {
    const name = `${s.user_profiles?.first_name} ${s.user_profiles?.last_name} ${s.student_id_number}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#918fa1]" />
          <input
            type="text" placeholder="Search students…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#0b1326] text-white rounded-xl pl-10 pr-4 py-3 outline-none border border-[#2d3449] focus:border-[#4cd7f6] transition"
          />
        </div>
        <div className="text-sm text-[#918fa1] whitespace-nowrap">{filtered.length} students</div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#4cd7f6]" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-[#918fa1]">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No students registered yet.</p>
        </div>
      ) : (
        <div className="grid gap-3 max-h-[60vh] overflow-y-auto pr-2">
          {filtered.map(s => (
            <div key={s.id} className="flex items-center justify-between bg-[#0b1326] rounded-xl p-4 border border-[#2d3449]/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4cd7f6] to-[#4f46e5] flex items-center justify-center text-sm font-bold">
                  {s.user_profiles?.first_name?.[0] || '?'}
                </div>
                <div>
                  <p className="font-medium text-white">{s.user_profiles?.first_name} {s.user_profiles?.last_name}</p>
                  <p className="text-xs text-[#918fa1]">{s.student_id_number} · {s.user_profiles?.email}</p>
                </div>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full ${s.facial_embedding ? 'bg-emerald-900/50 text-emerald-300' : 'bg-amber-900/50 text-amber-300'}`}>
                {s.facial_embedding ? '✓ Face Enrolled' : '⚠ No Face Data'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────── COURSES TAB ──────────────────────────── */
function CoursesTab({ userId }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('courses')
      .select('*, enrollments(count)')
      .order('created_at', { ascending: false });
    setCourses(data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('courses').insert([{ course_code: code, course_name: name, faculty_id: userId }]);
    setCode(''); setName(''); setShowForm(false); setSaving(false);
    fetchCourses();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this course? All enrollments and logs will also be removed.')) return;
    await supabase.from('courses').delete().eq('id', id);
    fetchCourses();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">My Courses</h3>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4f46e5] to-[#7c03d3] rounded-xl text-sm font-medium hover:opacity-90 transition">
          <Plus className="w-4 h-4" /> New Course
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-[#0b1326] rounded-xl p-5 border border-[#2d3449] mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input value={code} onChange={e => setCode(e.target.value)} placeholder="Course Code (e.g. CS101)" required
              className="bg-[#131b2e] text-white rounded-xl px-4 py-3 outline-none border border-[#2d3449] focus:border-[#4cd7f6] transition" />
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Course Name" required
              className="bg-[#131b2e] text-white rounded-xl px-4 py-3 outline-none border border-[#2d3449] focus:border-[#4cd7f6] transition" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm transition">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="flex items-center gap-2 px-4 py-2 bg-[#2d3449] rounded-lg text-sm transition">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#4cd7f6]" /></div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 text-[#918fa1]">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No courses created yet. Click "New Course" to start.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {courses.map(c => (
            <div key={c.id} className="flex items-center justify-between bg-[#0b1326] rounded-xl p-4 border border-[#2d3449]/50">
              <div>
                <p className="font-medium text-white">{c.course_name}</p>
                <p className="text-xs text-[#918fa1]">{c.course_code} · {c.enrollments?.[0]?.count || 0} enrolled</p>
              </div>
              <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg text-red-400 hover:bg-red-900/30 transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────── REGISTER STUDENT TAB ──────────────────────────── */
function RegisterStudent({ userId }) {
  const [courses, setCourses] = useState([]);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [image, setImage] = useState(null);
  
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('courses').select('id, course_code, course_name').order('course_name');
      setCourses(data || []);
    })();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setImage(null);
      }
    } catch (err) {
      setStatus(`Error accessing camera: ${err.message}`);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const captureFace = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, 320, 240);
      const dataUrl = canvasRef.current.toDataURL('image/jpeg');
      setImage(dataUrl);
      stopCamera();
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!image) { setStatus('Error: Please capture a face image first.'); return; }
    
    setSaving(true);
    setStatus('Registering student and extracting facial features...');
    
    try {
      const res = await fetch('http://localhost:5001/api/students/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          first_name: firstName,
          last_name: lastName,
          student_id_number: studentId,
          course_id: selectedCourse,
          image
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server error');
      
      setStatus('✅ Successfully registered ' + firstName + ' with face data!');
      setEmail(''); setFirstName(''); setLastName(''); setStudentId(''); setImage(null);
    } catch (err) {
      setStatus('❌ ' + err.message);
    }
    setSaving(false);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Register New Student</h3>
      <p className="text-sm text-[#918fa1] mb-6">Create a student profile, capture their face, and enroll them in a course.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleRegister} className="space-y-4 bg-[#0b1326] p-6 rounded-xl border border-[#2d3449]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#918fa1] mb-1">First Name</label>
              <input value={firstName} onChange={e=>setFirstName(e.target.value)} required className="w-full bg-[#131b2e] text-white rounded-lg px-3 py-2 outline-none border border-[#2d3449] focus:border-[#4cd7f6]" />
            </div>
            <div>
              <label className="block text-xs text-[#918fa1] mb-1">Last Name</label>
              <input value={lastName} onChange={e=>setLastName(e.target.value)} required className="w-full bg-[#131b2e] text-white rounded-lg px-3 py-2 outline-none border border-[#2d3449] focus:border-[#4cd7f6]" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-[#918fa1] mb-1">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full bg-[#131b2e] text-white rounded-lg px-3 py-2 outline-none border border-[#2d3449] focus:border-[#4cd7f6]" />
          </div>
          <div>
            <label className="block text-xs text-[#918fa1] mb-1">Student ID (e.g. STU-1001)</label>
            <input value={studentId} onChange={e=>setStudentId(e.target.value)} required className="w-full bg-[#131b2e] text-white rounded-lg px-3 py-2 outline-none border border-[#2d3449] focus:border-[#4cd7f6]" />
          </div>
          <div>
             <label className="block text-xs text-[#918fa1] mb-1">Enroll in Course</label>
             <select value={selectedCourse} onChange={e=>setSelectedCourse(e.target.value)} required className="w-full bg-[#131b2e] text-white rounded-lg px-3 py-2 outline-none border border-[#2d3449] focus:border-[#4cd7f6]">
               <option value="">Select a course...</option>
               {courses.map(c => <option key={c.id} value={c.id}>{c.course_code} - {c.course_name}</option>)}
             </select>
          </div>
          <button type="submit" disabled={saving} className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-[#4f46e5] to-[#7c03d3] py-3 rounded-xl text-sm font-bold shadow-lg hover:opacity-90 transition disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <UserCheck className="w-4 h-4"/>} Register & Enroll
          </button>
          
          {status && <div className={`mt-4 p-3 text-sm rounded-lg ${status.startsWith('✅') ? 'bg-emerald-900/40 border border-emerald-500/50 text-emerald-300' : 'bg-red-900/40 border border-red-500/50 text-red-300'}`}>{status}</div>}
        </form>

        <div className="bg-[#0b1326] p-6 rounded-xl border border-[#2d3449] flex flex-col items-center justify-center">
          <div className="w-full max-w-[320px] aspect-video bg-[#131b2e] rounded-lg border-2 border-dashed border-[#2d3449] overflow-hidden relative mb-4">
            {image ? (
              <img src={image} alt="Captured face" className="w-full h-full object-cover" />
            ) : (
              <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`} />
            )}
            {!cameraActive && !image && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-[#918fa1]">
                <Camera className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-xs">Camera off</p>
              </div>
            )}
            <canvas ref={canvasRef} width="320" height="240" className="hidden" />
          </div>
          
          {cameraActive ? (
            <button type="button" onClick={captureFace} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-full text-sm font-medium transition shadow-lg animate-pulse">
              Capture Face
            </button>
          ) : (
            <button type="button" onClick={startCamera} className="px-6 py-2 bg-[#2d3449] hover:bg-[#3a4260] rounded-full text-sm font-medium transition flex items-center gap-2">
              <Camera className="w-4 h-4" /> Start Camera
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────── TAKE ATTENDANCE TAB ──────────────────────────── */
function TakeAttendance({ userId }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [recognized, setRecognized] = useState([]);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const recognitionInterval = useRef(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('courses').select('id, course_code, course_name').order('course_name');
      setCourses(data || []);
    })();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    if (!selectedCourse) { setStatus('Please select a course first.'); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setStatus('Camera active. Scanning for faces...');
        
        // Start polling the backend every 2 seconds
        recognitionInterval.current = setInterval(processFrame, 2000);
      }
    } catch (err) {
      setStatus(`Error accessing camera: ${err.message}`);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
    if (recognitionInterval.current) {
      clearInterval(recognitionInterval.current);
    }
  };

  const processFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 320, 240);
    const dataUrl = canvasRef.current.toDataURL('image/jpeg');

    try {
      const res = await fetch('http://localhost:5001/api/attendance/recognize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl })
      });
      const data = await res.json();
      if (data.recognized && data.recognized.length > 0) {
        setRecognized(prev => {
          const newList = [...prev];
          data.recognized.forEach(student => {
            if (!newList.find(s => s.id === student.id)) {
              newList.push(student);
            }
          });
          return newList;
        });
      }
    } catch (err) {
      console.error('Recognition error:', err);
    }
  };

  const handleSaveAll = async () => {
    if (recognized.length === 0) return;
    setSaving(true);
    setStatus('Saving attendance...');
    
    const logs = recognized.map(student => ({
      student_id: student.id,
      course_id: selectedCourse,
      status: 'present',
      logged_by: userId,
      timestamp: new Date().toISOString()
    }));

    const { error } = await supabase.from('attendance_logs').insert(logs);
    
    setSaving(false);
    if (error) {
      setStatus(`❌ Error saving: ${error.message}`);
    } else {
      setStatus(`✅ Successfully saved attendance for ${recognized.length} students!`);
      setRecognized([]);
      stopCamera();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Batch Camera Attendance</h3>
          <p className="text-sm text-[#918fa1]">Scan multiple faces simultaneously</p>
        </div>
        <select value={selectedCourse} onChange={e => { setSelectedCourse(e.target.value); setRecognized([]); }}
          className="bg-[#131b2e] text-white rounded-xl px-4 py-2 outline-none border border-[#2d3449] focus:border-[#4cd7f6]">
          <option value="">Select a course...</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.course_code} - {c.course_name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Camera Section (Span 3) */}
        <div className="md:col-span-3 bg-[#0b1326] p-4 rounded-xl border border-[#2d3449] flex flex-col">
          <div className="w-full aspect-video bg-[#131b2e] rounded-lg border-2 border-dashed border-[#2d3449] overflow-hidden relative mb-4">
            <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`} />
            {!cameraActive && (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-[#918fa1]">
                 <Camera className="w-10 h-10 mb-2 opacity-50" />
                 <p className="text-sm">Select course and start camera</p>
               </div>
            )}
            <canvas ref={canvasRef} width="320" height="240" className="hidden" />
          </div>
          
          <div className="flex justify-center gap-4">
            {cameraActive ? (
              <button onClick={stopCamera} className="px-6 py-2 bg-red-900/50 hover:bg-red-900/80 text-red-300 rounded-full text-sm font-medium transition flex items-center gap-2">
                Stop Camera
              </button>
            ) : (
              <button onClick={startCamera} className="px-6 py-2 bg-gradient-to-r from-[#4cd7f6] to-[#4f46e5] text-white rounded-full text-sm font-medium transition flex items-center gap-2 shadow-lg">
                <Camera className="w-4 h-4" /> Start Camera
              </button>
            )}
          </div>
        </div>

        {/* Recognized List (Span 2) */}
        <div className="md:col-span-2 bg-[#0b1326] p-4 rounded-xl border border-[#2d3449] flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2d3449]">
            <h4 className="font-semibold text-white">Recognized Students</h4>
            <span className="text-xs bg-[#4f46e5]/20 text-[#c3c0ff] px-2 py-1 rounded-full">{recognized.length} detected</span>
          </div>
          
          <div className="flex-1 overflow-y-auto max-h-[250px] space-y-2 mb-4 custom-scroll pr-2">
            {recognized.length === 0 ? (
              <div className="text-center py-8 text-[#918fa1] text-sm">Waiting for faces...</div>
            ) : (
              recognized.map((s, i) => (
                <div key={i} className="flex items-center gap-3 bg-[#131b2e] p-3 rounded-lg border border-emerald-500/30">
                  <div className="w-8 h-8 rounded-full bg-emerald-900/50 flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{s.name}</p>
                    <p className="text-xs text-[#918fa1]">{s.student_id_number}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {status && <div className={`mb-3 p-2 text-xs rounded-lg text-center ${status.includes('❌') || status.includes('Error') ? 'bg-red-900/30 text-red-300' : 'bg-[#131b2e] text-[#918fa1]'}`}>{status}</div>}

          <button onClick={handleSaveAll} disabled={saving || recognized.length === 0} 
            className="w-full mt-auto py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:bg-[#2d3449] rounded-xl text-sm font-bold text-white transition flex items-center justify-center gap-2 shadow-lg">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save Attendance
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────── MAIN FACULTY DASHBOARD ──────────────────────────── */
export default function FacultyDashboard({ session, onLogout }) {
  const [activeTab, setActiveTab] = useState('live');
  const userId = session.user.id;

  useEffect(() => {
    // Ensure faculty profile exists to prevent foreign key errors on attendance logs
    (async () => {
      const { data } = await supabase.from('user_profiles').select('id').eq('id', userId).single();
      if (!data) {
        await supabase.from('user_profiles').insert([{
           id: userId,
           email: session.user.email,
           first_name: 'Faculty',
           last_name: 'Member',
           role: 'faculty'
        }]);
      }
    })();
  }, [userId, session.user.email]);

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-sans">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-[#0b1326]/80 backdrop-blur-xl border-b border-[#2d3449]/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#7c03d3] flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>Faculty Command Center</h1>
              <p className="text-xs text-[#918fa1]">{session.user.email}</p>
            </div>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-[#2d3449] hover:bg-[#3a4260] rounded-xl text-sm transition">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <div className="flex gap-2 p-1.5 bg-[#131b2e] rounded-2xl border border-[#2d3449]/50">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${activeTab === tab.id ? 'bg-gradient-to-r from-[#4f46e5] to-[#7c03d3] text-white shadow-lg' : 'text-[#918fa1] hover:text-white hover:bg-[#2d3449]/50'}`}>
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-[#131b2e] rounded-2xl p-6 border border-[#2d3449]/50 shadow-xl min-h-[500px]">
          {activeTab === 'live' && <LiveFeed />}
          {activeTab === 'roster' && <StudentRoster />}
          {activeTab === 'courses' && <CoursesTab userId={userId} />}
          {activeTab === 'register' && <RegisterStudent userId={userId} />}
          {activeTab === 'attendance' && <TakeAttendance userId={userId} />}
        </div>
      </div>
    </div>
  );
}
