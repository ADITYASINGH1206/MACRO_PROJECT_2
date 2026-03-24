import React from 'react';

const BentoDashboard = ({ user, studentData, isDarkMode }) => {
  const records = studentData?.profile?.academic_records?.[0];
  const courses = studentData?.courses || [];
  const history = studentData?.history || [];

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
    <div className={`max-w-[1400px] mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000`}>
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className={`lg:col-span-8 ${styles.surfaceLow} p-12 rounded-[2.5rem] relative overflow-hidden group shadow-2xl transition-all hover:shadow-[#c0c1ff]/5`}>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c0c1ff]/5 rounded-full blur-[120px] -mr-48 -mt-48 transition-all group-hover:bg-[#c0c1ff]/10"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
                <span className={`text-[10px] font-black tracking-[0.3em] uppercase opacity-70 ${styles.textPrimary}`}>Identity Integrity: Active</span>
              </div>
              <h2 className="text-6xl font-black tracking-[-0.05em] leading-[0.9] mb-6">Scholarly<br/><span className={styles.accentPrimary}>Presence</span></h2>
              <p className={`${styles.textSecondary} text-lg font-light max-w-sm leading-relaxed`}>Your real-time institutional footprint and academic velocity metrics.</p>
              
              <div className="mt-12 flex items-center gap-12 justify-center md:justify-start">
                <div>
                  <p className={`text-[10px] font-black ${styles.textSecondary} uppercase tracking-[0.2em] mb-2`}>Aggregate Attendance</p>
                  <p className="text-5xl font-black tracking-tighter">{records?.attendance_percentage || 0}%</p>
                </div>
                <div className="h-12 w-px bg-white/10"></div>
                <div>
                  <p className={`text-[10px] font-black ${styles.textSecondary} uppercase tracking-[0.2em] mb-2`}>Scholarly GPA</p>
                  <p className={`text-5xl font-black tracking-tighter ${styles.accentSecondary}`}>{records?.gpa || '0.00'}</p>
                </div>
              </div>
            </div>
            
            <div className="relative shrink-0 w-56 h-56 lg:w-64 lg:h-64">
               <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle className="text-white/5 stroke-current" cx="50" cy="50" fill="transparent" r="44" strokeWidth="6"></circle>
                  <circle 
                    className="text-[#c0c1ff] stroke-current drop-shadow-[0_0_8px_rgba(192,193,255,0.4)]" 
                    cx="50" 
                    cy="50" 
                    fill="transparent" 
                    r="44" 
                    strokeDasharray="276.46" 
                    strokeDashoffset={276.46 - (276.46 * (records?.attendance_percentage || 0)) / 100} 
                    strokeLinecap="round" 
                    strokeWidth="6"
                    style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  ></circle>
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black tracking-tighter leading-none">{records?.attendance_percentage || 0}</span>
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${styles.textSecondary} mt-2`}>Index</span>
               </div>
            </div>
          </div>
        </div>
        
        <div className={`lg:col-span-4 ${styles.surfaceLow} p-12 rounded-[2.5rem] flex flex-col justify-between border border-white/5 shadow-2xl relative group overflow-hidden`}>
           <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
              <span className={`material-symbols-outlined text-7xl ${styles.accentSecondary}`}>shield</span>
           </div>
           <div>
            <div className={`w-16 h-16 rounded-2xl ${styles.surfaceContainer} flex items-center justify-center mb-10 border border-white/5`}>
              <span className={`material-symbols-outlined text-3xl ${styles.accentSecondary}`}>verified_user</span>
            </div>
            <h3 className="text-2xl font-black tracking-tight leading-tight mb-4">Academic<br/>Credentialing</h3>
            <p className={`${styles.textSecondary} text-sm font-medium leading-relaxed`}>Tier identification based on verified scholarly achievement data.</p>
          </div>
          <div className="mt-12">
            <div className="flex items-end justify-between mb-4">
              <p className="text-3xl font-black tracking-tight">{records?.gpa >= 3.8 ? 'Obsidian' : 'Platinum'} Tier</p>
              <p className={`text-[10px] font-black ${styles.accentSecondary} uppercase tracking-[0.2em]`}>98th Percentile</p>
            </div>
            <div className={`w-full ${styles.surfaceContainer} h-2 rounded-full overflow-hidden`}>
              <div className="bg-gradient-to-r from-[#8083ff] to-[#4edea3] h-full transition-all duration-1000" style={{ width: `${(records?.gpa / 4) * 100}%` }}></div>
            </div>
            <p className={`text-[10px] ${styles.textSecondary} mt-4 uppercase tracking-[0.2em] font-black opacity-40`}>Velocity toward next evolution</p>
          </div>
        </div>
      </section>

      {/* Modules Feed */}
      <section className="space-y-10">
        <div className="flex items-end justify-between border-b border-white/5 pb-6">
          <h2 className="text-3xl font-black tracking-tight">Curriculum Modules <span className={`text-lg font-black ${styles.textSecondary} opacity-30 ml-3`}>0{courses.length}</span></h2>
          <button className={`${styles.accentPrimary} text-[11px] font-black uppercase tracking-[0.2em] hover:underline underline-offset-8`}>Full Registry</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {courses.map((course, idx) => (
            <div key={idx} className={`${styles.surfaceLow} border border-white/5 hover:border-[#c0c1ff]/30 transition-all p-10 rounded-[2.5rem] group cursor-pointer relative overflow-hidden shadow-2xl`}>
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                 <span className="material-symbols-outlined text-5xl">history_edu</span>
              </div>
              <div className="flex justify-between items-start mb-10">
                <div className={`w-14 h-14 rounded-2xl ${styles.surfaceContainer} flex items-center justify-center text-[#c0c1ff] group-hover:scale-110 transition-transform shadow-inner border border-white/5`}>
                  <span className="material-symbols-outlined">api</span>
                </div>
                <p className="text-3xl font-black tracking-tighter leading-none">{course.code}</p>
              </div>
              <h3 className="text-xl font-black mb-8 tracking-tight line-clamp-1 group-hover:text-[#c0c1ff] transition-colors">{course.name}</h3>
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></div>
                 <p className={`text-[11px] ${styles.textSecondary} font-black uppercase tracking-widest`}>{course.faculty_name || 'Department Faculty'}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Activity Index */}
      <section className="space-y-10">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black tracking-tight">Temporal Activity Index</h2>
          <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${styles.textSecondary} opacity-40`}>Session Pulse</span>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {history.length > 0 ? history.map((item, idx) => {
            const dateObj = new Date(item.timestamp);
            return (
              <div key={idx} className={`${styles.surfaceLow} p-6 rounded-[2rem] border border-white/5 group hover:border-[#c0c1ff]/20 transition-all shadow-xl flex items-center justify-between`}>
                <div className="flex items-center gap-8">
                  <div className="flex flex-col items-center justify-center min-w-[60px] border-r border-white/5 pr-8">
                    <p className={`text-[10px] font-black ${styles.textSecondary} uppercase tracking-tighter opacity-60 mb-1`}>
                      {dateObj.toLocaleString('default', { month: 'short' }).toUpperCase()}
                    </p>
                    <p className="text-2xl font-black leading-none tracking-tighter">{dateObj.getDate()}</p>
                  </div>
                  <div>
                    <p className="text-lg font-black tracking-tight group-hover:text-[#c0c1ff] transition-colors">Campus Authentication</p>
                    <p className={`text-[11px] ${styles.textSecondary} font-bold uppercase tracking-widest mt-1 opacity-70`}>Biometric Verification • {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <div className={`px-8 py-3 rounded-full border ${item.status === 'present' ? 'bg-[#4edea3]/5 border-[#4edea3]/20 text-[#4edea3]' : 'bg-red-500/5 border-red-500/20 text-red-400'}`}>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.status}</span>
                </div>
              </div>
            );
          }) : (
            <div className={`${styles.surfaceLow} p-24 rounded-[2.5rem] border-2 border-dashed border-white/5 text-center`}>
               <span className="material-symbols-outlined text-6xl opacity-20 mb-6 italic">data_table</span>
               <p className={`text-sm font-black uppercase tracking-[0.3em] ${styles.textSecondary} opacity-20`}>No Temporal Data Recorded</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default function StudentHome({ user, studentData, isDarkMode }) {
  return <BentoDashboard user={user} studentData={studentData} isDarkMode={isDarkMode} />;
}
