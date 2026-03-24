import React from 'react';

const BentoDashboard = ({ user, studentData }) => {
  const records = studentData?.profile?.academic_records?.[0];
  const courses = studentData?.courses || [];
  const history = studentData?.history || [];

  return (
    <main className="pt-24 px-6 max-w-4xl mx-auto space-y-10">
      {/* Hero Section: Aggregate Stats */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-5">
        <div className="md:col-span-8 bg-surface-container-low/40 backdrop-blur-md border border-white/5 p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-primary">Performance Live</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-3 leading-tight">Overall<br/>Attendance</h2>
            <p className="text-on-surface-variant text-sm max-w-xs leading-relaxed font-medium">Outperforming the majority of peers in your department.</p>
            
            <div className="mt-8 flex items-center gap-6 justify-center md:justify-start">
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Current</p>
                <p className="text-xl font-bold text-primary">{records?.attendance_percentage || 0}%</p>
              </div>
              <div className="h-8 w-px bg-outline/30"></div>
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Target</p>
                <p className="text-xl font-bold text-secondary">90%</p>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 shrink-0">
            <svg className="w-44 h-44 -rotate-90" viewBox="0 0 100 100">
              <circle className="text-surface-container stroke-current" cx="50" cy="50" fill="transparent" r="42" strokeWidth="8"></circle>
              <circle 
                className="text-primary stroke-current" 
                cx="50" 
                cy="50" 
                fill="transparent" 
                r="42" 
                strokeDasharray="264" 
                strokeDashoffset={264 - (264 * (records?.attendance_percentage || 0)) / 100} 
                strokeLinecap="round" 
                strokeWidth="8"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-on-surface tracking-tighter">{records?.attendance_percentage || 0}<span className="text-lg font-bold text-primary">%</span></span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-on-surface-variant font-bold mt-1">Status</span>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-4 bg-surface p-7 rounded-2xl flex flex-col justify-between border border-outline/20">
          <div>
            <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary mb-6">
              <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
            </div>
            <h3 className="text-lg font-bold text-on-surface leading-snug tracking-tight">Academic Wellness</h3>
            <p className="text-sm text-on-surface-variant font-medium mt-1">Tier Achievement</p>
          </div>
          <div className="mt-8">
            <div className="flex items-end justify-between mb-2">
              <p className="text-2xl font-black text-on-surface tracking-tighter">{records?.gpa >= 3.8 ? 'Platinum' : 'Gold'} Tier</p>
              <p className="text-[10px] font-bold text-tertiary uppercase tracking-widest">GPA: {records?.gpa || '0.00'}</p>
            </div>
            <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-tertiary to-primary h-full" style={{ width: `${(records?.gpa / 4) * 100}%` }}></div>
            </div>
            <p className="text-[10px] text-on-surface-variant mt-3 uppercase tracking-widest font-bold">Progress to next milestone</p>
          </div>
        </div>
      </section>

      {/* Courses Overview Section */}
      <section>
        <div className="flex items-end justify-between mb-8 border-b border-outline/20 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">Active Modules ({courses.length})</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {courses.map((course, idx) => (
            <div key={idx} className={`bg-surface border border-outline/20 hover:border-primary/40 transition-all p-6 rounded-2xl group cursor-pointer relative overflow-hidden`}>
              <div className="flex justify-between items-start mb-8">
                <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined">menu_book</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-on-surface leading-none">{course.code}</p>
                </div>
              </div>
              <h3 className="text-[15px] font-bold text-on-surface mb-6 tracking-tight line-clamp-1">{course.name}</h3>
              <p className="text-[11px] text-on-surface-variant font-medium mb-4">{course.faculty_name || 'Department Faculty'}</p>
              <div className="flex items-end gap-1.5 h-10">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className={`flex-1 bg-primary/${i*10} rounded-t-sm h-[${20 + i*15}%]`}></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent History Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold tracking-tight text-on-surface">Activity Ledger</h2>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant bg-surface-container px-3 py-1 rounded-full border border-outline/20">Session Logs</span>
        </div>
        <div className="space-y-3">
          {history.length > 0 ? history.map((item, idx) => {
            const dateObj = new Date(item.timestamp);
            return (
              <div key={idx} className="flex items-center justify-between p-4 bg-surface/50 border border-outline/10 rounded-xl group hover:bg-surface-container/50 hover:border-outline/30 transition-all">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center justify-center min-w-[40px] border-r border-outline/20 pr-4">
                    <p className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-tighter">
                      {dateObj.toLocaleString('default', { month: 'short' }).toUpperCase()}
                    </p>
                    <p className="text-xl font-black text-on-surface leading-none">{dateObj.getDate()}</p>
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-on-surface">Campus Check-in</p>
                    <p className="text-[11px] text-on-surface-variant font-medium">Automatic verification • <span className="text-on-surface/60">{dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></p>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-lg bg-${item.status === 'present' ? 'secondary' : 'error'}/5 border border-${item.status === 'present' ? 'secondary' : 'error'}/20 text-${item.status === 'present' ? 'secondary' : 'error'}`}>
                  <span className="text-[10px] font-bold uppercase tracking-widest">{item.status}</span>
                </div>
              </div>
            );
          }) : (
            <p className="text-center py-8 text-on-surface-variant italic border-2 border-dashed border-outline/10 rounded-xl">No recent activity found.</p>
          )}
        </div>
      </section>
    </main>
  );
};

const EditorialDashboard = ({ user, studentData }) => {
  const records = studentData?.profile?.academic_records?.[0];
  const courses = studentData?.courses || [];

  return (
    <main className="max-w-7xl mx-auto px-6 pt-12 font-body selection:bg-primary/20">
      {/* Hero Welcome Section */}
      <section className="mb-16">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-on-surface-variant mb-4 block">Academic Overview</span>
        <h2 className="text-6xl font-headline italic text-on-primary-fixed leading-tight">Welcome back, {user?.full_name?.split(' ')[0] || 'Scholar'}</h2>
        <p className="mt-4 text-on-secondary-fixed-variant max-w-2xl leading-relaxed text-lg">
          Your academic journal is updated. You are currently enrolled in {courses.length} active modules and your attendance integrity remains above the departmental threshold.
        </p>
      </section>

      {/* Featured Modules & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
        <div className="md:col-span-4 bg-surface-container-lowest p-8 rounded-xl shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[320px] border border-outline-variant/10">
          <div className="relative z-10">
            <span className="material-symbols-outlined text-primary mb-6 scale-150">auto_awesome</span>
            <h3 className="text-sm uppercase tracking-widest font-bold text-on-surface-variant mb-2">Cumulative GPA</h3>
            <p className="text-7xl font-headline font-bold text-on-surface tracking-tighter">{records?.gpa || '0.00'}</p>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-primary font-bold">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span className="text-xs uppercase tracking-wider">Top Tier Achievement</span>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-primary/10 rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="md:col-span-8 bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h3 className="text-sm uppercase tracking-widest font-bold text-on-surface-variant mb-2">Attendance Integrity</h3>
              <p className="text-4xl font-headline text-on-surface">Consistent Presence</p>
            </div>
            <div className="text-right">
              <span className="text-5xl font-headline font-bold text-primary">{records?.attendance_percentage || 0}%</span>
            </div>
          </div>
          <div className="space-y-8">
            <div className="relative h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${records?.attendance_percentage || 0}%` }}></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="border-l-2 border-primary/20 pl-4">
                <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Status</span>
                <span className="text-lg font-headline italic text-on-surface">Verified</span>
              </div>
              <div className="border-l-2 border-primary/20 pl-4">
                <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Last Log</span>
                <span className="text-lg font-headline italic text-on-surface">Recent</span>
              </div>
              <div className="border-l-2 border-primary/20 pl-4">
                <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Credits</span>
                <span className="text-lg font-headline italic text-on-surface">{records?.credits_completed || 0} pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module List Section */}
      <div className="mb-24">
        <div className="flex items-end justify-between mb-8 border-b border-outline-variant/20 pb-4">
          <h3 className="text-3xl font-headline italic text-on-surface">Current Literature & Modules</h3>
          <button className="text-primary text-xs font-bold uppercase tracking-widest border-b-2 border-primary/20 hover:border-primary pb-1 transition-all">Full Curriculum</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.length > 0 ? courses.map((mod, idx) => (
            <div key={idx} className="group bg-surface-container-lowest p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-500 cursor-pointer border-b-4 border-transparent hover:border-primary flex flex-col justify-between border-t border-x border-outline-variant/10">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant bg-surface-container px-3 py-1 rounded">{mod.code}</span>
                  <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">arrow_outward</span>
                </div>
                <h4 className="text-2xl font-headline font-bold text-on-surface mb-3">{mod.name}</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-8 line-clamp-2">{mod.description || 'Exploration of core principles and advanced applications within the academic framework.'}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-surface-container overflow-hidden"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-primary/20 overflow-hidden text-[8px] flex items-center justify-center font-bold">FT</div>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-tight text-on-surface-variant">{mod.faculty_name || 'Faculty Lead'}</span>
              </div>
            </div>
          )) : (
            <div className="col-span-3 py-12 text-center border-2 border-dashed border-outline-variant/20 rounded-xl">
               <p className="text-on-surface-variant italic font-headline">No active modules found in your current curriculum.</p>
            </div>
          )}
        </div>
      </div>

      {/* Curator's Quote */}
      <section className="mb-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="relative group">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-surface-container">
            <img alt="The Library" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 transition-all duration-1000" src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1000"/>
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent"></div>
          </div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
        </div>
        <div className="space-y-8">
          <h3 className="text-5xl font-headline italic text-on-surface leading-tight">The Curator's Note</h3>
          <p className="font-body text-on-surface-variant text-xl leading-relaxed italic border-l-4 border-primary pl-10 py-4">
            "Intelligence is not just the accumulation of data, but the curation of meaningful connections between disparate fields of study. Your current progress shows remarkable synergy."
          </p>
          <div className="flex items-center gap-6 pt-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-xl">
              <span className="material-symbols-outlined text-3xl">history_edu</span>
            </div>
            <div>
              <p className="text-lg font-bold text-on-surface">Dean Alistair Thorne</p>
              <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant font-bold">Faculty of Computation</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default function StudentHome({ user, studentData, onLogout, setCurrentTab, isDarkMode, toggleTheme }) {
  const currentTab = 'home'; // Controlled by parent, but local ref for home logic

  return (
    <div className={`min-h-screen pb-24 selection:bg-primary/30 transition-colors duration-500 ${isDarkMode ? 'bg-background text-on-surface' : 'bg-[#f8f9fa] text-on-surface'}`}>
      {/* Dynamic Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 flex items-center justify-between px-6 py-4 ${
        isDarkMode 
          ? 'bg-background/80 backdrop-blur-md border-b border-outline/30' 
          : 'bg-[#f8f9fa]/80 backdrop-blur-md border-b border-outline-variant/30'
      }`}>
        <div className="flex items-center gap-4">
          {isDarkMode ? (
            <div className="flex items-center gap-4">
              <div className="relative cursor-pointer" onClick={onLogout} title="Click to Logout">
                <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/30">
                  <img alt="Student Profile" className="w-full h-full object-cover" src={user?.avatar_url || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=150"}/>
                </div>
              </div>
              <div>
                <h1 className="text-sm font-extrabold tracking-tight text-on-surface uppercase leading-none">Scholar Slate <span className="text-primary">Pro</span></h1>
                <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">Academic Dashboard</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-primary text-3xl">menu_book</span>
              <h1 className="text-2xl font-headline italic tracking-tight text-on-surface">Scholar Slate</h1>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
            isDarkMode ? 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface' : 'text-on-surface-variant hover:bg-surface-container-high'
          }`}>
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>
          
          <button onClick={toggleTheme} className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
            isDarkMode ? 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface' : 'text-on-surface-variant hover:bg-surface-container-high'
          }`} aria-label="Toggle Theme">
            <span className="material-symbols-outlined text-[20px]">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
          </button>

          <button className={`relative w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
            isDarkMode ? 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface' : 'text-on-surface-variant hover:bg-surface-container-high'
          }`}>
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-error rounded-full"></span>
          </button>
          
          {!isDarkMode && (
            <div className="w-9 h-9 rounded-full bg-surface-container overflow-hidden ml-2 border border-outline-variant/30 cursor-pointer shadow-sm" onClick={onLogout}>
              <img alt="User" className="w-full h-full object-cover" src={user?.avatar_url || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=150"}/>
            </div>
          )}
        </div>
      </header>
      
      {/* Switch Dashboard View */}
      {isDarkMode ? (
        <BentoDashboard user={user} studentData={studentData} />
      ) : (
        <EditorialDashboard user={user} studentData={studentData} />
      )}

      {/* Dynamic BottomNavBar */}
      <nav className={`fixed bottom-0 left-0 w-full flex justify-around items-center px-6 py-4 pb-safe z-50 transition-all duration-500 ${
        isDarkMode 
          ? 'bg-background/95 backdrop-blur-xl border-t border-outline/20' 
          : 'bg-white/95 backdrop-blur-xl border-t border-[#f0f1f2] shadow-[0_-10px_30px_rgba(25,28,29,0.04)]'
      }`}>
        <div className={`flex flex-col items-center justify-center transition-all cursor-pointer ${currentTab === 'home' ? (isDarkMode ? 'text-primary' : 'text-[#4F46E5] scale-110') : 'text-on-surface-variant hover:text-on-surface'}`} onClick={() => setCurrentTab('home')}>
          <div className={`${currentTab === 'home' ? (isDarkMode ? 'bg-primary/10' : 'bg-[#e2dfff]') : ''} px-5 py-1.5 rounded-xl mb-1 flex items-center justify-center transition-all`}>
            <span className="material-symbols-outlined" style={{fontVariationSettings: currentTab === 'home' ? "'FILL' 1" : "'FILL' 0"}}>home</span>
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase">Home</span>
        </div>
        
        <div className="flex flex-col items-center justify-center text-on-surface-variant hover:text-on-surface transition-all cursor-pointer group" onClick={() => setCurrentTab('history')}>
          <span className="material-symbols-outlined mb-1 group-hover:scale-110 transition-transform">history</span>
          <span className="text-[10px] font-bold tracking-widest uppercase">History</span>
        </div>
        
        <div className="flex flex-col items-center justify-center text-on-surface-variant hover:text-on-surface transition-all cursor-pointer group" onClick={() => setCurrentTab('courses')}>
          <span className="material-symbols-outlined mb-1 group-hover:scale-110 transition-transform">school</span>
          <span className="text-[10px] font-bold tracking-widest uppercase">Courses</span>
        </div>
        
        <div className="flex flex-col items-center justify-center text-on-surface-variant hover:text-on-surface transition-all cursor-pointer group" onClick={() => setCurrentTab('profile')}>
          <span className="material-symbols-outlined mb-1 group-hover:scale-110 transition-transform">person</span>
          <span className="text-[10px] font-bold tracking-widest uppercase">Profile</span>
        </div>
      </nav>
    </div>
  );
}
