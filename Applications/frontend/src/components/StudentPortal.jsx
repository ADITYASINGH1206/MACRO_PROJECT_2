import React from 'react';

export default function StudentPortal({ user, onLogout }) {
  return (
    <div className="bg-background text-on-surface min-h-screen pb-24 selection:bg-primary/30">
      {/* TopAppBar Component */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-outline/30 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer" onClick={onLogout} title="Click to Logout">
            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/30">
              <img alt="Student Profile" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=150"/>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-secondary border-2 border-background rounded-full"></div>
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-on-surface uppercase leading-none">Scholar Slate <span className="text-primary">Pro</span></h1>
            <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">Academic Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>
          <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-error rounded-full"></span>
          </button>
        </div>
      </header>
      
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
              <p className="text-on-surface-variant text-sm max-w-xs leading-relaxed font-medium">Outperforming 74% of peers in the Computer Science department.</p>
              
              <div className="mt-8 flex items-center gap-6 justify-center md:justify-start">
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Current</p>
                  <p className="text-xl font-bold text-primary">88%</p>
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
                <circle className="text-primary stroke-current" cx="50" cy="50" fill="transparent" r="42" strokeDasharray="264" strokeDashoffset="31.68" strokeLinecap="round" strokeWidth="8"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-on-surface tracking-tighter">88<span className="text-lg font-bold text-primary">%</span></span>
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
                <p className="text-2xl font-black text-on-surface tracking-tighter">Gold Tier</p>
                <p className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Top 15%</p>
              </div>
              <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-tertiary to-primary h-full w-[92%]"></div>
              </div>
              <p className="text-[10px] text-on-surface-variant mt-3 uppercase tracking-widest font-bold">8 pts to Platinum level</p>
            </div>
          </div>
        </section>

        {/* Courses Overview Section */}
        <section>
          <div className="flex items-end justify-between mb-8 border-b border-outline/20 pb-4">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary mb-1">Curriculum Performance</p>
              <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">Courses Overview</h2>
            </div>
            <button className="group flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">
              View Schedule
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {/* Course Card 1 */}
            <div className="bg-surface border border-outline/20 hover:border-primary/40 transition-all p-6 rounded-2xl group cursor-pointer relative overflow-hidden">
              <div className="flex justify-between items-start mb-8">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">database</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-on-surface leading-none">92%</p>
                  <p className="text-[9px] font-bold text-secondary uppercase tracking-[0.1em] mt-1">Optimal</p>
                </div>
              </div>
              <h3 className="text-[15px] font-bold text-on-surface mb-6 tracking-tight">Data Structures &amp; Algorithms</h3>
              <div className="flex items-end gap-1.5 h-14">
                <div className="flex-1 bg-primary/10 rounded-t-sm h-[60%] group-hover:bg-primary/20 transition-colors"></div>
                <div className="flex-1 bg-primary/20 rounded-t-sm h-[80%] group-hover:bg-primary/30 transition-colors"></div>
                <div className="flex-1 bg-primary/10 rounded-t-sm h-[50%] group-hover:bg-primary/20 transition-colors"></div>
                <div className="flex-1 bg-primary/30 rounded-t-sm h-[90%] group-hover:bg-primary/40 transition-colors"></div>
                <div className="flex-1 bg-primary rounded-t-sm h-[100%] shadow-[0_0_15px_rgba(129,140,248,0.3)]"></div>
              </div>
            </div>
            
            {/* Course Card 2 */}
            <div className="bg-surface border border-outline/20 hover:border-tertiary/40 transition-all p-6 rounded-2xl group cursor-pointer relative overflow-hidden">
              <div className="flex justify-between items-start mb-8">
                <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">functions</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-on-surface leading-none">74%</p>
                  <p className="text-[9px] font-bold text-tertiary uppercase tracking-[0.1em] mt-1">Warning</p>
                </div>
              </div>
              <h3 className="text-[15px] font-bold text-on-surface mb-6 tracking-tight">Advanced Calculus III</h3>
              <div className="flex items-end gap-1.5 h-14">
                <div className="flex-1 bg-tertiary/10 rounded-t-sm h-[70%]"></div>
                <div className="flex-1 bg-tertiary/20 rounded-t-sm h-[40%]"></div>
                <div className="flex-1 bg-tertiary/10 rounded-t-sm h-[30%]"></div>
                <div className="flex-1 bg-tertiary/30 rounded-t-sm h-[50%]"></div>
                <div className="flex-1 bg-tertiary rounded-t-sm h-[75%] shadow-[0_0_15px_rgba(245,158,11,0.2)]"></div>
              </div>
            </div>
            
            {/* Course Card 3 */}
            <div className="bg-surface border border-outline/20 hover:border-secondary/40 transition-all p-6 rounded-2xl group cursor-pointer relative overflow-hidden">
              <div className="flex justify-between items-start mb-8">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">architecture</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-on-surface leading-none">98%</p>
                  <p className="text-[9px] font-bold text-secondary uppercase tracking-[0.1em] mt-1">Exemplary</p>
                </div>
              </div>
              <h3 className="text-[15px] font-bold text-on-surface mb-6 tracking-tight">System Architecture</h3>
              <div className="flex items-end gap-1.5 h-14">
                <div className="flex-1 bg-secondary/10 rounded-t-sm h-[85%]"></div>
                <div className="flex-1 bg-secondary/20 rounded-t-sm h-[92%]"></div>
                <div className="flex-1 bg-secondary/10 rounded-t-sm h-[88%]"></div>
                <div className="flex-1 bg-secondary/30 rounded-t-sm h-[95%]"></div>
                <div className="flex-1 bg-secondary rounded-t-sm h-[100%] shadow-[0_0_15px_rgba(16,185,129,0.2)]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent History Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold tracking-tight text-on-surface">Activity Ledger</h2>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant bg-surface-container px-3 py-1 rounded-full border border-outline/20">Last 72 Hours</span>
          </div>
          <div className="space-y-3">
            {/* History Item 1 */}
            <div className="flex items-center justify-between p-4 bg-surface/50 border border-outline/10 rounded-xl group hover:bg-surface-container/50 hover:border-outline/30 transition-all">
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center justify-center min-w-[40px] border-r border-outline/20 pr-4">
                  <p className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-tighter">OCT</p>
                  <p className="text-xl font-black text-on-surface leading-none">24</p>
                </div>
                <div>
                  <p className="text-[14px] font-bold text-on-surface">Data Structures &amp; Algorithms</p>
                  <p className="text-[11px] text-on-surface-variant font-medium">Dr. Aris Thorne • <span className="text-on-surface/60">L-402 • 09:00 AM</span></p>
                </div>
              </div>
              <div className="px-4 py-1.5 rounded-lg bg-secondary/5 border border-secondary/20">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Present</span>
              </div>
            </div>
            {/* History Item 2 */}
            <div className="flex items-center justify-between p-4 bg-surface/50 border border-outline/10 rounded-xl group hover:bg-surface-container/50 hover:border-outline/30 transition-all">
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center justify-center min-w-[40px] border-r border-outline/20 pr-4">
                  <p className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-tighter">OCT</p>
                  <p className="text-xl font-black text-on-surface leading-none">23</p>
                </div>
                <div>
                  <p className="text-[14px] font-bold text-on-surface">Advanced Calculus III</p>
                  <p className="text-[11px] text-on-surface-variant font-medium">Prof. H. Miller • <span className="text-on-surface/60">M-101 • 01:30 PM</span></p>
                </div>
              </div>
              <div className="px-4 py-1.5 rounded-lg bg-error/5 border border-error/20">
                <span className="text-[10px] font-bold text-error uppercase tracking-widest">Absent</span>
              </div>
            </div>
            {/* History Item 3 */}
            <div className="flex items-center justify-between p-4 bg-surface/50 border border-outline/10 rounded-xl group hover:bg-surface-container/50 hover:border-outline/30 transition-all">
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center justify-center min-w-[40px] border-r border-outline/20 pr-4">
                  <p className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-tighter">OCT</p>
                  <p className="text-xl font-black text-on-surface leading-none">23</p>
                </div>
                <div>
                  <p className="text-[14px] font-bold text-on-surface">System Architecture</p>
                  <p className="text-[11px] text-on-surface-variant font-medium">Sarah Jennings • <span className="text-on-surface/60">S-220 • 10:45 AM</span></p>
                </div>
              </div>
              <div className="px-4 py-1.5 rounded-lg bg-secondary/5 border border-secondary/20">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Present</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-6 py-4 pb-safe bg-background/95 backdrop-blur-xl z-50 border-t border-outline/20">
        <div className="flex flex-col items-center justify-center text-primary group transition-all">
          <div className="bg-primary/10 px-5 py-1.5 rounded-xl mb-1 flex items-center justify-center">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>home</span>
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase">Home</span>
        </div>
        <div className="flex flex-col items-center justify-center text-on-surface-variant hover:text-on-surface transition-all cursor-pointer">
          <span className="material-symbols-outlined mb-1">history</span>
          <span className="text-[10px] font-bold tracking-widest uppercase">History</span>
        </div>
        <div className="flex flex-col items-center justify-center text-on-surface-variant hover:text-on-surface transition-all cursor-pointer">
          <span className="material-symbols-outlined mb-1">school</span>
          <span className="text-[10px] font-bold tracking-widest uppercase">Courses</span>
        </div>
        <div className="flex flex-col items-center justify-center text-on-surface-variant hover:text-on-surface transition-all cursor-pointer">
          <span className="material-symbols-outlined mb-1">person</span>
          <span className="text-[10px] font-bold tracking-widest uppercase">Profile</span>
        </div>
      </nav>
    </div>
  );
}
