import React, { useState, useEffect } from 'react';
import StudentHome from './StudentHome';
import StudentHistory from './StudentHistory';
import StudentCourses from './StudentCourses';
import StudentProfile from './StudentProfile';
import CalendarView from './CalendarView';

export default function StudentPortal({ user, onLogout, isDarkMode, toggleTheme }) {
  const [currentTab, setCurrentTab] = useState('home');
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/student/dashboard/${user.id}`);
        const data = await response.json();
        setStudentData(data);
      } catch (error) {
        console.error('Failed to fetch student data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchStudentData();
  }, [user?.id]);

  // Premium Deep Blue Palette (Phase 8)
  const styles = {
    surface: isDarkMode ? 'bg-[#0A0F1C]' : 'bg-[#f8f9fc]',
    surfaceLow: isDarkMode ? 'bg-[#111A2C]' : 'bg-[#ffffff]',
    surfaceContainer: isDarkMode ? 'bg-[#15213A]' : 'bg-[#f1f3f9]',
    surfaceHighest: isDarkMode ? 'bg-[#1e2d4a]' : 'bg-[#e2e8f0]',
    textPrimary: isDarkMode ? 'text-[#F8FAFC]' : 'text-[#1e293b]',
    textSecondary: isDarkMode ? 'text-[#94a3b8]' : 'text-[#64748b]',
    accentPrimary: 'text-[#8283ff]',
    accentSecondary: 'text-[#4edea3]',
  };

  if (loading) {
    return (
      <div className={`${styles.surface} min-h-screen flex flex-col items-center justify-center gap-8`}>
        <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-[#c0c1ff]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#c0c1ff] rounded-full border-t-transparent animate-spin"></div>
        </div>
        <div className="text-center">
            <p className={`${styles.textPrimary} font-black text-xs uppercase tracking-[0.4em] mb-2`}>Scholar Slate Pro</p>
            <p className={`${styles.textSecondary} text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse`}>Syncing Academic Lexicon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.surface} ${styles.textPrimary} font-inter min-h-screen relative overflow-x-hidden transition-colors duration-500`}>
      {/* Editorial Header */}
      <header className="fixed top-0 w-full z-50 bg-opacity-80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8083ff] to-[#c0c1ff] flex items-center justify-center shadow-lg shadow-[#8083ff]/20 overflow-hidden">
            <img alt="User" className="w-full h-full object-cover" src={user?.avatar_url || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=150"}/>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-lg font-black tracking-[-0.04em] uppercase leading-none">Scholar <span className={styles.accentPrimary}>Slate Pro</span></h1>
            <p className={`text-[10px] ${styles.textSecondary} font-bold tracking-[0.2em] mt-1.5 uppercase`}>Scholarly Identity Portal</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-10">
          {['home', 'courses', 'calendar', 'history', 'profile'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-1 ${currentTab === tab ? styles.accentPrimary : styles.textSecondary + ' hover:text-[#dae2fd]'}`}
            >
              {tab}
              {currentTab === tab && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#8083ff] to-[#c0c1ff] rounded-full"></span>}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <button 
            onClick={toggleTheme}
            className={`w-10 h-10 flex items-center justify-center rounded-xl ${styles.surfaceContainer} hover:${styles.surfaceHighest} transition-all active:scale-95`}
          >
            <span className="material-symbols-outlined text-lg">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          
          <div className="h-8 w-px bg-white/10 mx-2"></div>

          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-xs font-black tracking-tight">{user?.full_name}</p>
                <p className={`text-[9px] ${styles.accentSecondary} font-bold uppercase tracking-widest`}>Active Scholarly Logic</p>
             </div>
             <button onClick={onLogout} className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                <span className="material-symbols-outlined text-lg">logout</span>
             </button>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-32 max-w-[1600px] mx-auto px-8">
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {currentTab === 'home' && <StudentHome user={user} studentData={studentData} isDarkMode={isDarkMode} />}
            {currentTab === 'history' && <StudentHistory history={studentData?.history || []} isDarkMode={isDarkMode} />}
            {currentTab === 'courses' && <StudentCourses courses={studentData?.courses || []} isDarkMode={isDarkMode} />}
            {currentTab === 'calendar' && <CalendarView attendanceLogs={studentData?.history || []} isDarkMode={isDarkMode} />}
            {currentTab === 'profile' && <StudentProfile user={user} records={studentData?.profile?.academic_records?.[0]} isDarkMode={isDarkMode} />}
        </div>
      </main>

      {/* Persistent Mobile Navigation (Glassmorphism) */}
      <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 md:hidden flex gap-2 p-2 bg-[#131b2e]/90 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-2xl">
          {[
            { id: 'home', icon: 'dashboard' },
            { id: 'courses', icon: 'school' },
            { id: 'calendar', icon: 'calendar_month' },
            { id: 'history', icon: 'history' },
            { id: 'profile', icon: 'person' }
          ].map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-[#c0c1ff] text-[#0b1326]' : 'text-white/60 hover:text-white'}`}
              >
                <span className="material-symbols-outlined">{tab.icon}</span>
              </button>
            )
          })}
      </nav>
    </div>
  );
}
