import React, { useState, useMemo } from 'react';

export default function StudentRoster({ students, attendanceLogs = [], isDarkMode, onBack }) {
  const [search, setSearch] = useState('');

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

  const scholarAnalytics = useMemo(() => {
    return students.map(student => {
      const logs = attendanceLogs.filter(l => l.student_id === student.id);
      const total = logs.length;
      const presentCount = logs.filter(l => l.status === 'present').length;
      const lateCount = logs.filter(l => l.status === 'late').length;
      const rate = total > 0 ? ((presentCount + (lateCount * 0.5)) / total * 100).toFixed(1) : "100.0";
      return { ...student, rate, totalLogs: total };
    });
  }, [students, attendanceLogs]);

  const filteredScholars = scholarAnalytics.filter(s => 
    s.full_name.toLowerCase().includes(search.toLowerCase()) || 
    (s.email && s.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className={`min-h-screen ${styles.surface} ${styles.textPrimary} p-8 lg:p-12 animate-in fade-in duration-700`}>
      <div className="max-w-[1400px] mx-auto space-y-12">
        <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 border-b border-white/5 pb-12">
          <div>
            <button 
              onClick={onBack} 
              className={`text-[10px] font-black uppercase tracking-[0.4em] ${styles.accentPrimary} mb-6 flex items-center gap-3 hover:translate-x-[-8px] transition-all group`}
            >
              <span className="material-symbols-outlined text-sm group-hover:scale-125 transition-transform">arrow_back</span>
              Core Navigation
            </button>
            <h2 className="text-7xl font-black tracking-tighter leading-[0.85] font-headline">Registry<br/><span className="opacity-40">Inventory</span></h2>
            <p className={`${styles.textSecondary} text-lg font-light mt-6 max-w-xl`}>The authoritative catalog of institutional scholarly identities. Real-time parity across all node distributions.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full xl:w-auto">
            <div className={`px-10 py-6 ${styles.surfaceLow} border border-white/5 rounded-[2rem] flex items-center gap-8 shadow-2xl`}>
               <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Total Scholars</p>
                  <p className="text-3xl font-black tabular-nums">{students.length}</p>
               </div>
               <div className="w-px h-10 bg-white/5"></div>
               <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Global Health</p>
                  <p className="text-3xl font-black tabular-nums text-[#4edea3]">98.2%</p>
               </div>
            </div>

            <div className="relative group flex-grow sm:w-96">
              <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">search</span>
              <input 
                type="text" 
                placeholder="Query Registry..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full ${styles.surfaceLow} border border-white/5 rounded-2xl py-6 pl-16 pr-8 text-sm font-bold placeholder:opacity-20 outline-none focus:border-[#c0c1ff]/40 shadow-2xl transition-all`}
              />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {filteredScholars.map(scholar => (
            <div key={scholar.id} className={`${styles.surfaceLow} p-10 rounded-[2.5rem] border border-white/5 hover:border-[#c0c1ff]/30 transition-all group shadow-2xl relative overflow-hidden flex flex-col justify-between`}>
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                 <span className="material-symbols-outlined text-4xl">verified</span>
              </div>
              
              <div className="space-y-8 relative z-10 text-center">
                <div className="relative mx-auto w-32 h-32">
                   <div className={`absolute inset-0 bg-[#c0c1ff] rounded-full blur-2xl opacity-10 group-hover:opacity-30 transition-opacity`}></div>
                   <div className={`relative w-full h-full rounded-full ${styles.surfaceContainer} flex items-center justify-center font-black text-5xl text-[#c0c1ff] border-4 border-white/5 shadow-2xl`}>
                      {scholar.full_name[0]}
                   </div>
                   <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#4edea3] rounded-full border-4 border-[#131b2e] flex items-center justify-center shadow-lg">
                      <span className="material-symbols-outlined text-xs text-[#0b1326] font-black italic">check</span>
                   </div>
                </div>

                <div>
                  <h4 className="font-black text-2xl tracking-tighter leading-tight mb-2 group-hover:text-[#c0c1ff] transition-colors">{scholar.full_name}</h4>
                  <div className="flex items-center justify-center gap-2">
                     <span className="px-3 py-1 bg-[#c0c1ff]/10 text-[#c0c1ff] text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-[#c0c1ff]/20">Scholar</span>
                     <span className="px-3 py-1 bg-white/5 text-white/40 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-white/10 uppercase italic">L-404</span>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 space-y-4">
                  <div className="flex justify-between items-end">
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Presence Rate</span>
                     <span className={`text-sm font-black tabular-nums ${parseFloat(scholar.rate) > 85 ? 'text-[#4edea3]' : 'text-[#ffb783]'}`}>
                        {scholar.rate}%
                     </span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden shadow-inner">
                     <div 
                        className={`h-full transition-all duration-1000 ${parseFloat(scholar.rate) > 85 ? 'bg-[#4edea3]' : 'bg-[#ffb783]'}`} 
                        style={{ width: `${scholar.rate}%` }}
                     ></div>
                  </div>
                </div>

                <button className={`w-full py-4 ${styles.surfaceHighest} border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all active:scale-95 shadow-xl`}>
                   View Detailed Profile
                </button>
              </div>
            </div>
          ))}

          {filteredScholars.length === 0 && (
            <div className="col-span-full py-48 text-center flex flex-col items-center gap-8">
               <div className={`w-24 h-24 rounded-full ${styles.surfaceContainer} flex items-center justify-center opacity-20`}>
                  <span className="material-symbols-outlined text-5xl">manage_accounts</span>
               </div>
               <p className="text-xs font-black uppercase tracking-[0.5em] opacity-20 italic">Registry query returned zero scholar identities.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
