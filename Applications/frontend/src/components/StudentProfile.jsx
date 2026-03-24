import React from 'react';

export default function StudentProfile({ user, onLogout, setCurrentTab, isDarkMode, toggleTheme }) {
  return (
    <div className="bg-background text-on-surface min-h-screen pb-24 selection:bg-primary selection:text-on-primary">
      {/* TopAppBar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl flex justify-between items-center px-6 py-4 max-w-none border-b border-outline/20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden ring-2 ring-primary/20">
            <img alt="User profile portrait" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=150" />
          </div>
          <span className="font-manrope font-extrabold tracking-tighter text-primary text-xl">Scholar Slate Pro</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">search</span>
          </button>
          <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant" aria-label="Toggle Theme">
            <span className="material-symbols-outlined">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <button className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-error rounded-full"></span>
          </button>
        </div>
      </nav>

      <main className="pt-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        {/* Profile Hero Section */}
        <header className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-br from-primary to-primary-container opacity-5 blur-3xl rounded-full"></div>
          <div className="relative flex flex-col md:flex-row items-start md:items-end gap-8 pt-8">
            <div className="relative">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-xl overflow-hidden shadow-2xl ring-4 ring-surface-container-high">
                <img className="w-full h-full object-cover" alt="Profile" src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=150" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary text-on-primary p-2 rounded-lg shadow-lg">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[11px] font-medium tracking-[0.05em] uppercase">Student</span>
                <span className="text-on-surface-variant font-label text-sm">ID: SCH-8829-01</span>
              </div>
              <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight text-on-surface">{user ? user.email.split('@')[0] : 'Julian Thorne'}</h1>
              <p className="font-body text-xl text-on-surface-variant max-w-xl">Enrolled in Computer Science</p>
            </div>
            <div className="flex gap-3">
              <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-md font-medium text-sm flex items-center gap-2 hover:opacity-90 transition-opacity">
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit Profile
              </button>
            </div>
          </div>
        </header>

        {/* Asymmetric Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Settings */}
          <div className="md:col-span-8 space-y-6">
            <div className="bg-surface-container-low rounded-xl p-8 space-y-8 border-b border-outline/20">
              <div className="flex justify-between items-center">
                <h2 className="font-headline text-2xl font-bold text-on-surface">Account Settings</h2>
                <span className="material-symbols-outlined text-on-surface-variant">settings</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Email Address</label>
                  <input readOnly className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant/20 focus:ring-0 focus:border-primary transition-all px-0 py-2 text-on-surface font-medium" type="email" value={user?.email || "j.thorne@scholarly.edu"} />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Phone Number</label>
                  <input className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant/20 focus:ring-0 focus:border-primary transition-all px-0 py-2 text-on-surface font-medium" type="text" defaultValue="+1 (555) 892-0192" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Language</label>
                  <select className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant/20 focus:ring-0 focus:border-primary transition-all px-0 py-2 text-on-surface font-medium appearance-none">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Time Zone</label>
                  <input className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant/20 focus:ring-0 focus:border-primary transition-all px-0 py-2 text-on-surface font-medium" type="text" defaultValue="GMT -05:00 (EST)" />
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-xl p-8 space-y-6">
              <h2 className="font-headline text-2xl font-bold text-on-surface">Communication</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-surface-container-lowest/50 hover:bg-surface-container-lowest transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">mail</span>
                    </div>
                    <div>
                      <p className="font-medium text-on-surface">Course Alerts</p>
                      <p className="text-xs text-on-surface-variant">Notify when grades are posted</p>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-on-primary rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Stats */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline/20 space-y-4">
              <h3 className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">Scholarly Impact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-surface-container-high rounded-lg">
                  <p className="text-2xl font-headline font-bold text-primary">88%</p>
                  <p className="text-[10px] text-on-surface-variant uppercase">Attendance</p>
                </div>
                <div className="p-4 bg-surface-container-high rounded-lg">
                  <p className="text-2xl font-headline font-bold text-on-surface">3.98</p>
                  <p className="text-[10px] text-on-surface-variant uppercase">Academic GPA</p>
                </div>
              </div>
              <div className="pt-4 border-t border-outline/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-on-surface-variant">Degree Progress</span>
                  <span className="text-xs font-bold text-on-surface">68%</span>
                </div>
                <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[68%]"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center pt-3 pb-6 px-4 bg-background/80 backdrop-blur-md shadow-[0_-12px_40px_rgba(225,225,239,0.06)] border-t border-outline/20">
        <a className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-200 transition-all active:scale-90 duration-300 cursor-pointer" onClick={(e) => { e.preventDefault(); setCurrentTab('home'); }}>
          <span className="material-symbols-outlined mb-1">home_max</span>
          <span className="font-inter text-[11px] uppercase tracking-[0.05em] font-medium">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-200 transition-all active:scale-90 duration-300 cursor-pointer" onClick={(e) => { e.preventDefault(); setCurrentTab('history'); }}>
          <span className="material-symbols-outlined mb-1">history_edu</span>
          <span className="font-inter text-[11px] uppercase tracking-[0.05em] font-medium">History</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-200 transition-all active:scale-90 duration-300 cursor-pointer" onClick={(e) => { e.preventDefault(); setCurrentTab('courses'); }}>
          <span className="material-symbols-outlined mb-1">menu_book</span>
          <span className="font-inter text-[11px] uppercase tracking-[0.05em] font-medium">Courses</span>
        </a>
        <a className="flex flex-col items-center justify-center text-primary font-bold active:scale-90 duration-300 cursor-pointer" onClick={(e) => { e.preventDefault(); setCurrentTab('profile'); }}>
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>person_2</span>
          <span className="font-inter text-[11px] uppercase tracking-[0.05em] font-medium">Profile</span>
        </a>
      </nav>
    </div>
  );
}
