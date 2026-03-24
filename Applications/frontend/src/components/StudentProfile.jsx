import React from 'react';

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

const BentoProfile = ({ user, onLogout, toggleTheme, isDarkMode, setCurrentTab, records }) => (
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

    <main className="pt-24 px-6 max-w-7xl mx-auto">
      {/* Hero */}
      <section className="mb-12 flex flex-col md:flex-row items-center gap-8 bg-white/[0.02] p-8 rounded-3xl border border-white/5">
        <div className="relative group">
          <div className="w-40 h-40 rounded-2xl overflow-hidden border border-white/10 group-hover:border-indigo-500/50 transition-all duration-500">
            <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=150" alt="Avatar" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
          </div>
          <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-white text-sm">photo_camera</span>
          </button>
        </div>
        <div className="flex-1 text-center md:text-left">
          <p className="text-indigo-400 font-bold tracking-[0.2em] text-[10px] uppercase mb-2">Authenticated Scholar</p>
          <h2 className="text-5xl font-extrabold tracking-tighter text-white mb-2">{user?.full_name || user?.email?.split('@')[0] || 'Scholar'}</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
            <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-white/5">{records?.department || 'Registry'}</span>
            <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-white/5">Semester {records?.semester || 'N/A'}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-indigo-500 text-white px-8 py-3 rounded-2xl text-xs font-bold hover:bg-indigo-600 transition-all">Download Records</button>
          <button className="bg-white/5 text-slate-400 px-4 py-3 rounded-2xl hover:bg-white/10 transition-all">
            <span className="material-symbols-outlined text-sm">settings</span>
          </button>
        </div>
      </section>

      {/* Bento Stats & Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5">
            <h3 className="text-xl font-extrabold text-white mb-8">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: "Email Address", value: user?.email || "Scholar Portal" },
                { label: "Department", value: records?.department || "Unassigned" },
                { label: "Status", value: "Active Undergraduate" },
                { label: "Affiliation", value: "Macro Project" }
              ].map((field, idx) => (
                <div key={idx} className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{field.label}</p>
                  <p className="text-sm font-bold text-white tracking-tight">{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5">
            <h3 className="text-xl font-extrabold text-white mb-8">Credentials & Security</h3>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/[0.08] transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                  <span className="material-symbols-outlined text-sm">shield</span>
                </div>
                <div>
                  <p className="text-white text-xs font-bold">Two-Factor Authentication</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Enabled via Authenticator</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-500 group-hover:text-white transition-colors">chevron_right</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all"></div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 opacity-70">Current Performance</p>
            <p className="text-4xl font-extrabold tracking-tighter mb-1">{records?.gpa || '0.00'}</p>
            <p className="text-xs font-bold opacity-70">Cumulative GPA</p>
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-2">Credits Earned</p>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-white transition-all duration-1000" style={{ width: `${Math.min((records?.total_credits / 120) * 100 || 0, 100)}%` }}></div>
              </div>
              <p className="text-right text-[10px] font-bold mt-2">{records?.total_credits || 0} / 120 Units</p>
            </div>
          </div>

          <button onClick={onLogout} className="w-full py-4 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">
            Sign Out of Account
          </button>
        </div>
      </div>
    </main>

    {/* Bottom Bar */}
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center pt-3 pb-8 px-6 bg-[#0A0A0B]/90 backdrop-blur-xl border-t border-white/5 shadow-2xl">
      <TabItem icon="home_max" label="Home" active={false} onClick={() => setCurrentTab('home')} />
      <TabItem icon="history_edu" label="History" active={false} onClick={() => setCurrentTab('history')} />
      <TabItem icon="menu_book" label="Courses" active={false} onClick={() => setCurrentTab('courses')} />
      <TabItem icon="person_2" label="Profile" active={true} onClick={() => setCurrentTab('profile')} />
    </nav>
  </div>
);

const EditorialProfile = ({ user, onLogout, toggleTheme, isDarkMode, setCurrentTab, records }) => (
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

    <main className="pt-32 px-12 max-w-5xl mx-auto">
      <section className="text-center mb-32">
        <p className="font-label text-[10px] uppercase tracking-[0.4em] text-[#8C8980] mb-8 italic">The Scholar's Identity</p>
        <div className="w-48 h-48 rounded-full overflow-hidden mx-auto mb-12 border border-[#E5E2D9] p-2">
          <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=150" alt="Profile" className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-1000" />
        </div>
        <h2 className="font-headline text-7xl font-serif italic mb-6">{user?.full_name || user?.email?.split('@')[0] || 'Scholar'}</h2>
        <p className="text-[#4A4941] text-xl font-medium tracking-tight mb-2">Fellow of the {records?.department || ' Registry'}</p>
        <p className="font-label text-xs uppercase tracking-[0.2em] text-[#8C8980]">Academic Session: {records?.semester || 'Autumn'}</p>
      </section>

      {/* Profile Details - Editorial Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-24 border-t border-[#E5E2D9] pt-24 mb-32">
        <section>
          <h3 className="font-headline text-2xl italic mb-12 border-b border-[#E5E2D9]/50 pb-4">Biographical Notes</h3>
          <div className="space-y-12">
            {[
              { label: "Correspondence", value: user?.email || "Portal Access Only" },
              { label: "Faculty", value: records?.department || "Unassigned" },
              { label: "Commencement", value: "Academic Year 2023" }
            ].map((field, idx) => (
              <div key={idx}>
                <p className="font-label text-[9px] uppercase tracking-[0.2em] text-[#8C8980] mb-2">{field.label}</p>
                <p className="text-lg font-medium tracking-tight">{field.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-headline text-2xl italic mb-12 border-b border-[#E5E2D9]/50 pb-4">Academic Status</h3>
          <div className="space-y-12">
            <div>
              <p className="font-label text-[9px] uppercase tracking-[0.2em] text-[#8C8980] mb-2">Scholastic Standing</p>
              <p className="text-4xl font-headline italic">{parseFloat(records?.gpa) >= 3.5 ? 'Summa Cum Laude' : 'Academic Excellence'}</p>
              <p className="text-[10px] text-[#4A4941] mt-2 italic">Current Portfolio GPA: {records?.gpa || '0.00'}</p>
            </div>
            <div className="pt-12 border-t border-[#E5E2D9]/50">
              <button className="font-headline italic text-lg hover:underline underline-offset-8 decoration-[#E5E2D9]">Revise Identity Records</button>
            </div>
          </div>
        </section>
      </div>

      <div className="text-center py-24 border-t border-[#E5E2D9]">
        <button onClick={onLogout} className="font-label text-[10px] uppercase tracking-[0.4em] text-[#8B0000] hover:scale-105 transition-transform italic underline underline-offset-8">Relinquish Access</button>
      </div>
    </main>

    {/* Bottom Bar - Editorial */}
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center pt-4 pb-10 px-8 bg-[#FAF9F6] border-t border-[#E5E2D9]">
      <TabItemEditorial icon="home_max" label="Dispatch" active={false} onClick={() => setCurrentTab('home')} />
      <TabItemEditorial icon="history_edu" label="Archive" active={false} onClick={() => setCurrentTab('history')} />
      <TabItemEditorial icon="menu_book" label="Syllabus" active={false} onClick={() => setCurrentTab('courses')} />
      <TabItemEditorial icon="person_2" label="Identity" active={true} onClick={() => setCurrentTab('profile')} />
    </nav>
  </div>
);

export default function StudentProfile({ user, onLogout, setCurrentTab, isDarkMode, toggleTheme, records }) {
  return isDarkMode ? (
    <BentoProfile 
      user={user} 
      onLogout={onLogout} 
      toggleTheme={toggleTheme} 
      isDarkMode={isDarkMode} 
      setCurrentTab={setCurrentTab} 
      records={records}
    />
  ) : (
    <EditorialProfile 
      user={user} 
      onLogout={onLogout} 
      toggleTheme={toggleTheme} 
      isDarkMode={isDarkMode} 
      setCurrentTab={setCurrentTab} 
      records={records}
    />
  );
}

