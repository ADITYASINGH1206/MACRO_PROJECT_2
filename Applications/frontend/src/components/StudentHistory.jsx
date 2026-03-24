import React from 'react';

const BentoHistory = ({ onLogout, toggleTheme, isDarkMode, setCurrentTab, history, stats }) => (
  <div className="bg-[#0A0A0B] text-slate-200 min-h-screen pb-24 font-manrope">
    {/* TopAppBar */}
    <header className="fixed top-0 w-full z-50 bg-[#0A0A0B]/80 backdrop-blur-xl flex justify-between items-center px-6 py-4 max-w-none border-b border-white/5">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-white/5 cursor-pointer border border-white/10 hover:border-white/30 transition-all" onClick={onLogout} title="Click to Logout">
          <img alt="User Profile" className="w-full h-full object-cover opacity-80" src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=150"/>
        </div>
        <h1 className="font-manrope tracking-tight font-bold text-xl text-white">
          <span className="font-manrope font-extrabold tracking-tighter text-indigo-400">Scholar Slate Pro</span>
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-slate-400">
          <span className="material-symbols-outlined text-sm">search</span>
        </button>
        <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-slate-400" aria-label="Toggle Theme">
          <span className="material-symbols-outlined text-sm">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
        </button>
        <button className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-slate-400">
          <span className="material-symbols-outlined text-sm">notifications</span>
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
        </button>
      </div>
    </header>

    <main className="pt-24 px-6 max-w-5xl mx-auto">
      <section className="mb-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-indigo-400 font-bold tracking-[0.2em] text-[10px] uppercase mb-1">Academic Integrity</p>
            <h2 className="text-4xl font-extrabold tracking-tighter text-white">Attendance <span className="text-slate-500">History</span></h2>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-3xl font-bold text-white tracking-tighter">{stats?.attendance_percentage || '0.0'}%</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Standard Avg</p>
          </div>
        </div>

        {/* Status Bento Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-4">Present</p>
            <p className="text-3xl font-extrabold text-white">{stats?.total_present || 0}</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-4">Late</p>
            <p className="text-3xl font-extrabold text-amber-500">{stats?.total_late || 0}</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-4">Absent</p>
            <p className="text-3xl font-extrabold text-rose-500">{stats?.total_absent || 0}</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-4">Courses</p>
            <p className="text-3xl font-extrabold text-indigo-400">{stats?.total_courses || 0}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button className="bg-indigo-500 text-white px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap">All Logs</button>
          <button className="bg-white/5 text-slate-400 px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap hover:bg-white/10 transition-all">Present</button>
          <button className="bg-white/5 text-slate-400 px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap hover:bg-white/10 transition-all">Absences</button>
          <button className="bg-white/5 text-slate-400 px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap hover:bg-white/10 transition-all">This Month</button>
        </div>

        {/* History List */}
        <div className="space-y-3">
          {history.length > 0 ? history.map((item, idx) => (
            <div key={idx} className="bg-white/[0.03] hover:bg-white/[0.05] p-5 rounded-2xl border border-white/5 transition-all group flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className={`material-symbols-outlined ${item.status === 'Present' ? 'text-indigo-400' : item.status === 'Late' ? 'text-amber-500' : 'text-rose-500'}`}>
                    {idx % 2 === 0 ? 'menu_book' : 'history_edu'}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm tracking-tight">{item.course_name}</h4>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">
                    {item.instructor_name} • {item.date}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-[10px] font-bold uppercase tracking-widest ${item.status === 'Present' ? 'text-indigo-400' : item.status === 'Late' ? 'text-amber-500' : 'text-rose-500'}`}>
                  {item.status}
                </p>
                <p className="text-[10px] text-slate-500 font-bold mt-1">{item.time}</p>
              </div>
            </div>
          )) : (
            <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/5">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">No Attendance Records Found</p>
            </div>
          )}
        </div>
      </section>

      <div className="mt-12 flex justify-center">
        <button className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-bold text-[10px] uppercase tracking-[0.2em] px-8 py-4 bg-white/5 rounded-full border border-white/5">
          View Archive Records
          <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
        </button>
      </div>
    </main>

    {/* Bottom Bar */}
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center pt-3 pb-8 px-6 bg-[#0A0A0B]/90 backdrop-blur-xl border-t border-white/5 shadow-2xl">
      <TabItem icon="home_max" label="Home" active={false} onClick={() => setCurrentTab('home')} />
      <TabItem icon="history_edu" label="History" active={true} onClick={() => setCurrentTab('history')} />
      <TabItem icon="menu_book" label="Courses" active={false} onClick={() => setCurrentTab('courses')} />
      <TabItem icon="person_2" label="Profile" active={false} onClick={() => setCurrentTab('profile')} />
    </nav>
  </div>
);

const EditorialHistory = ({ onLogout, toggleTheme, isDarkMode, setCurrentTab, history, stats }) => (
  <div className="bg-[#FAF9F6] text-[#1a1a1a] min-h-screen pb-24 font-body selection:bg-[#E5E2D9]">
    {/* Minimal Nav */}
    <header className="fixed top-0 w-full z-50 bg-[#FAF9F6]/80 backdrop-blur-md flex justify-between items-center px-8 py-6 border-b border-[#E5E2D9]">
      <div className="flex items-center gap-6">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-[#E5E2D9] cursor-pointer" onClick={onLogout}>
          <img alt="User" className="w-full h-full object-cover grayscale opacity-80" src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=150"/>
        </div>
        <h1 className="font-headline text-xl tracking-tight italic font-medium">Scholar Slate</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-[#1a1a1a] opacity-40 hover:opacity-100 transition-opacity">
          <span className="material-symbols-outlined text-[20px]">search</span>
        </button>
        <button onClick={toggleTheme} className="text-[#1a1a1a] opacity-40 hover:opacity-100 transition-opacity">
          <span className="material-symbols-outlined text-[20px]">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
        </button>
        <button className="text-[#1a1a1a] opacity-40 hover:opacity-100 transition-opacity relative">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#8B0000] rounded-full"></span>
        </button>
      </div>
    </header>

    <main className="pt-32 px-8 max-w-4xl mx-auto">
      <header className="mb-20 text-center">
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[#8C8980] mb-4">Volume IV • Issue II</p>
        <h2 className="font-headline text-6xl md:text-7xl font-serif italic mb-6">Chronicles of Attendance</h2>
        <div className="flex items-center justify-center gap-4">
          <span className="h-[1px] w-12 bg-[#E5E2D9]"></span>
          <span className="font-medium text-[#1a1a1a] tracking-tight">Academic Year 2023-2024</span>
          <span className="h-[1px] w-12 bg-[#E5E2D9]"></span>
        </div>
      </header>

      {/* Summary Table Style */}
      <section className="mb-20 border-y border-[#E5E2D9] py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center md:text-left border-r border-[#E5E2D9]/50">
            <p className="font-label text-[10px] uppercase tracking-widest text-[#8C8980] mb-2">Aggregate</p>
            <p className="font-headline text-4xl italic">{stats?.attendance_percentage || '0.0'}%</p>
          </div>
          <div className="text-center md:text-left border-r border-[#E5E2D9]/50">
            <p className="font-label text-[10px] uppercase tracking-widest text-[#8C8980] mb-2">Lectures</p>
            <p className="font-headline text-4xl italic">{stats?.total_present || 0}</p>
          </div>
          <div className="text-center md:text-left border-r border-[#E5E2D9]/50">
            <p className="font-label text-[10px] uppercase tracking-widest text-[#8C8980] mb-2">Tardiness</p>
            <p className="font-headline text-4xl italic">{String(stats?.total_late || 0).padStart(2, '0')}</p>
          </div>
          <div className="text-center md:text-left">
            <p className="font-label text-[10px] uppercase tracking-widest text-[#8C8980] mb-2">Absences</p>
            <p className="font-headline text-4xl italic">{String(stats?.total_absent || 0).padStart(2, '0')}</p>
          </div>
        </div>
      </section>

      {/* List Style - Editorial */}
      <section className="space-y-16 mb-24">
        {history.length > 0 ? history.map((item, idx) => (
          <article key={idx} className="group">
            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-4">
              <h3 className="font-headline text-3xl hover:italic cursor-default transition-all duration-300">{item.course_name}</h3>
              <span className="font-label text-[11px] uppercase tracking-widest text-[#8C8980] mt-2 md:mt-0">{item.date} • {item.time}</span>
            </div>
            <p className="text-[#4A4941] leading-relaxed max-w-2xl mb-4 italic">
              Academic engagement session covering core curriculum modules and practical laboratory observations.
            </p>
            <div className="flex items-center gap-4">
              <span className={`px-4 py-1.5 border border-[#E5E2D9] rounded-full font-label text-[9px] uppercase tracking-widest ${item.status === 'Present' ? 'text-[#2E7D32]' : 'text-[#8B0000]'}`}>
                {item.status}
              </span>
              <span className="text-[#8C8980] font-label text-[9px] uppercase tracking-widest">— Lecture by {item.instructor_name}</span>
            </div>
          </article>
        )) : (
          <div className="text-center py-24 italic border border-dashed border-[#E5E2D9] rounded-lg">
            <p className="font-headline text-xl text-[#8C8980]">The chronicles remain silent for this period.</p>
          </div>
        )}
      </section>

      <div className="text-center border-t border-[#E5E2D9] pt-12">
        <button className="font-headline text-sm italic hover:underline underline-offset-8 decoration-[#E5E2D9]">View the Complete Archive ({stats?.total_present + stats?.total_absent + stats?.total_late || 0} Records)</button>
      </div>
    </main>

    {/* Bottom Bar - Editorial */}
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center pt-4 pb-10 px-8 bg-[#FAF9F6] border-t border-[#E5E2D9]">
      <TabItemEditorial icon="home_max" label="Dispatch" active={false} onClick={() => setCurrentTab('home')} />
      <TabItemEditorial icon="history_edu" label="Archive" active={true} onClick={() => setCurrentTab('history')} />
      <TabItemEditorial icon="menu_book" label="Syllabus" active={false} onClick={() => setCurrentTab('courses')} />
      <TabItemEditorial icon="person_2" label="Identity" active={false} onClick={() => setCurrentTab('profile')} />
    </nav>
  </div>
);

const TabItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 group transition-all ${active ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>
    <span className={`material-symbols-outlined text-[22px] ${active ? 'fill-current' : ''}`}>{icon}</span>
    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);

const TabItemEditorial = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 group transition-all ${active ? 'text-[#1a1a1a]' : 'text-[#8C8980] hover:text-[#1a1a1a]'}`}>
    <span className={`material-symbols-outlined text-[20px] transition-transform group-hover:-translate-y-1 ${active ? 'fill-current' : ''}`}>{icon}</span>
    <span className="text-[9px] font-label uppercase tracking-[0.2em]">{label}</span>
  </button>
);

export default function StudentHistory({ onLogout, setCurrentTab, isDarkMode, toggleTheme, history, stats }) {
  return isDarkMode ? (
    <BentoHistory 
      onLogout={onLogout} 
      toggleTheme={toggleTheme} 
      isDarkMode={isDarkMode} 
      setCurrentTab={setCurrentTab} 
      history={history}
      stats={stats}
    />
  ) : (
    <EditorialHistory 
      onLogout={onLogout} 
      toggleTheme={toggleTheme} 
      isDarkMode={isDarkMode} 
      setCurrentTab={setCurrentTab} 
      history={history}
      stats={stats}
    />
  );
}

