import React from 'react';

const BentoCourses = ({ onLogout, toggleTheme, isDarkMode, setCurrentTab, courses }) => {
  const featuredCourse = courses.length > 0 ? courses[0] : null;
  const otherCourses = courses.length > 1 ? courses.slice(1) : [];

  return (
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
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <p className="text-indigo-400 font-bold tracking-[0.2em] text-[10px] uppercase mb-1">Academic Curriculum</p>
              <h2 className="text-5xl font-extrabold tracking-tighter text-white mb-4">Course <span className="text-slate-500">Registry</span></h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">Your active learning modules and research tracks for the current academic session.</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-indigo-500 text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all hover:bg-indigo-600">Active Term</button>
              <button className="bg-white/5 text-slate-400 px-6 py-2.5 rounded-full text-xs font-bold transition-all hover:bg-white/10 uppercase tracking-widest">History</button>
            </div>
          </div>
        </section>

        {/* Bento Grid layout for Courses */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourse ? (
            <div className="md:col-span-2 bg-white/[0.03] rounded-3xl border border-white/5 overflow-hidden flex flex-col md:flex-row group hover:border-indigo-500/30 transition-all duration-500">
              <div className="md:w-5/12 h-64 md:h-auto relative overflow-hidden">
                <img alt={featuredCourse.course_code} className="w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-80 transition-all duration-700" src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=600"/>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent"></div>
              </div>
              <div className="p-8 flex flex-col justify-between md:w-7/12">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] uppercase tracking-widest font-bold rounded-lg border border-indigo-500/20">Core Track</span>
                    <span className="text-slate-500 font-bold text-[10px] tracking-widest uppercase">{featuredCourse.course_code}</span>
                  </div>
                  <h3 className="text-3xl font-extrabold text-white mb-3">{featuredCourse.course_name}</h3>
                  <p className="text-slate-400 text-sm italic mb-8 leading-relaxed">{featuredCourse.description || 'Redefining knowledge structures through rigorous academic inquiry and practical application.'}</p>
                  <div className="flex items-center gap-4">
                    <img alt="Prof" className="w-10 h-10 rounded-full border border-white/10" src={`https://i.pravatar.cc/100?u=${featuredCourse.instructor_name}`}/>
                    <div>
                      <p className="text-white text-xs font-bold tracking-tight">{featuredCourse.instructor_name}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Principal Instructor</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Weightage</span>
                    <span className="text-lg font-extrabold text-white">{featuredCourse.credits} Credits</span>
                  </div>
                  <button className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-indigo-500 transition-all group/btn">
                    <span className="material-symbols-outlined text-[20px] group-hover/btn:text-white">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="md:col-span-2 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center p-12">
              <p className="text-slate-500 font-bold uppercase tracking-widest">No Active Enrollments</p>
            </div>
          )}

          {otherCourses.map((course, idx) => (
            <div key={idx} className="bg-white/[0.03] p-8 rounded-3xl border border-white/5 hover:border-amber-500/20 transition-all group">
              <div className="flex justify-between items-start mb-12">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-amber-500">
                    {idx % 2 === 0 ? 'architecture' : 'menu_book'}
                  </span>
                </div>
                <span className="text-slate-500 font-bold text-[10px] tracking-widest">{course.course_code}</span>
              </div>
              <h3 className="text-xl font-extrabold text-white mb-2">{course.course_name}</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8">{course.instructor_name}</p>
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-2xl">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Credits</p>
                  <p className="text-xs text-white font-bold">{course.credits} Unit Study</p>
                </div>
              </div>
            </div>
          ))}

          {/* Add Card */}
          <div className="border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center p-8 hover:bg-white/[0.02] hover:border-white/10 transition-all cursor-pointer group">
            <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-indigo-400">add</span>
            </div>
            <p className="text-white font-bold tracking-tight">Expand Curriculum</p>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mt-1">Browse Faculty Catalog</p>
          </div>
        </div>
      </main>

      {/* Bottom Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center pt-3 pb-8 px-6 bg-[#0A0A0B]/90 backdrop-blur-xl border-t border-white/5 shadow-2xl">
        <TabItem icon="home_max" label="Home" active={false} onClick={() => setCurrentTab('home')} />
        <TabItem icon="history_edu" label="History" active={false} onClick={() => setCurrentTab('history')} />
        <TabItem icon="menu_book" label="Courses" active={true} onClick={() => setCurrentTab('courses')} />
        <TabItem icon="person_2" label="Profile" active={false} onClick={() => setCurrentTab('profile')} />
      </nav>
    </div>
  );
};

const EditorialCourses = ({ onLogout, toggleTheme, isDarkMode, setCurrentTab, courses }) => (
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

    <main className="pt-32 px-12 max-w-6xl mx-auto">
      <header className="mb-24 flex justify-between items-end">
        <div>
          <p className="font-label text-xs uppercase tracking-[0.3em] text-[#8B0000] mb-4">The Academic Catalog</p>
          <h2 className="font-headline text-7xl font-serif italic max-w-2xl leading-[1.1]">The Current Pursuit</h2>
        </div>
        <div className="text-right pb-4 border-b border-[#1a1a1a] w-48">
          <p className="font-headline text-sm italic">Academic Year 2023-2024</p>
        </div>
      </header>

      {/* Course List - Editorial Style */}
      <section className="space-y-32 mb-32">
        {courses.length > 0 ? courses.map((course, idx) => (
          <article key={idx} className={`flex flex-col ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-16 items-center`}>
            <div className="md:w-1/2 overflow-hidden aspect-[4/5] bg-[#E5E2D9]">
              <img src={`https://images.unsplash.com/photo-${1481627834876-b7833e8f5570 + idx}?auto=format&fit=crop&q=80&w=600`} alt={course.course_name} className="w-full h-full object-cover grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-1000" />
            </div>
            <div className="md:w-1/2">
              <div className="mb-12">
                <p className="font-label text-[10px] uppercase tracking-widest text-[#8C8980] mb-2">{course.course_code} • {course.credits} Credits</p>
                <h3 className="font-headline text-5xl font-serif mb-6 leading-tight hover:italic transition-all cursor-default">{course.course_name}</h3>
                <p className="text-[#4A4941] text-lg leading-relaxed mb-8 italic">
                  {course.description || "A rigorous examination of foundational principles and modern methodologies within this specific field of academic inquiry."}
                </p>
                <div className="flex items-center gap-4 border-b border-[#E5E2D9] pb-8">
                  <div className="w-12 h-12 rounded-full overflow-hidden grayscale">
                    <img src={`https://i.pravatar.cc/150?u=${course.instructor_name}`} alt="Prof" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{course.instructor_name}</p>
                    <p className="font-label text-[10px] uppercase tracking-widest text-[#8C8980]">Principal Instructor</p>
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-4 group">
                <span className="font-headline italic text-lg group-hover:underline decoration-[#E5E2D9] underline-offset-8">Read the Syllabus</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </button>
            </div>
          </article>
        )) : (
          <div className="text-center py-32 border border-dashed border-[#E5E2D9] rounded-lg">
            <p className="font-headline text-2xl italic text-[#8C8980]">No active pursuits recorded in the syllabus.</p>
          </div>
        )}
      </section>

      <div className="text-center border-t border-[#E5E2D9] pt-24 mb-24">
        <button className="font-headline text-4xl font-serif italic hover:text-[#8B0000] transition-colors">Apply for New Candidacy</button>
        <p className="font-label text-[10px] uppercase tracking-[0.4em] text-[#8C8980] mt-8 italic">Spring Enrollment Opens November 15</p>
      </div>
    </main>

    {/* Bottom Bar - Editorial */}
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center pt-4 pb-10 px-8 bg-[#FAF9F6] border-t border-[#E5E2D9]">
      <TabItemEditorial icon="home_max" label="Dispatch" active={false} onClick={() => setCurrentTab('home')} />
      <TabItemEditorial icon="history_edu" label="Archive" active={false} onClick={() => setCurrentTab('history')} />
      <TabItemEditorial icon="menu_book" label="Syllabus" active={true} onClick={() => setCurrentTab('courses')} />
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

export default function StudentCourses({ onLogout, setCurrentTab, isDarkMode, toggleTheme, courses }) {
  return isDarkMode ? (
    <BentoCourses 
      onLogout={onLogout} 
      toggleTheme={toggleTheme} 
      isDarkMode={isDarkMode} 
      setCurrentTab={setCurrentTab} 
      courses={courses}
    />
  ) : (
    <EditorialCourses 
      onLogout={onLogout} 
      toggleTheme={toggleTheme} 
      isDarkMode={isDarkMode} 
      setCurrentTab={setCurrentTab} 
      courses={courses}
    />
  );
}

