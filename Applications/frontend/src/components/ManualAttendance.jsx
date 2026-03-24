import React, { useState } from 'react';

export default function ManualAttendance({ students, onMarkAttendance, isDarkMode, onBack }) {
  const [search, setSearch] = useState('');

  const styles = {
    surface: isDarkMode ? 'bg-[#0b1326]' : 'bg-[#f8f9fc]',
    surfaceLow: isDarkMode ? 'bg-[#131b2e]' : 'bg-[#ffffff]',
    surfaceContainer: isDarkMode ? 'bg-[#171f33]' : 'bg-[#f1f3f9]',
    textPrimary: isDarkMode ? 'text-[#dae2fd]' : 'text-[#1e293b]',
    textSecondary: isDarkMode ? 'text-[#c7c4d7]' : 'text-[#64748b]',
    accentPrimary: 'text-[#c0c1ff]',
    accentSecondary: 'text-[#4edea3]',
  };

  const filteredStudents = students.filter(s => 
    s.full_name.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${styles.surface} ${styles.textPrimary} p-8 animate-in fade-in duration-700`}>
      <div className="max-w-[1200px] mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-8">
          <div>
            <button onClick={onBack} className={`text-[10px] font-black uppercase tracking-[0.3em] ${styles.accentPrimary} mb-4 flex items-center gap-2 hover:translate-x-[-4px] transition-transform`}>
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Return to Core
            </button>
            <h2 className="text-5xl font-black tracking-tight leading-[0.9]">Override<br/>Presence</h2>
            <p className={`${styles.textSecondary} text-lg font-light mt-4`}>Authorized manual manual indexing for institutional scholars.</p>
          </div>
          
          <div className="relative group w-full md:w-96">
            <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">search</span>
            <input 
              type="text" 
              placeholder="Search Identity Registry..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full ${styles.surfaceLow} border border-white/5 rounded-2xl py-5 pl-16 pr-8 text-sm font-bold placeholder:opacity-30 outline-none focus:border-[#c0c1ff]/40 shadow-xl transition-all`}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map(student => (
            <div key={student.id} className={`${styles.surfaceLow} p-8 rounded-[2.5rem] border border-white/5 hover:border-[#c0c1ff]/20 transition-all group shadow-2xl relative overflow-hidden`}>
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                 <span className="material-symbols-outlined text-4xl">fingerprint</span>
              </div>
              
              <div className="flex items-center gap-6 mb-10">
                <div className={`w-16 h-16 rounded-2xl ${styles.surfaceContainer} flex items-center justify-center font-black text-2xl text-[#c0c1ff] border border-white/5`}>
                  {student.full_name[0]}
                </div>
                <div>
                  <h4 className="font-black text-xl tracking-tight leading-none mb-1.5">{student.full_name}</h4>
                  <p className={`text-[10px] ${styles.textSecondary} font-bold uppercase tracking-widest`}>{student.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => onMarkAttendance(student.id, 'present')}
                  className="py-4 bg-[#4edea3]/10 text-[#4edea3] font-black text-[10px] uppercase tracking-[0.2em] rounded-xl border border-[#4edea3]/20 hover:bg-[#4edea3] hover:text-[#0b1326] transition-all"
                >
                  Verify Present
                </button>
                <button 
                  onClick={() => onMarkAttendance(student.id, 'absent')}
                  className="py-4 bg-red-500/10 text-red-400 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                >
                  Index Absent
                </button>
              </div>
            </div>
          ))}
          {filteredStudents.length === 0 && (
            <div className="col-span-full py-48 text-center opacity-30 italic font-black uppercase tracking-[0.4em]">
               No identities found in current registry query.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
