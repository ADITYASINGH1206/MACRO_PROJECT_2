import React, { useState } from 'react';

export default function ManualAttendance({ students, onMarkAttendance, isDarkMode, onBack }) {
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
    accentTertiary: 'text-[#ffb783]',
  };

  const filteredStudents = students.filter(s => 
    s.full_name.toLowerCase().includes(search.toLowerCase()) || 
    (s.email && s.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleMarkAllPresent = () => {
    filteredStudents.forEach(s => onMarkAttendance(s.id, 'present'));
  };

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
              Temporal Return
            </button>
            <h2 className="text-7xl font-black tracking-tighter leading-[0.85] font-headline">Session<br/><span className="opacity-40">Roster</span></h2>
            <p className={`${styles.textSecondary} text-lg font-light mt-6 max-w-xl`}>Authorized manual override for scholar presence logs. Metrics are synchronized in real-time to the institutional registry.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full xl:w-auto">
            <div className="relative group flex-grow sm:w-96">
              <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">search</span>
              <input 
                type="text" 
                placeholder="Query Identity Registry..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full ${styles.surfaceLow} border border-white/5 rounded-2xl py-6 pl-16 pr-8 text-sm font-bold placeholder:opacity-20 outline-none focus:border-[#c0c1ff]/40 shadow-2xl transition-all`}
              />
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
               <button 
                  onClick={handleMarkAllPresent}
                  className={`px-8 py-5 ${styles.surfaceHighest} border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#4edea3] hover:text-[#0b1326] transition-all whitespace-nowrap`}
               >
                 Mark All Present
               </button>
               <button className={`p-5 ${styles.surfaceLow} border border-white/10 rounded-2xl text-[#c0c1ff] hover:bg-white/5 transition-all shadow-xl`}>
                 <span className="material-symbols-outlined">sync</span>
               </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
          {filteredStudents.map(student => (
            <div key={student.id} className={`${styles.surfaceLow} p-8 rounded-[2.5rem] border border-white/5 hover:border-[#c0c1ff]/30 transition-all group shadow-2xl relative overflow-hidden flex flex-col justify-between`}>
              {/* Card Decoration */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-[#c0c1ff]/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              
              <div className="space-y-8 relative z-10">
                <div className="flex items-start justify-between">
                  <div className={`w-20 h-20 rounded-[1.5rem] ${styles.surfaceContainer} flex items-center justify-center font-black text-3xl text-[#c0c1ff] border border-white/5 shadow-inner`}>
                    {student.full_name[0]}
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 bg-white/5 rounded-lg border border-white/5 opacity-40">
                    ID: {student.id.slice(0, 8)}
                  </div>
                </div>

                <div>
                  <h4 className="font-black text-2xl tracking-tighter leading-tight mb-2 group-hover:text-[#c0c1ff] transition-colors">{student.full_name}</h4>
                  <p className={`text-[10px] ${styles.textSecondary} font-bold uppercase tracking-[0.2em] opacity-60`}>{student.email}</p>
                </div>

                <div className="h-px bg-white/5"></div>

                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => onMarkAttendance(student.id, 'present')}
                    className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-[#4edea3]/5 border border-[#4edea3]/10 hover:bg-[#4edea3] hover:text-[#0b1326] transition-all group/btn"
                  >
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    <span className="text-[8px] font-black uppercase tracking-widest">Present</span>
                  </button>
                  <button 
                    onClick={() => onMarkAttendance(student.id, 'absent')}
                    className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-red-500/5 border border-red-500/10 hover:bg-red-500 hover:text-white transition-all group/btn"
                  >
                    <span className="material-symbols-outlined text-lg">cancel</span>
                    <span className="text-[8px] font-black uppercase tracking-widest">Absent</span>
                  </button>
                  <button 
                    onClick={() => onMarkAttendance(student.id, 'late')}
                    className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-[#ffb783]/5 border border-[#ffb783]/10 hover:bg-[#ffb783] hover:text-[#0b1326] transition-all group/btn"
                  >
                    <span className="material-symbols-outlined text-lg">schedule</span>
                    <span className="text-[8px] font-black uppercase tracking-widest">Late</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredStudents.length === 0 && (
            <div className="col-span-full py-48 text-center flex flex-col items-center gap-8">
               <div className={`w-24 h-24 rounded-full ${styles.surfaceContainer} flex items-center justify-center opacity-20`}>
                  <span className="material-symbols-outlined text-5xl">person_search</span>
               </div>
               <p className="text-xs font-black uppercase tracking-[0.5em] opacity-20 italic">No identities match the current query string.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
