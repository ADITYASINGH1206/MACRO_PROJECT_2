import React, { useState, useMemo } from 'react';

export default function CalendarView({ attendanceLogs = [], isDarkMode }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

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
  };

  const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    return { firstDay, totalDays };
  }, [currentDate]);

  const calendarDays = useMemo(() => {
    const days = [];
    // Padding for first week
    for (let i = 0; i < daysInMonth.firstDay; i++) {
      days.push({ day: null });
    }
    for (let i = 1; i <= daysInMonth.totalDays; i++) {
      const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), i).toDateString();
      const logsOnDay = attendanceLogs.filter(log => new Date(log.timestamp || log.created_at).toDateString() === dateStr);
      const health = logsOnDay.length > 0 
        ? (logsOnDay.every(l => l.status === 'present') ? 'healthy' : 'interrupted') 
        : 'none';
      
      days.push({ 
        day: i, 
        dateString: dateStr,
        health,
        logs: logsOnDay
      });
    }
    return days;
  }, [daysInMonth, attendanceLogs, currentDate]);

  const nextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  const prevMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-6xl font-black tracking-tighter leading-[0.85] font-headline">Scholastic<br/><span className={styles.accentPrimary}>Timeline</span></h2>
          <p className={`${styles.textSecondary} text-lg font-light mt-6 max-w-md`}>The immutable chronological index of institutional attendance and academic session flows.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 shadow-inner">
           <button onClick={prevMonth} className={`p-4 ${styles.surfaceLow} rounded-xl hover:bg-white/10 transition-all active:scale-90 shadow-xl`}>
             <span className="material-symbols-outlined text-sm">arrow_back</span>
           </button>
           <div className="px-8 font-black text-[11px] uppercase tracking-[0.3em] opacity-80 min-w-40 text-center">
              {monthYear}
           </div>
           <button onClick={nextMonth} className={`p-4 ${styles.surfaceLow} rounded-xl hover:bg-white/10 transition-all active:scale-90 shadow-xl`}>
             <span className="material-symbols-outlined text-sm">arrow_forward</span>
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        <div className="xl:col-span-8 space-y-8">
           <div className={`grid grid-cols-7 gap-6 text-center mb-4`}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">{d}</div>
              ))}
           </div>
           
           <div className="grid grid-cols-7 gap-6">
              {calendarDays.map((date, idx) => (
                <div 
                  key={idx}
                  onClick={() => date.day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), date.day))}
                  className={`relative aspect-square rounded-[1.5rem] border transition-all duration-500 group cursor-pointer 
                    ${date.day 
                      ? `${selectedDate.toDateString() === date.dateString 
                          ? 'bg-gradient-to-br from-[#8083ff] to-[#c0c1ff] border-transparent shadow-2xl shadow-[#8083ff]/30 -translate-y-2' 
                          : `${styles.surfaceLow} border-white/5 hover:border-[#c0c1ff]/40 hover:-translate-y-1`}` 
                      : 'opacity-0 pointer-events-none'}`}
                >
                  <span className={`absolute top-4 left-6 text-lg font-black tracking-tighter ${selectedDate.toDateString() === date.dateString ? 'text-[#0b1326]' : styles.textPrimary}`}>
                    {date.day}
                  </span>
                  
                  {date.health !== 'none' && (
                    <div className="absolute bottom-4 right-6 flex gap-1">
                       <div className={`w-2 h-2 rounded-full shadow-lg ${date.health === 'healthy' ? 'bg-[#4edea3]' : 'bg-[#ffb783]'} ${selectedDate.toDateString() === date.dateString ? 'ring-2 ring-white/30' : ''}`}></div>
                       {date.logs.length > 5 && <div className={`w-2 h-2 rounded-full opacity-40 ${selectedDate.toDateString() === date.dateString ? 'bg-white' : 'bg-white/30'}`}></div>}
                    </div>
                  )}

                  {/* High-Fidelity Lens Effect */}
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.5rem]"></div>
                </div>
              ))}
           </div>
        </div>

        <aside className="xl:col-span-4 space-y-8">
           <div className={`${styles.surfaceLow} p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                 <span className="material-symbols-outlined text-7xl">timeline</span>
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-8">Temporal<br/>Insight</h3>
              
              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-2 h-8 bg-[#4edea3] rounded-full"></div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Status Report</p>
                       <p className="text-sm font-bold tracking-tight">System Integrity: Nominal</p>
                    </div>
                 </div>

                 <div className={`p-6 ${styles.surfaceContainer} rounded-2xl border border-white/5 space-y-4`}>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Selected Index</p>
                    <p className="text-xl font-black">{selectedDate.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    <div className="h-px bg-white/5"></div>
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-medium opacity-60">Verified Logs</span>
                       <span className="text-lg font-black text-[#4edea3]">{attendanceLogs.filter(l => new Date(l.timestamp || l.created_at).toDateString() === selectedDate.toDateString()).length}</span>
                    </div>
                 </div>
              </div>

               <button className={`w-full mt-10 py-5 ${styles.surfaceHighest} border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95`}>
                  Generate Snapshot
               </button>
           </div>

           <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-[#8083ff]/10 to-[#c0c1ff]/5 border border-[#8083ff]/20 relative overflow-hidden">
             <div className="flex items-center gap-4 mb-4 text-[#c0c1ff]">
                <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Predictor</span>
             </div>
             <p className={`${styles.textSecondary} text-xs leading-relaxed font-light italic`}>
               "Consistency index for current cycle is peaking at 96.4%. Projected attendance density for next session remains high."
             </p>
           </div>
        </aside>
      </div>
    </div>
  );
}
