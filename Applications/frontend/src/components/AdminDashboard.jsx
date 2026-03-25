import React, { useState } from 'react';

export default function AdminDashboard({ user, onLogout, isDarkMode, toggleTheme }) {
  const [activeTab, setActiveTab] = useState('overview');

  const styles = {
    surface: isDarkMode ? 'bg-[#0b1326]' : 'bg-[#f8f9fc]',
    surfaceLow: isDarkMode ? 'bg-[#131b2e]' : 'bg-[#ffffff]',
    surfaceContainer: isDarkMode ? 'bg-[#171f33]' : 'bg-[#f1f3f9]',
    textPrimary: isDarkMode ? 'text-[#dae2fd]' : 'text-[#1e293b]',
    textSecondary: isDarkMode ? 'text-[#c7c4d7]' : 'text-[#64748b]',
    accentPrimary: 'text-[#c0c1ff]',
    accentSecondary: 'text-[#4edea3]',
    accentTertiary: 'text-[#ffb783]',
  };

  return (
    <div className={`${styles.surface} ${styles.textPrimary} font-inter min-h-screen transition-colors duration-500`}>
      {/* Admin Editorial Header */}
      <header className="fixed top-0 w-full z-50 bg-opacity-80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8083ff] to-[#c0c1ff] flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-white text-2xl">admin_panel_settings</span>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-lg font-black tracking-tighter uppercase leading-none">Scholar <span className={styles.accentPrimary}>Admin</span></h1>
            <p className={`text-[10px] ${styles.textSecondary} font-bold tracking-widest mt-1 uppercase`}>Provost Management Suite</p>
          </div>
        </div>

        <nav className="flex items-center gap-8">
          {['overview', 'faculties', 'courses', 'system'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[11px] font-black uppercase tracking-[0.2em] relative py-1 ${activeTab === tab ? styles.accentPrimary : styles.textSecondary}`}
            >
              {tab}
              {activeTab === tab && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#8083ff] to-[#c0c1ff] rounded-full"></span>}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5">
            <span className="material-symbols-outlined text-lg">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <div className="hidden sm:block text-right">
            <p className="text-xs font-black">{user?.full_name}</p>
            <p className="text-[9px] text-[#4edea3] font-bold uppercase tracking-widest">Administrator</p>
          </div>
          <button onClick={onLogout} className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-400">
            <span className="material-symbols-outlined text-lg">logout</span>
          </button>
        </div>
      </header>

      <main className="pt-32 pb-24 px-8 max-w-[1600px] mx-auto space-y-12">
        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-12">
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className={`${styles.surfaceLow} p-10 rounded-[2rem] border border-white/5 shadow-2xl space-y-6 relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#8083ff]/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-[#8083ff]/10"></div>
                <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${styles.textSecondary}`}>Institutional Reach</h3>
                <div className="flex items-end gap-3">
                  <p className="text-6xl font-black tracking-tighter italic">24</p>
                  <p className={`text-sm ${styles.textSecondary} mb-2`}>Active Courses</p>
                </div>
              </div>
              
              <div className={`${styles.surfaceLow} p-10 rounded-[2rem] border border-white/5 shadow-2xl space-y-6 relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#4edea3]/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-[#4edea3]/10"></div>
                <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${styles.textSecondary}`}>Instructional Force</h3>
                <div className="flex items-end gap-3">
                  <p className={`text-6xl font-black tracking-tighter italic ${styles.accentSecondary}`}>12</p>
                  <p className={`text-sm ${styles.textSecondary} mb-2`}>Senior Faculty</p>
                </div>
              </div>

              <div className={`${styles.surfaceLow} p-10 rounded-[2rem] border border-white/5 shadow-2xl flex flex-col justify-between group`}>
                <div>
                   <h3 className="text-xl font-black tracking-tight leading-none mb-3">System<br/>Commands</h3>
                   <p className={`${styles.textSecondary} text-xs leading-relaxed`}>Deploy global registries and manage institutional hierarchies.</p>
                </div>
                <div className="mt-8 flex gap-3">
                   <button className="flex-1 py-4 bg-[#8083ff] text-white text-[10px] font-black uppercase tracking-[0.1em] rounded-xl">Register Faculty</button>
                   <button className="flex-1 py-4 bg-white/5 text-on-surface text-[10px] font-black uppercase tracking-[0.1em] rounded-xl border border-white/5">New Course</button>
                </div>
              </div>
            </section>

            {/* Registry Insights */}
            <section className={`${styles.surfaceLow} rounded-[2.5rem] p-12 border border-white/5 shadow-2xl relative overflow-hidden`}>
                <div className="flex items-center justify-between mb-12">
                   <div>
                      <h2 className="text-3xl font-black tracking-tight leading-none mb-2">Registry Overview</h2>
                      <p className={`${styles.textSecondary} text-sm`}>Global inventory of scholarly operations.</p>
                   </div>
                   <button className={`${styles.accentPrimary} text-[10px] font-black uppercase tracking-[0.2em] border-b-2 border-[#8083ff]/30 pb-1`}>Audit Logs</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {['Computer Science', 'Quantum Ethics', 'Editorial Logic'].map(c => (
                     <div key={c} className={`${styles.surfaceContainer} p-8 rounded-[2rem] border border-white/5 hover:border-[#c0c1ff]/30 transition-all group cursor-pointer`}>
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                           <span className="material-symbols-outlined text-white opacity-40">school</span>
                        </div>
                        <h4 className="text-xl font-black tracking-tight mb-2 group-hover:text-[#c0c1ff]">{c}</h4>
                        <div className="flex items-center justify-between mt-6">
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Faculty Assigned</span>
                           <span className={`px-3 py-1 bg-[#4edea3]/10 text-[#4edea3] rounded-full text-[9px] font-black tracking-widest`}>ACTIVE</span>
                        </div>
                     </div>
                   ))}
                </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
