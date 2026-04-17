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
        {/* Overall Attendance Card */}
        <div className={`lg:col-span-6 ${styles.surfaceLow} p-12 rounded-[2.5rem] relative overflow-hidden group shadow-2xl`}>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#c0c1ff]/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
              <span className={`text-[10px] font-black tracking-[0.3em] uppercase opacity-70 ${styles.textPrimary}`}>Overall Attendance</span>
            </div>
            <h2 className="text-5xl font-black tracking-tighter leading-none mb-6">Attendance<br/><span className={styles.accentPrimary}>Summary</span></h2>
            <div className="mt-8">
              <p className="text-7xl font-black tracking-tighter tabular-nums">{studentData?.profile?.overall_attendance || '100.0'}%</p>
              <p className={`${styles.textSecondary} text-sm font-light mt-4 opacity-60`}>Average attendance rate across your courses.</p>
            </div>
          </div>
        </div>

        {/* Conditional Warning Card (only if rate < 75%) */}
        {studentData?.profile?.lowest_performing && parseFloat(studentData.profile.lowest_performing.attendance_rate) < 75 && (
          <div className={`lg:col-span-6 ${styles.surfaceLow} p-12 rounded-[2.5rem] relative overflow-hidden group shadow-2xl border-2 border-[#ffb783]/20`}>
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#ffb783]/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#ffb783]/10 border border-[#ffb783]/20 mb-8">
                <span className="w-2 h-2 rounded-full bg-[#ffb783] animate-pulse"></span>
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-[#ffb783]">Low Attendance Warning</span>
              </div>
              <h2 className="text-5xl font-black tracking-tighter leading-none mb-6">Lowest<br/><span className="text-[#ffb783]">Performing</span></h2>
              <div className="mt-8">
                <p className="text-7xl font-black tracking-tighter tabular-nums text-[#ffb783]">{studentData.profile.lowest_performing.attendance_rate}%</p>
                <div className="mt-4">
                  <p className="text-sm font-black opacity-80">{studentData.profile.lowest_performing.name}</p>
                  <p className={`${styles.textSecondary} text-xs font-light opacity-50`}>Attendance in this course is below the 75% threshold.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Modules Feed */}
      <section className="space-y-10">
        <div className="flex items-end justify-between border-b border-white/5 pb-6">
          <h2 className="text-3xl font-black tracking-tight">Courses <span className={`text-lg font-black ${styles.textSecondary} opacity-30 ml-3`}>0{courses.length}</span></h2>
          <button className={`${styles.accentPrimary} text-[11px] font-black uppercase tracking-[0.2em] hover:underline underline-offset-8`}>View All</button>
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
                <p className="text-xs font-black tracking-widest leading-none opacity-40 uppercase">{course.attendance_rate}% Rate</p>
              </div>
              <h3 className="text-xl font-black mb-8 tracking-tight line-clamp-1 group-hover:text-[#c0c1ff] transition-colors">{course.name}</h3>
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></div>
                 <p className={`text-[11px] ${styles.textSecondary} font-black uppercase tracking-widest`}>{course.faculty_name || 'Faculty Member'}</p>
              </div>
              <p className="text-[10px] font-black opacity-20 uppercase tracking-[0.3em] mt-6">{course.code}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-10">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black tracking-tight">Recent Attendance Logs</h2>
          <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${styles.textSecondary} opacity-40`}>History</span>
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
                    <p className="text-lg font-black tracking-tight group-hover:text-[#c0c1ff] transition-colors">{item.courses?.name || 'Attendance Session'}</p>
                    <p className={`text-[11px] ${styles.textSecondary} font-bold uppercase tracking-widest mt-1 opacity-70`}>{item.courses?.code || 'Universal'} • {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
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
               <p className={`text-sm font-black uppercase tracking-[0.3em] ${styles.textSecondary} opacity-20`}>No attendance records found</p>
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
