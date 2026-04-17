import React from 'react';

export default function FacultyCourses({ courses, isDarkMode, onViewRoster }) {
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
    <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-5xl font-black tracking-tight leading-[0.9]">Your<br/>Courses</h2>
          <p className={`${styles.textSecondary} text-lg font-light mt-4`}>Manage and track attendance for your assigned courses.</p>
        </div>
        <div className="flex gap-4">
            <div className={`px-6 py-4 ${styles.surfaceLow} rounded-2xl border border-white/5 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl`}>
               <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
               Active Semester: Spring 2026
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, idx) => (
          <div key={idx} className={`${styles.surfaceLow} p-10 rounded-[2.5rem] border border-white/5 hover:border-[#c0c1ff]/30 transition-all group shadow-2xl relative overflow-hidden`}>
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
               <span className="material-symbols-outlined text-5xl">inventory_2</span>
            </div>
            
            <div className="flex justify-between items-start mb-10">
              <div className={`w-14 h-14 rounded-2xl ${styles.surfaceContainer} flex items-center justify-center text-[#c0c1ff] group-hover:scale-110 transition-transform shadow-inner border border-white/5`}>
                <span className="material-symbols-outlined">school</span>
              </div>
              <p className="text-3xl font-black tracking-tighter leading-none">{course.code}</p>
            </div>
            
            <h3 className="text-xl font-black mb-10 tracking-tight leading-tight group-hover:text-[#c0c1ff] transition-colors">{course.name}</h3>
            
            <div className="space-y-6">
               <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm opacity-40">groups</span>
                  <p className={`text-[11px] ${styles.textSecondary} font-black uppercase tracking-widest`}>Department: {course.department || 'General'}</p>
               </div>
               <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm opacity-40">verified_user</span>
                  <p className={`text-[11px] ${styles.textSecondary} font-black uppercase tracking-widest`}>Verification Mode: Biometric</p>
               </div>
            </div>
            
            <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-8">
               <div className="flex items-center gap-2">
                 <span className={`w-2 h-2 rounded-full bg-green-500`}></span>
                 <span className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-60`}>Course Assigned</span>
               </div>
                <button 
                  onClick={() => onViewRoster && onViewRoster(course.id)}
                  className={`${styles.accentPrimary} text-[10px] font-black uppercase tracking-[0.2em] hover:underline underline-offset-8 transition-all`}
                >
                  View Roster
                </button>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="col-span-full py-32 text-center opacity-20 border-2 border-dashed border-white/5 rounded-[2.5rem]">
             <p className="text-sm font-black uppercase tracking-[0.4em] italic leading-relaxed text-[#c7c4d7]">No courses found for your account.</p>
          </div>
        )}
      </div>
    </div>
  );
}
