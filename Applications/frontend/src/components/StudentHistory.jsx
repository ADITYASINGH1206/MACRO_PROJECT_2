import React from 'react';

export default function StudentHistory({ user, onLogout, setCurrentTab }) {
  return (
    <div className="bg-[#11131c] text-[#e1e1ef] min-h-screen pb-24">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#11131c]/60 backdrop-blur-xl flex justify-between items-center px-6 py-4 max-w-none border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-highest cursor-pointer" onClick={onLogout} title="Click to Logout">
            <img alt="User Profile" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=150"/>
          </div>
          <h1 className="font-manrope tracking-tight font-bold text-xl text-slate-100">
            <span className="font-manrope font-extrabold tracking-tighter text-[#bbc3ff]">Scholar Slate Pro</span>
          </h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-800/40 transition-colors">
          <span className="material-symbols-outlined text-[#bbc3ff]">search</span>
        </button>
      </header>
      <main className="pt-24 px-6 max-w-4xl mx-auto">
        {/* Editorial Header Section */}
        <section className="mb-12">
          <p className="font-label text-[11px] uppercase tracking-[0.15em] text-on-tertiary-container mb-2">Academic Record</p>
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-8">Attendance Analytics</h2>
          {/* Bento Grid Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Stat: Percentage */}
            <div className="md:col-span-2 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-primary/10 transition-colors"></div>
              <div>
                <span className="text-on-surface-variant font-medium">Overall Attendance</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-6xl font-headline font-bold text-primary">94.2</span>
                  <span className="text-2xl font-headline font-medium text-primary-fixed-dim">%</span>
                </div>
              </div>
              <div className="mt-8 flex gap-4">
                <div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[94.2%]"></div>
                </div>
                <span className="text-xs font-label text-on-surface-variant">+2.1% from last month</span>
              </div>
            </div>
            {/* Secondary Stat: Counts */}
            <div className="bg-surface-container-high rounded-xl p-6 flex flex-col justify-between border-l-2 border-primary/20">
              <div>
                <span className="text-on-surface-variant font-medium">Total Sessions</span>
                <p className="text-4xl font-headline font-bold text-on-surface mt-1">128</p>
              </div>
              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Present</span>
                  <span className="font-bold text-on-surface">118</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Late</span>
                  <span className="font-bold text-on-tertiary-container">6</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Absent</span>
                  <span className="font-bold text-error">4</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Search & Filter Bar */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
              <input className="w-full bg-surface-container-lowest border-none border-b border-outline-variant/20 focus:ring-0 focus:border-primary text-on-surface pl-12 pr-4 py-4 rounded-lg transition-all outline-none" placeholder="Search sessions or subjects..." type="text"/>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button className="bg-surface-container-highest px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">filter_list</span>
                All Status
              </button>
              <button className="bg-surface-container-highest px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">calendar_month</span>
                This Term
              </button>
            </div>
          </div>
        </section>
        {/* Attendance List */}
        <section className="space-y-4">
          {/* Entry 1: Present */}
          <div className="bg-surface-container-low hover:bg-surface-container border-l-4 border-primary/40 p-5 rounded-lg flex items-center justify-between transition-all group">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">menu_book</span>
              </div>
              <div>
                <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors">Advanced Quantitative Analysis</h4>
                <div className="flex items-center gap-3 mt-1 text-sm text-on-surface-variant">
                  <span>Dr. Julian Thorne</span>
                  <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                  <span>Oct 24, 2023</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded-full">Present</span>
              <span className="text-xs text-on-surface-variant font-label">09:02 AM</span>
            </div>
          </div>
          {/* Entry 2: Late */}
          <div className="bg-surface-container-low hover:bg-surface-container border-l-4 border-tertiary-fixed-dim/40 p-5 rounded-lg flex items-center justify-between transition-all group">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary-fixed-dim">history_edu</span>
              </div>
              <div>
                <h4 className="font-bold text-on-surface group-hover:text-tertiary-fixed-dim transition-colors">Digital Humanities Seminar</h4>
                <div className="flex items-center gap-3 mt-1 text-sm text-on-surface-variant">
                  <span>Prof. Sarah Jenkins</span>
                  <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                  <span>Oct 22, 2023</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="px-3 py-1 bg-tertiary/10 text-tertiary text-[10px] font-bold uppercase tracking-wider rounded-full">Late (12m)</span>
              <span className="text-xs text-on-surface-variant font-label">10:42 AM</span>
            </div>
          </div>
          {/* Entry 3: Present */}
          <div className="bg-surface-container-low hover:bg-surface-container border-l-4 border-primary/40 p-5 rounded-lg flex items-center justify-between transition-all group">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">science</span>
              </div>
              <div>
                <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors">Experimental Psychology Lab</h4>
                <div className="flex items-center gap-3 mt-1 text-sm text-on-surface-variant">
                  <span>Dr. Michael Chen</span>
                  <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                  <span>Oct 21, 2023</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded-full">Present</span>
              <span className="text-xs text-on-surface-variant font-label">02:00 PM</span>
            </div>
          </div>
          {/* Entry 4: Absent */}
          <div className="bg-surface-container-low hover:bg-surface-container border-l-4 border-error/40 p-5 rounded-lg flex items-center justify-between transition-all group">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center">
                <span className="material-symbols-outlined text-error">architecture</span>
              </div>
              <div>
                <h4 className="font-bold text-on-surface group-hover:text-error transition-colors">Modernist Theory &amp; Design</h4>
                <div className="flex items-center gap-3 mt-1 text-sm text-on-surface-variant">
                  <span>Arch. Elena Rossi</span>
                  <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                  <span>Oct 19, 2023</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="px-3 py-1 bg-error/10 text-error text-[10px] font-bold uppercase tracking-wider rounded-full">Absent</span>
              <span className="text-xs text-on-surface-variant font-label">--:--</span>
            </div>
          </div>
          {/* Entry 5: Present */}
          <div className="bg-surface-container-low hover:bg-surface-container border-l-4 border-primary/40 p-5 rounded-lg flex items-center justify-between transition-all group">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">account_balance</span>
              </div>
              <div>
                <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors">International Law Perspectives</h4>
                <div className="flex items-center gap-3 mt-1 text-sm text-on-surface-variant">
                  <span>Prof. David Wright</span>
                  <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                  <span>Oct 18, 2023</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded-full">Present</span>
              <span className="text-xs text-on-surface-variant font-label">09:00 AM</span>
            </div>
          </div>
        </section>
        {/* Load More */}
        <div className="mt-12 flex justify-center">
          <button className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors font-label text-xs uppercase tracking-widest px-8 py-4 bg-surface-container-highest/30 rounded-full border border-outline-variant/10">
            Load Previous Records
            <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
          </button>
        </div>
      </main>
      
      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center pt-3 pb-6 px-4 bg-[#11131c]/80 backdrop-blur-md border-t border-white/5 shadow-[0_-12px_40px_rgba(225,225,239,0.06)]">
        <a className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-200 transition-all active:scale-90 duration-300" href="#" onClick={(e) => { e.preventDefault(); setCurrentTab('home'); }}>
          <span className="material-symbols-outlined">home_max</span>
          <span className="font-inter text-[11px] uppercase tracking-[0.05em] font-medium mt-1">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#bbc3ff] font-bold active:scale-90 duration-300" href="#" onClick={(e) => { e.preventDefault(); setCurrentTab('history'); }}>
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>history_edu</span>
          <span className="font-inter text-[11px] uppercase tracking-[0.05em] font-medium mt-1">History</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-200 transition-all active:scale-90 duration-300" href="#" onClick={(e) => { e.preventDefault(); setCurrentTab('courses'); }}>
          <span className="material-symbols-outlined">menu_book</span>
          <span className="font-inter text-[11px] uppercase tracking-[0.05em] font-medium mt-1">Courses</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-200 transition-all active:scale-90 duration-300" href="#" onClick={(e) => { e.preventDefault(); setCurrentTab('profile'); }}>
          <span className="material-symbols-outlined">person_2</span>
          <span className="font-inter text-[11px] uppercase tracking-[0.05em] font-medium mt-1">Profile</span>
        </a>
      </nav>
    </div>
  );
}
