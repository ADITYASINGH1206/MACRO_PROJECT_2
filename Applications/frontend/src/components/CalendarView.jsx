import React from 'react';

export default function CalendarView({ user, isDarkMode }) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const sessions = [
    { id: 1, title: 'Data Structures', time: '09:00 AM', room: 'L-402', type: 'Lecture', day: 1 },
    { id: 2, title: 'Advanced Calculus', time: '01:30 PM', room: 'M-101', type: 'Lab', day: 2 },
    { id: 3, title: 'System Architecture', time: '10:45 AM', room: 'S-220', type: 'Seminar', day: 3 },
    { id: 4, title: 'Database Systems', time: '02:00 PM', room: 'L-301', type: 'Lecture', day: 4 },
    { id: 5, title: 'Ethics in AI', time: '11:00 AM', room: 'Auditorium', type: 'Special', day: 5 },
  ];

  const currentMonth = "March 2026";
  const daysInMonth = 31;

  const styles = {
    surface: isDarkMode ? 'bg-[#0b1326]' : 'bg-[#f8f9fc]',
    surfaceLow: isDarkMode ? 'bg-[#131b2e]' : 'bg-[#ffffff]',
    surfaceContainer: isDarkMode ? 'bg-[#171f33]' : 'bg-[#f1f3f9]',
    surfaceHighest: isDarkMode ? 'bg-[#2d3449]' : 'bg-[#e2e8f0]',
    textPrimary: isDarkMode ? 'text-[#dae2fd]' : 'text-[#1e293b]',
    textSecondary: isDarkMode ? 'text-[#c7c4d7]' : 'text-[#64748b]',
    accentPrimary: 'text-[#c0c1ff]',
    accentSecondary: 'text-[#4edea3]',
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-5xl font-black tracking-tight leading-[0.9]">Temporal<br/>Mapping</h2>
          <p className={`${styles.textSecondary} text-lg font-light mt-4`}>Institutional session timeline and scholarly engagements.</p>
        </div>
        <div className="flex items-center gap-6">
           <div className={`px-6 py-4 ${styles.surfaceLow} rounded-2xl border border-white/5 font-black text-xs uppercase tracking-[0.2em]`}>
              {currentMonth}
           </div>
           <div className="flex gap-2">
              <button className={`p-3 ${styles.surfaceLow} rounded-xl border border-white/5 hover:border-[#c0c1ff]/30 transition-all`}>
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className={`p-3 ${styles.surfaceLow} rounded-xl border border-white/5 hover:border-[#c0c1ff]/30 transition-all`}>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calendar Grid - The "Obsidian" Grid */}
        <div className={`lg:col-span-8 ${styles.surfaceLow} rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden group`}>
           <div className="absolute top-0 right-0 p-12 opacity-0 group-hover:opacity-5 transition-opacity">
              <span className="material-symbols-outlined text-[120px]">calendar_month</span>
           </div>
           
           <div className="grid grid-cols-7 gap-4 mb-8 text-center">
            {days.map(day => (
              <div key={day} className={`text-[10px] font-black uppercase tracking-[0.3em] ${styles.textSecondary} opacity-40 py-2`}>
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-4">
            {[...Array(daysInMonth)].map((_, i) => {
              const dayNum = i + 1;
              const hasEvent = sessions.some(s => s.day === (i % 7));
              return (
                <div 
                  key={i} 
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all cursor-pointer group/cell
                    ${hasEvent 
                        ? `bg-gradient-to-br from-[#8083ff]/20 to-[#c0c1ff]/10 border border-[#c0c1ff]/30 text-[#c0c1ff]` 
                        : `${styles.surfaceContainer} border border-white/5 hover:border-white/20 text-[#dae2fd]`}`}
                >
                  <span className="text-sm font-black tracking-tighter">{dayNum}</span>
                  {hasEvent && <div className="absolute bottom-3 w-1.5 h-1.5 bg-[#4edea3] rounded-full shadow-[0_0_8px_#4edea3]"></div>}
                  
                  {/* Hover Detail Preview */}
                  {hasEvent && (
                    <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover/cell:opacity-100 bg-[#c0c1ff] text-[#0b1326] flex items-center justify-center rounded-2xl transition-all scale-95 group-hover/cell:scale-100 z-10 shadow-xl">
                        <span className="material-symbols-outlined text-xl">event_available</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sessions Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className={`${styles.surfaceLow} rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-6xl">target</span>
            </div>
            <h3 className="text-2xl font-black tracking-tight mb-10">Agenda Index</h3>
            
            <div className="space-y-6">
              {sessions.filter(s => s.day === (new Date().getDay() % 7)).map(session => (
                <div key={session.id} className={`${styles.surfaceContainer} p-6 rounded-2xl border border-white/5 hover:border-[#c0c1ff]/30 transition-all group/item`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-[#c0c1ff]/10 text-[#c0c1ff] px-3 py-1.5 rounded-full border border-[#c0c1ff]/20">
                      {session.type}
                    </span>
                    <span className={`text-[10px] ${styles.textSecondary} font-bold uppercase tracking-widest`}>{session.time}</span>
                  </div>
                  <h4 className="font-black text-lg tracking-tight mb-2 group-hover/item:text-[#c0c1ff] transition-colors">{session.title}</h4>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40">
                    <span className="material-symbols-outlined text-xs">location_on</span>
                    {session.room}
                  </div>
                </div>
              ))}
              {sessions.filter(s => s.day === (new Date().getDay() % 7)).length === 0 && (
                <div className="text-center py-12">
                  <div className={`w-16 h-16 rounded-full ${styles.surfaceContainer} flex items-center justify-center mx-auto mb-6 opacity-40`}>
                     <span className="material-symbols-outlined text-3xl">inbox</span>
                  </div>
                  <p className={`text-xs ${styles.textSecondary} font-black uppercase tracking-[0.2em] opacity-40`}>Neural Log Clear</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-[#8083ff]/10 to-[#c0c1ff]/5 border border-[#8083ff]/20 relative overflow-hidden group">
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#c0c1ff]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="flex items-center gap-4 mb-6 text-[#c0c1ff]">
              <span className="material-symbols-outlined text-3xl">analytics</span>
              <h4 className="font-black text-sm uppercase tracking-[0.2em]">Efficiency Analysis</h4>
            </div>
            <p className={`${styles.textSecondary} text-xs leading-relaxed font-medium`}>
              Chronos optimization detected: Your scholastic flow peaks during <span className="text-[#dae2fd]">Morning Intervals</span>. Aligning advanced research logic with peak cognitive windows is advised.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
