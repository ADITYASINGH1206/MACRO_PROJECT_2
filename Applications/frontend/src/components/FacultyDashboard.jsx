import React, { useState } from 'react';
import AddStudentModal from './AddStudentModal';
import CalendarView from './CalendarView';

export default function FacultyDashboard({ 
  user, onLogout, isDarkMode, toggleTheme, 
  students, attendanceLogs, 
  onNavigateManual, onNavigateHistory, onNavigateRoster,
  onMarkAttendance, onExportCSV 
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // High-fidelity Obsidian Theme Tokens
  const styles = {
    surface: isDarkMode ? 'bg-[#0b1326]' : 'bg-[#f8f9fc]',
    surfaceLow: isDarkMode ? 'bg-[#131b2e]' : 'bg-[#ffffff]',
    surfaceContainer: isDarkMode ? 'bg-[#171f33]' : 'bg-[#f1f3f9]',
    surfaceHighest: isDarkMode ? 'bg-[#2d3449]' : 'bg-[#e2e8f0]',
    textPrimary: isDarkMode ? 'text-[#dae2fd]' : 'text-[#1e293b]',
    textSecondary: isDarkMode ? 'text-[#c7c4d7]' : 'text-[#64748b]',
    accentPrimary: 'text-[#c0c1ff]',
    accentSecondary: 'text-[#4edea3]',
    accentTertiary: 'text-[#ffb783]',
    gradientPrimary: 'from-[#8083ff] to-[#c0c1ff]',
  };

  return (
    <div className={`${styles.surface} ${styles.textPrimary} font-inter selection:bg-[#c0c1ff]/30 min-h-screen transition-colors duration-500`}>
      {/* Editorial Navigation Bar */}
      <header className="fixed top-0 w-full z-50 bg-opacity-80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8083ff] to-[#c0c1ff] flex items-center justify-center shadow-lg shadow-[#8083ff]/20">
            <span className="material-symbols-outlined text-white text-2xl">architecture</span>
          </div>
          <div className="hidden lg:block cursor-pointer" onClick={() => setActiveTab('overview')}>
            <h1 className="text-lg font-black tracking-[-0.04em] uppercase leading-none">Scholar <span className={styles.accentPrimary}>Slate Pro</span></h1>
            <p className={`text-[10px] ${styles.textSecondary} font-bold tracking-[0.2em] mt-1.5 uppercase`}>Faculty Intelligence Hub</p>
          </div>
        </div>

        <nav className="flex items-center gap-10">
          {['overview', 'students', 'attendance', 'calendar'].map((tab) => (
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
          <button 
            onClick={toggleTheme}
            className={`w-10 h-10 flex items-center justify-center rounded-xl ${styles.surfaceContainer} hover:${styles.surfaceHighest} transition-all active:scale-95`}
            title="Toggle Theme"
          >
            <span className="material-symbols-outlined text-lg">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
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
                      <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-70">Neural Engine Optimized</span>
                    </div>
                    <h2 className="text-6xl font-black tracking-[-0.05em] leading-[0.9] mb-6">Faculty<br/><span className={styles.accentPrimary}>Analytics</span></h2>
                    <p className={`${styles.textSecondary} text-lg font-light leading-relaxed`}>
                      Your digital curator for real-time scholastic presence and academic performance tracking.
                    </p>
                    
                    <div className="mt-12 flex items-center gap-12">
                      <div onClick={onNavigateRoster} className="cursor-pointer group/stat">
                        <p className={`text-[11px] font-black ${styles.textSecondary} uppercase tracking-[0.2em] mb-2 group-hover/stat:text-[#c0c1ff]`}>Total Scholars</p>
                        <p className="text-5xl font-black tracking-tighter">{students.length}</p>
                      </div>
                      <div className="h-12 w-px bg-white/10"></div>
                      <div onClick={onNavigateHistory} className="cursor-pointer group/stat">
                        <p className={`text-[11px] font-black ${styles.textSecondary} uppercase tracking-[0.2em] mb-2 group-hover/stat:text-[#4edea3]`}>Session Integrity</p>
                        <p className={`text-5xl font-black tracking-tighter ${styles.accentSecondary}`}>98.4%</p>
                      </div>
                    </div>
                  </div>

                  <div className="hidden lg:flex w-64 h-64 bg-white/5 rounded-full items-center justify-center border-4 border-white/5 relative">
                     <div className="absolute inset-0 border-4 border-[#c0c1ff] rounded-full border-t-transparent animate-[spin_8s_linear_infinite]"></div>
                     <div className="text-center">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Efficiency</p>
                        <p className="text-5xl font-black text-[#c0c1ff]">94</p>
                     </div>
                  </div>
                </div>
              </div>

              <div className={`${styles.surfaceLow} lg:col-span-4 p-12 rounded-[2rem] flex flex-col justify-between shadow-2xl relative group`}>
                <div>
                   <div className={`w-16 h-16 rounded-2xl ${styles.surfaceContainer} flex items-center justify-center mb-8 border border-white/5 transition-transform group-hover:scale-110`}>
                      <span className={`material-symbols-outlined text-4xl ${styles.accentTertiary}`}>auto_awesome</span>
                   </div>
                   <h3 className="text-2xl font-black tracking-tight leading-tight mb-4">Strategic<br/>Commands</h3>
                   <p className={`${styles.textSecondary} text-sm leading-relaxed`}>Deploy administrative tools and manage student registries with a single interaction.</p>
                </div>
                
                <div className="mt-12 space-y-4">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-5 bg-gradient-to-r from-[#8083ff] to-[#c0c1ff] text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-[#8083ff]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Quick Enroll
                  </button>
                  <button 
                    onClick={onNavigateManual}
                    className={`w-full py-5 ${styles.surfaceHighest} border border-white/5 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all`}
                  >
                    Mark Attendance
                  </button>
                </div>
              </div>
            </section>

            {/* Live Feed Section */}
            <section className="space-y-8">
               <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black tracking-tight">Recent Indexing Activity</h3>
                  <button onClick={onNavigateHistory} className={`${styles.accentPrimary} text-[11px] font-black uppercase tracking-[0.2em] hover:underline underline-offset-8 decoration-2`}>Temporal Ledger</button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {attendanceLogs.slice(0, 3).map((log, idx) => (
                    <div key={log.id} className={`${styles.surfaceLow} p-8 rounded-[2rem] border border-white/5 hover:border-[#c0c1ff]/30 transition-all group relative overflow-hidden`}>
                       <div className="flex items-center gap-5 mb-8">
                          <div className={`w-14 h-14 rounded-2xl ${styles.surfaceContainer} flex items-center justify-center font-black text-xl text-[#c0c1ff]`}>
                             {log.profiles?.full_name?.[0] || 'S'}
                          </div>
                          <div>
                             <h4 className="font-black tracking-tight text-lg leading-none mb-1.5">{log.profiles?.full_name || 'Anonymous'}</h4>
                             <p className={`text-[10px] ${styles.textSecondary} font-bold uppercase tracking-widest`}>{new Date(log.timestamp || log.created_at).toLocaleTimeString()}</p>
                          </div>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${log.status === 'present' ? 'bg-[#4edea3]/10 text-[#4edea3]' : 'bg-red-500/10 text-red-400'}`}>
                             {log.status}
                          </span>
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
                <h2 className="text-5xl font-black tracking-tight font-headline">Registry Preview</h2>
                <p className={`${styles.textSecondary} text-lg font-light mt-3`}>Authorized catalog of {students.length} scholarly identities.</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={onNavigateRoster}
                  className={`px-8 py-5 ${styles.surfaceLow} border border-white/10 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/5 transition-all`}
                >
                  Deep Registry
                </button>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-8 py-5 bg-gradient-to-r from-[#8083ff] to-[#c0c1ff] text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-[#8083ff]/30 hover:scale-[1.02] transition-all"
                >
                  Enroll New Identity
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {students.slice(0, 6).map(student => (
                <div key={student.id} className={`${styles.surfaceLow} p-10 rounded-[2.5rem] border border-white/5 hover:border-[#c0c1ff]/30 transition-all group shadow-2xl relative overflow-hidden`}>
                   <div className="flex items-center gap-6">
                    <div className={`w-20 h-20 rounded-3xl ${styles.surfaceContainer} flex items-center justify-center font-black text-3xl text-[#c0c1ff] border border-white/5`}>
                      {student.full_name[0]}
                    </div>
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

        {activeTab === 'attendance' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 text-center lg:text-left">
              <div className="flex-1">
                <h2 className="text-5xl font-black tracking-tight leading-[0.9]">Scholastic<br/>Ledger</h2>
                <p className={`${styles.textSecondary} text-lg font-light mt-4`}>The immutable record of institutional presence.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                 <button 
                  onClick={onNavigateHistory}
                  className={`${styles.surfaceLow} px-8 py-5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all`}
                 >
                    Deep Temporal Audit
                 </button>
                 <button 
                  onClick={onExportCSV}
                  className="px-8 py-5 bg-gradient-to-r from-[#8083ff] to-[#c0c1ff] text-white rounded-2xl shadow-xl shadow-[#8083ff]/30 text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-[1.02] transition-all active:scale-95"
                 >
                    <span className="material-symbols-outlined text-xl">data_saver_on</span>
                    Extract Ledger
                 </button>
              </div>
            </div>

            <div className={`${styles.surfaceLow} rounded-[2.5rem] p-12 border border-white/5 shadow-2xl relative overflow-hidden`}>
               <h3 className="text-2xl font-black tracking-tight mb-8">Override Presence Protocol</h3>
               <div className="flex flex-col xl:flex-row gap-6">
                  <select 
                    id="student-select-dashboard"
                    className={`flex-1 ${styles.surfaceContainer} border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold tracking-tight text-[#dae2fd] outline-none focus:border-[#c0c1ff] transition-all cursor-pointer appearance-none shadow-sm`}
                  >
                    <option value="">Authorize Identity Selection...</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.full_name} ({s.email})</option>)}
                  </select>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        const sid = document.getElementById('student-select-dashboard').value;
                        if(sid) onMarkAttendance(sid, 'present');
                      }}
                      className="px-12 py-5 bg-[#4edea3] text-[#0b1326] font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-[#4edea3]/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Present
                    </button>
                    <button 
                      onClick={() => {
                        const sid = document.getElementById('student-select-dashboard').value;
                        if(sid) onMarkAttendance(sid, 'absent');
                      }}
                      className="px-12 py-5 bg-red-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Absent
                    </button>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <CalendarView attendanceLogs={attendanceLogs} isDarkMode={isDarkMode} />
        )}
      </main>

      <AddStudentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onStudentAdded={() => {}} // Root App handles refresh
      />
    </div>
  );
}
