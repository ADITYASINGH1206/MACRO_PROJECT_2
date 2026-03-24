import React from 'react';

export default function StudentCourses({ user, onLogout, setCurrentTab }) {
  return (
    <div className="bg-[#11131c] text-[#e1e1ef] font-body selection:bg-primary/30 min-h-screen">
      <header className="fixed top-0 w-full z-50 bg-[#11131c]/60 backdrop-blur-xl flex justify-between items-center px-6 py-4 max-w-none border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/20 cursor-pointer" onClick={onLogout} title="Click to Logout">
            <img alt="User Profile" src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=150"/>
          </div>
          <span className="font-manrope font-extrabold tracking-tighter text-[#bbc3ff] text-xl">The Scholarly Editorial</span>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-slate-400 hover:bg-slate-800/40 transition-colors p-2 rounded-lg scale-95 duration-200">
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>
      </header>
      
      <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="font-label text-[11px] uppercase tracking-[0.2em] text-primary mb-3 block">Academic Curriculum</span>
              <h1 className="font-headline text-5xl font-extrabold tracking-tight text-on-surface mb-4">Scholar Slate Pro</h1>
              <p className="text-on-surface-variant text-lg leading-relaxed">A curated overview of your current intellectual pursuits and academic progress for the Fall 2024 semester.</p>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
              <button className="bg-secondary-container text-on-secondary-container px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap">Fall 2024</button>
              <button className="bg-surface-container-high text-on-surface-variant px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:bg-surface-container-highest transition-colors">Spring 2024</button>
              <button className="bg-surface-container-high text-on-surface-variant px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:bg-surface-container-highest transition-colors">Archive</button>
            </div>
          </div>
        </section>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          <div className="lg:col-span-3 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">search</span>
            <input className="w-full bg-surface-container-lowest border-b border-outline-variant/20 focus:border-primary transition-all py-4 pl-12 pr-4 rounded-lg text-on-surface placeholder:text-outline/60 focus:ring-0 outline-none" placeholder="Filter courses, faculty, or keywords..." type="text"/>
          </div>
          <div className="bg-primary-container p-4 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-on-primary-container/70 mb-1">Overall GPA</div>
              <div className="text-2xl font-headline font-bold text-primary">3.92</div>
            </div>
            <span className="material-symbols-outlined text-primary text-3xl">school</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-surface-container-low rounded-xl overflow-hidden flex flex-col md:flex-row group border border-outline-variant/5">
            <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden">
              <img alt="Philosophy" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=600"/>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent md:bg-gradient-to-r"></div>
            </div>
            <div className="p-8 flex flex-col justify-between md:w-1/2">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] uppercase tracking-widest font-bold rounded-full">Core Requirement</span>
                  <span className="text-on-surface-variant font-mono text-xs">PHI-402</span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">Epistemology &amp; Digital Logic</h3>
                <p className="text-on-surface-variant text-sm mb-6 line-clamp-2 italic">Exploration of the nature of knowledge in the age of artificial intelligence and distributed ledger technologies.</p>
                <div className="flex items-center gap-3 mb-8">
                  <img alt="Professor" className="w-8 h-8 rounded-full" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100"/>
                  <div>
                    <div className="text-xs font-semibold text-on-surface">Dr. Evelyn Sterling</div>
                    <div className="text-[10px] text-on-surface-variant">Senior Fellow of Logic</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-on-surface-variant">Module 08 of 12</span>
                  <span className="text-primary font-bold">75%</span>
                </div>
                <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/5 hover:border-primary/20 transition-all flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <span className="w-10 h-10 flex items-center justify-center bg-surface-container-highest rounded-lg">
                  <span className="material-symbols-outlined text-[#bbc3ff]">architecture</span>
                </span>
                <span className="text-on-surface-variant font-mono text-xs">ARC-210</span>
              </div>
              <h3 className="font-headline text-xl font-bold text-on-surface mb-1">Parametric Urbanism</h3>
              <p className="text-xs text-on-surface-variant mb-6">Prof. Marcus Thorne</p>
              <div className="bg-surface-container-lowest p-3 rounded-lg mb-6">
                <div className="text-[10px] uppercase tracking-tighter text-outline mb-1">Upcoming Milestone</div>
                <div className="text-sm font-medium text-on-surface">Final Thesis Draft Due</div>
                <div className="text-[10px] text-error mt-1">In 3 Days</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-secondary-container border-2 border-surface-container-low flex items-center justify-center text-[8px]">MT</div>
                <div className="w-6 h-6 rounded-full bg-primary-container border-2 border-surface-container-low flex items-center justify-center text-[8px]">SA</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-on-surface">A-</div>
                <div className="text-[10px] text-on-surface-variant">Performance</div>
              </div>
            </div>
          </div>
          
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/5 hover:border-primary/20 transition-all flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <span className="w-10 h-10 flex items-center justify-center bg-surface-container-highest rounded-lg">
                  <span className="material-symbols-outlined text-[#bbc3ff]">database</span>
                </span>
                <span className="text-on-surface-variant font-mono text-xs">CS-301</span>
              </div>
              <h3 className="font-headline text-xl font-bold text-on-surface mb-1">Quantum Computation</h3>
              <p className="text-xs text-on-surface-variant mb-6">Prof. Chen Wei</p>
              <div className="bg-surface-container-lowest p-3 rounded-lg mb-6">
                <div className="text-[10px] uppercase tracking-tighter text-outline mb-1">Course Progress</div>
                <div className="text-sm font-medium text-on-surface">14/20 Lectures Watched</div>
              </div>
            </div>
            <div>
              <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden mb-2">
                <div className="h-full bg-on-primary-container w-[70%]"></div>
              </div>
              <div className="flex justify-between items-center text-[10px] font-medium text-on-surface-variant">
                <span>70% Complete</span>
                <span>4.0 Credits</span>
              </div>
            </div>
          </div>
          
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/5 hover:border-primary/20 transition-all flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <span className="w-10 h-10 flex items-center justify-center bg-surface-container-highest rounded-lg">
                  <span className="material-symbols-outlined text-[#bbc3ff]">psychology</span>
                </span>
                <span className="text-on-surface-variant font-mono text-xs">PSY-105</span>
              </div>
              <h3 className="font-headline text-xl font-bold text-on-surface mb-1">Cognitive Archeology</h3>
              <p className="text-xs text-on-surface-variant mb-6">Dr. Sarah Jenkins</p>
              <div className="bg-surface-container-lowest p-3 rounded-lg mb-6">
                <div className="text-[10px] uppercase tracking-tighter text-outline mb-1">Next Seminar</div>
                <div className="text-sm font-medium text-on-surface">Tomorrow, 10:00 AM</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] px-2 py-0.5 bg-on-tertiary-container/20 text-tertiary rounded">Elective</span>
              <div className="text-right">
                <div className="text-xs font-bold text-on-surface">B+</div>
                <div className="text-[10px] text-on-surface-variant">Performance</div>
              </div>
            </div>
          </div>
          
          <div className="border-2 border-dashed border-outline-variant/30 p-6 rounded-xl flex flex-col items-center justify-center text-center group hover:bg-surface-container/30 transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary">add</span>
            </div>
            <h3 className="text-on-surface font-headline font-bold">Enroll in New Course</h3>
            <p className="text-xs text-on-surface-variant mt-1">Browse the faculty catalog for upcoming electives</p>
          </div>
        </div>
      </main>
      
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#11131c]/80 backdrop-blur-md flex justify-around items-center pt-3 pb-6 px-4 border-t border-white/5 shadow-[0_-12px_40px_rgba(225,225,239,0.06)]">
        <a className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-200 transition-all active:scale-90 duration-300" href="#" onClick={(e) => { e.preventDefault(); setCurrentTab('home'); }}>
          <span className="material-symbols-outlined mb-1">home_max</span>
          <span className="font-inter text-[11px] uppercase tracking-[0.05em] font-medium">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-200 transition-all active:scale-90 duration-300" href="#" onClick={(e) => { e.preventDefault(); setCurrentTab('history'); }}>
          <span className="material-symbols-outlined mb-1">history_edu</span>
          <span className="font-inter text-[11px] uppercase tracking-[0.05em] font-medium">History</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#bbc3ff] font-bold active:scale-90 duration-300" href="#" onClick={(e) => { e.preventDefault(); setCurrentTab('courses'); }}>
          <span className="material-symbols-outlined mb-1" style={{fontVariationSettings: "'FILL' 1"}}>menu_book</span>
          <span className="font-inter text-[11px] uppercase tracking-[0.05em] font-medium">Courses</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-200 transition-all active:scale-90 duration-300" href="#" onClick={(e) => { e.preventDefault(); setCurrentTab('profile'); }}>
          <span className="material-symbols-outlined mb-1">person_2</span>
          <span className="font-inter text-[11px] uppercase tracking-[0.05em] font-medium">Profile</span>
        </a>
      </nav>
      
      <aside className="hidden xl:flex fixed right-8 top-32 bottom-32 w-80 bg-surface-container-high/40 backdrop-blur-xl border-l border-white/5 rounded-2xl flex-col p-6 shadow-2xl">
        <div className="mb-8">
          <h4 className="font-headline font-bold text-lg text-on-surface mb-4">Academic Notice</h4>
          <div className="space-y-4">
            <div className="bg-surface-container-highest/50 p-4 rounded-lg">
              <p className="text-xs text-on-surface-variant italic leading-relaxed">"The library will be extending its digital archive access hours starting next Monday for all senior researchers."</p>
              <div className="mt-2 text-[10px] text-primary font-bold">— Registrar's Office</div>
            </div>
          </div>
        </div>
        <div className="mt-auto">
          <h4 className="font-label text-[10px] uppercase tracking-[0.1em] text-outline mb-3">Live Feed</h4>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
              <div className="text-[11px] text-on-surface-variant">New material uploaded for <span className="text-on-surface">Quantum Computation</span></div>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
              <div className="text-[11px] text-on-surface-variant">Grade published for <span className="text-on-surface">Architecture 210 Quiz</span></div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
