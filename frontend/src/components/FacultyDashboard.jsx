import React, { useState, useEffect } from 'react';
import AddStudentModal from './AddStudentModal';
import CalendarView from './CalendarView';
import BiometricFeed from './BiometricFeed';
import FacultyCourses from './FacultyCourses';

export default function FacultyDashboard({ 
  user, onLogout, isDarkMode, toggleTheme, 
  students = [], attendanceLogs = [], 
  onNavigateManual, onNavigateHistory, onNavigateRoster,
  onMarkAttendance, onExportCSV, onRefreshStudents,
  courses = []
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiveRunning, setIsLiveRunning] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const [activeTrackingCourseId, setActiveTrackingCourseId] = useState(courses[0]?.id || '');
  const [showCreateCourse, setShowCreateCourse] = useState(false);

  // Sync activeTrackingCourseId if courses load/change
  useEffect(() => {
    if (!activeTrackingCourseId && courses.length > 0) {
      setActiveTrackingCourseId(courses[0].id);
    }
  }, [courses, activeTrackingCourseId]);

  const toggleLiveTracking = async () => {
    try {
      if (!activeTrackingCourseId) {
        alert("Please select a course to track.");
        return;
      }
      setIsBooting(true);
      if (isLiveRunning) {
        await fetch('http://localhost:3000/api/faculty/stop-live-tracking', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ course_id: activeTrackingCourseId })
        });
        setIsLiveRunning(false);
      } else {
        await fetch('http://localhost:3000/api/faculty/start-live-tracking', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ course_id: activeTrackingCourseId })
        });
        setIsLiveRunning(true);
      }
      if (onRefreshStudents) onRefreshStudents();
    } catch (e) {
      console.error(e);
      alert("Failed to contact the backend ML agent gateway.");
    } finally {
      setIsBooting(false);
    }
  };

  const styles = {
    surface: isDarkMode ? 'bg-[#0A0F1C]' : 'bg-[#f8f9fc]',
    surfaceLow: isDarkMode ? 'bg-[#111A2C]' : 'bg-[#ffffff]',
    surfaceContainer: isDarkMode ? 'bg-[#15213A]' : 'bg-[#f1f3f9]',
    surfaceHighest: isDarkMode ? 'bg-[#1e2d4a]' : 'bg-[#e2e8f0]',
    textPrimary: isDarkMode ? 'text-[#F8FAFC]' : 'text-[#1e293b]',
    textSecondary: isDarkMode ? 'text-[#94a3b8]' : 'text-[#64748b]',
    accentPrimary: 'text-[#8283ff]',
    accentSecondary: 'text-[#4edea3]',
    accentTertiary: 'text-[#ffb783]',
    gradientPrimary: 'from-[#8283ff] to-[#a5b4fc]',
  };

  return (
    <div className={`${styles.surface} ${styles.textPrimary} font-sans selection:bg-primary/20 min-h-screen transition-colors duration-300`}>
      <header className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-8 py-5" style={{backgroundColor: isDarkMode ? 'rgba(10,15,28,0.9)' : 'rgba(248,249,252,0.9)', boxShadow: '0 1px 24px rgba(0,0,0,0.3)'}}>
        <div className="flex items-center gap-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8083ff] to-[#c0c1ff] flex items-center justify-center shadow-lg shadow-[#8083ff]/20">
            <span className="material-symbols-outlined text-white text-2xl">face</span>
          </div>
          <div className="hidden lg:block cursor-pointer" onClick={() => setActiveTab('overview')}>
            <h1 className="text-lg font-black tracking-[-0.04em] uppercase leading-none">Veri<span className={styles.accentPrimary}>Face</span></h1>
            <p className={`text-[10px] ${styles.textSecondary} font-bold tracking-[0.2em] mt-1.5 uppercase`}>
              {user?.course_name ? `${user.course_name} Attendance System` : 'Attendance System'}
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-10">
          {['overview', 'students', 'courses', 'attendance', 'calendar'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-1 ${activeTab === tab ? styles.accentPrimary : styles.textSecondary + ' hover:text-[#dae2fd]'}`}
            >
              {tab}
              {activeTab === tab && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#8083ff] to-[#c0c1ff] rounded-full"></span>}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <button onClick={toggleTheme} className={`w-10 h-10 flex items-center justify-center rounded-xl ${styles.surfaceContainer} hover:${styles.surfaceHighest} transition-all active:scale-95`}>
            <span className="material-symbols-outlined text-lg">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <div className="h-8 w-px bg-white/10 mx-2"></div>
          <div className="hidden sm:flex items-center gap-4">
             <div className="text-right">
                <p className="text-xs font-black tracking-tight">{user?.full_name}</p>
                <p className="text-[9px] text-[#4edea3] font-bold uppercase tracking-widest">Authorized Access</p>
             </div>
             <button onClick={onLogout} className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                <span className="material-symbols-outlined text-lg">logout</span>
             </button>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-24 px-8 max-w-[1600px] mx-auto space-y-16">
        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-16">
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className={`lg:col-span-8 ${styles.surfaceLow} p-12 rounded-[2rem] relative overflow-hidden group shadow-2xl`}>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#8083ff]/5 rounded-full blur-[100px] -mr-48 -mt-48 transition-all group-hover:bg-[#8083ff]/10"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
                  <div className="max-w-md">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8">
                      <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
                      <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-70">Authorized Attendance Session</span>
                    </div>
                    <h2 className="text-6xl font-black tracking-[-0.05em] leading-[0.9] mb-6">Faculty<br/><span className={styles.accentPrimary}>Analytics</span></h2>
                    <p className={`${styles.textSecondary} text-lg font-light leading-relaxed`}>
                      Your digital system for real-time student presence and attendance tracking.
                    </p>
                    <div className="mt-12 flex items-center gap-12">
                      <div onClick={onNavigateRoster} className="cursor-pointer group/stat">
                        <p className={`text-[11px] font-black ${styles.textSecondary} uppercase tracking-[0.2em] mb-2`}>Total Students</p>
                        <p className="text-5xl font-black tracking-tighter">{students?.length || 0}</p>
                      </div>
                      <div className="h-12 w-px bg-white/10"></div>
                      <div onClick={onNavigateHistory} className="cursor-pointer group/stat">
                        <p className={`text-[11px] font-black ${styles.textSecondary} uppercase tracking-[0.2em] mb-2`}>Faculty Context</p>
                        <p className={`text-5xl font-black tracking-tighter ${styles.accentSecondary}`}>Active</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${styles.surfaceLow} lg:col-span-4 p-12 rounded-[2rem] flex flex-col justify-between shadow-2xl relative group border border-white/5`}>
                <div>
                  <div className={`w-16 h-16 rounded-2xl ${styles.surfaceContainer} flex items-center justify-center mb-8 border border-white/5`}>
                    <span className={`material-symbols-outlined text-4xl ${styles.accentTertiary}`}>auto_awesome</span>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight leading-none mb-4">Course<br/>Management</h3>
                  <p className={`${styles.textSecondary} text-sm leading-relaxed`}>Deploy administrative tools and manage student enrollments instantly.</p>
                </div>
                <div className="mt-12 space-y-4">
                  {!isLiveRunning && (
                    <div className="mb-4">
                      <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${styles.textSecondary} mb-3 opacity-40 ml-1`}>Module Selection</p>
                      <select 
                        value={activeTrackingCourseId}
                        onChange={(e) => setActiveTrackingCourseId(e.target.value)}
                        className={`w-full ${styles.surfaceContainer} border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold text-[#dae2fd] outline-none transition-all cursor-pointer appearance-none shadow-sm mb-2`}
                      >
                        <option value="">Select Course...</option>
                        {(Array.isArray(courses) ? courses : []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  )}
                  {isLiveRunning && (
                    <div className="mb-8 animate-in fade-in zoom-in-95 duration-500 overflow-hidden rounded-2xl border border-white/10">
                      <BiometricFeed 
                        isDarkMode={isDarkMode} 
                        courses={courses} 
                        selectedCourseId={activeTrackingCourseId} 
                      />
                    </div>
                  )}
                  <button onClick={toggleLiveTracking} disabled={isBooting} className={`w-full py-5 ${isLiveRunning ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-gradient-to-r from-[#8083ff] to-[#c0c1ff] text-white shadow-xl shadow-[#8083ff]/30'} font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50`}>
                    {isBooting ? 'Booting Engine...' : (isLiveRunning ? 'Terminate Feed' : 'Start Live Feed')}
                  </button>
                  <button onClick={() => setIsModalOpen(true)} className="w-full py-5 bg-white/5 border border-white/5 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all">Enroll Student</button>
                  <button onClick={() => setShowCreateCourse(true)} className="w-full py-5 bg-[#8283ff]/10 border border-[#8283ff]/20 text-[#8283ff] font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-[#8283ff]/20 transition-all">Create Course</button>
                  <button onClick={onNavigateManual} className={`w-full py-5 ${styles.surfaceHighest} border border-white/5 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all`}>Manual Attendance</button>
                </div>
              </div>
            </section>

            <section className="space-y-8">
               <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black tracking-tight">Recent Indexing Activity</h3>
                  <button onClick={onNavigateHistory} className={`${styles.accentPrimary} text-[11px] font-black uppercase tracking-[0.2em] hover:underline underline-offset-8 decoration-2`}>View History</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {(Array.isArray(attendanceLogs) ? attendanceLogs : []).slice(0, 3).map((log) => (
                    <div key={log.id} className={`${styles.surfaceLow} p-8 rounded-[2rem] border border-white/5 hover:border-[#c0c1ff]/30 transition-all group relative overflow-hidden`}>
                       <div className="flex items-center gap-5 mb-8">
                          <div className={`w-14 h-14 rounded-2xl ${styles.surfaceContainer} flex items-center justify-center font-black text-xl text-[#c0c1ff]`}>{log.profiles?.full_name?.[0] || 'S'}</div>
                          <div>
                             <h4 className="font-black tracking-tight text-lg leading-none mb-1.5">{log.profiles?.full_name || 'Anonymous'}</h4>
                             <p className={`text-[10px] ${styles.textSecondary} font-bold uppercase tracking-widest`}>{new Date(log.timestamp || log.created_at).toLocaleTimeString()}</p>
                          </div>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${log.status === 'present' ? 'bg-[#4edea3]/10 text-[#4edea3]' : 'bg-red-500/10 text-red-400'}`}>{log.status}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </section>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <h2 className="text-5xl font-black tracking-tight">Verified Students</h2>
                <p className={`${styles.textSecondary} text-lg font-light mt-3`}>Authorized list of {students.length} students.</p>
              </div>
              <div className="flex gap-4">
                <button onClick={onNavigateRoster} className={`px-8 py-5 ${styles.surfaceLow} border border-white/10 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/5 transition-all`}>Detailed Roster</button>
                <button onClick={() => setIsModalOpen(true)} className="px-8 py-5 bg-gradient-to-r from-[#8083ff] to-[#c0c1ff] text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-[#8083ff]/30 hover:scale-[1.02] transition-all">Enroll Student</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {(Array.isArray(students) ? students : []).slice(0, 6).map(student => (
                <div key={student.id} className={`${styles.surfaceLow} p-10 rounded-[2.5rem] border border-white/5 hover:border-[#c0c1ff]/30 transition-all group shadow-2xl relative overflow-hidden`}>
                  <div className="flex items-center gap-6">
                    <div className={`w-20 h-20 rounded-3xl ${styles.surfaceContainer} flex items-center justify-center font-black text-3xl text-[#c0c1ff] border border-white/5`}>{student.full_name ? student.full_name[0] : 'S'}</div>
                    <div>
                      <h4 className="font-black text-2xl tracking-tighter mb-1.5 transition-colors group-hover:text-[#c0c1ff]">{student.full_name}</h4>
                      <p className={`text-xs ${styles.textSecondary} font-medium`}>{student.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
           <FacultyCourses courses={courses} isDarkMode={isDarkMode} />
        )}

        {activeTab === 'attendance' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 text-center lg:text-left">
              <div className="flex-1">
                <h2 className="text-5xl font-black tracking-tight leading-[0.9]">Attendance<br/>History</h2>
                <p className={`${styles.textSecondary} text-lg font-light mt-4`}>The secure record of student attendance.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                 <button onClick={onNavigateHistory} className={`${styles.surfaceLow} px-8 py-5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all`}>View All History</button>
                 <button onClick={onExportCSV} className="px-8 py-5 bg-gradient-to-r from-[#8083ff] to-[#c0c1ff] text-white rounded-2xl shadow-xl shadow-[#8083ff]/30 text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-[1.02] transition-all">
                    <span className="material-symbols-outlined text-xl">data_saver_on</span> Export CSV
                 </button>
              </div>
            </div>
            <div className={`${styles.surfaceLow} rounded-[2.5rem] p-12 border border-white/5 shadow-2xl relative overflow-hidden`}>
               <h3 className="text-2xl font-black tracking-tight mb-8">Manual Attendance Overrides</h3>
               <div className="flex flex-col xl:flex-row gap-6">
                  <select id="student-select-dashboard" className={`flex-1 ${styles.surfaceContainer} border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold text-[#dae2fd] outline-none transition-all cursor-pointer appearance-none shadow-sm`}>
                    <option value="">Select Student...</option>
                    {(Array.isArray(students) ? students : []).map(s => <option key={s.id} value={s.id}>{s.full_name} ({s.email})</option>)}
                  </select>
                  <select id="course-select-manual" className={`flex-1 ${styles.surfaceContainer} border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold text-[#dae2fd] outline-none transition-all cursor-pointer appearance-none shadow-sm`}>
                    <option value="">Select Course...</option>
                    {(Array.isArray(courses) ? courses : []).map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                  </select>
                  <div className="flex gap-4">
                    <button onClick={() => {
                        const sid = document.getElementById('student-select-dashboard').value;
                        const cid = document.getElementById('course-select-manual').value;
                        if(sid && cid) onMarkAttendance(sid, 'present', cid);
                        else alert("Please select both student and course.");
                    }} className="px-12 py-5 bg-[#4edea3] text-[#0b1326] font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-[#4edea3]/20 hover:scale-[1.02] transition-all">Present</button>
                    <button onClick={() => {
                        const sid = document.getElementById('student-select-dashboard').value;
                        const cid = document.getElementById('course-select-manual').value;
                        if(sid && cid) onMarkAttendance(sid, 'absent', cid);
                        else alert("Please select both student and course.");
                    }} className="px-12 py-5 bg-red-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-red-500/20 hover:scale-[1.02] transition-all">Absent</button>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <CalendarView attendanceLogs={attendanceLogs} isDarkMode={isDarkMode} />
        )}
      </main>

      <AddStudentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onStudentAdded={onRefreshStudents} />

      {showCreateCourse && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0A0F1C]/80 backdrop-blur-sm animate-in fade-in duration-300">
             <div className="bg-[#111A2C] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-8 relative animate-in zoom-in-95">
                <button onClick={() => setShowCreateCourse(false)} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
                <h3 className="text-2xl font-black mb-6">Course Setup</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const name = e.target.name.value;
                  const code = e.target.code.value;
                  try {
                    const res = await fetch('http://localhost:3000/api/faculty/create-course', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name, code, faculty_id: user.id })
                    });
                    if (res.ok) {
                      setShowCreateCourse(false);
                      onRefreshStudents();
                    }
                  } catch (err) { console.error(err); }
                }} className="space-y-6">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Course Name</label>
                      <input name="name" required className="w-full bg-white/5 border-b border-white/10 py-3 text-white focus:outline-none focus:border-[#8283ff]" placeholder="Advanced Neural Nets" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Module Code</label>
                      <input name="code" required className="w-full bg-white/5 border-b border-white/10 py-3 text-white focus:outline-none focus:border-[#8283ff]" placeholder="CS-401" />
                   </div>
                   <button type="submit" className="w-full py-4 bg-[#8283ff] text-white font-black rounded-xl shadow-lg hover:opacity-90 transition-all">Create Course</button>
                </form>
             </div>
          </div>
        )}
    </div>
  );
}
