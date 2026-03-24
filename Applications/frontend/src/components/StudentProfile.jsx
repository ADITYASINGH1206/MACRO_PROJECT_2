import React from 'react';

export default function StudentProfile({ user, records, isDarkMode }) {
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
    <div className="max-w-[1000px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="text-center space-y-8">
        <div className="relative inline-block group">
           <div className="absolute inset-0 bg-gradient-to-br from-[#8083ff] to-[#4edea3] rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
           <div className={`relative w-40 h-40 rounded-[3rem] ${styles.surfaceLow} border-4 border-white/5 overflow-hidden shadow-2xl`}>
             <img 
               className="w-full h-full object-cover" 
               src={user?.avatar_url || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=300"} 
               alt={user?.full_name} 
             />
           </div>
           <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#4edea3] rounded-2xl flex items-center justify-center text-[#0b1326] shadow-xl border-4 border-[#0b1326]">
              <span className="material-symbols-outlined text-xl">verified</span>
           </div>
        </div>
        
        <div>
          <h2 className="text-5xl font-black tracking-tight mb-3">{user?.full_name}</h2>
          <p className={`${styles.textSecondary} text-lg font-black uppercase tracking-[0.3em] opacity-40`}>Scholarly Identity: {user?.id?.slice(0, 8)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className={`${styles.surfaceLow} p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8 relative overflow-hidden group`}>
           <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-5xl">badge</span>
           </div>
           <h3 className="text-2xl font-black tracking-tight">Identity Parameters</h3>
           <div className="space-y-6">
              {[
                { label: 'Full Designation', value: user?.full_name },
                { label: 'Network Address', value: user?.email },
                { label: 'Institutional Role', value: 'Authorized Scholar' },
                { label: 'Account Created', value: new Date(user?.created_at).toLocaleDateString() }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                   <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${styles.textSecondary} opacity-40`}>{item.label}</p>
                   <p className="font-black text-lg tracking-tight">{item.value}</p>
                </div>
              ))}
           </div>
        </section>

        <section className={`${styles.surfaceLow} p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8 relative overflow-hidden group`}>
           <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-5xl">monitoring</span>
           </div>
           <h3 className="text-2xl font-black tracking-tight">Performance Metrics</h3>
           <div className="space-y-8">
              <div className="flex items-center justify-between">
                 <div className="space-y-1">
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${styles.textSecondary} opacity-40`}>Index Ratio</p>
                    <p className="text-4xl font-black tracking-tighter">{records?.attendance_percentage || 0}%</p>
                 </div>
                 <div className={`w-16 h-16 rounded-2xl ${styles.surfaceContainer} flex items-center justify-center border border-white/5 text-[#4edea3]`}>
                    <span className="material-symbols-outlined text-3xl">insights</span>
                 </div>
              </div>
              
              <div className="flex items-center justify-between">
                 <div className="space-y-1">
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${styles.textSecondary} opacity-40`}>Current Velocity</p>
                    <p className="text-4xl font-black tracking-tighter">{records?.gpa || '0.00'} GPA</p>
                 </div>
                 <div className={`w-16 h-16 rounded-2xl ${styles.surfaceContainer} flex items-center justify-center border border-white/5 text-[#c0c1ff]`}>
                    <span className="material-symbols-outlined text-3xl">bolt</span>
                 </div>
              </div>

              <button className={`w-full py-5 ${styles.surfaceHighest} rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/5 transition-all`}>
                 Export Academic Transcript
              </button>
           </div>
        </section>
      </div>

      <div className={`${styles.surfaceLow} p-12 rounded-[2.5rem] border border-white/5 italic text-center opacity-40`}>
         <p className="text-sm font-black uppercase tracking-[0.4em] leading-relaxed">System-generated summary: This identity is in good standing with the institutional registry based on recent temporal indexing.</p>
      </div>
    </div>
  );
}
