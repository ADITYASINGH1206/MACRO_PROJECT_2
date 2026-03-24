import React from 'react';

export default function FacultyDashboard({ user, onLogout }) {
  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary/30 selection:text-primary min-h-screen relative overflow-x-hidden">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#11131c] dark:bg-[#11131c] border-b border-[#46464c]/20">
        <div className="flex justify-between items-center px-6 py-4 w-full">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#bbc3ff]">menu_book</span>
            <span className="text-xl font-bold tracking-tighter text-[#e1e1ef] dark:text-[#e1e1ef] font-headline">The Scholarly Editorial</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <button className="text-[#bbc3ff] font-semibold font-['Inter'] text-sm tracking-wide transition-colors duration-300">Curate</button>
            <button className="text-[#90909a] hover:text-[#e1e1ef] font-['Inter'] text-sm tracking-wide transition-colors duration-300">Research</button>
            <button className="text-[#90909a] hover:text-[#e1e1ef] font-['Inter'] text-sm tracking-wide transition-colors duration-300">Library</button>
          </nav>
          <div className="flex items-center gap-4 border-l border-outline/20 pl-4">
            <div className="text-right hidden sm:block">
              <div className="text-[0.875rem] font-bold text-on-surface">{user?.name || "Dr. Julian Vane"}</div>
              <div className="text-[0.625rem] text-primary uppercase tracking-widest">{user?.role || "Faculty"}</div>
            </div>
            <button onClick={onLogout} className="px-5 py-2 text-sm font-medium text-error hover:bg-error/10 transition-all rounded-lg">Logout</button>
          </div>
        </div>
      </header>
      
      <main className="relative pt-16">
        {/* Hero Section: The Editorial Cover */}
        <section className="relative min-h-[795px] flex flex-col justify-center px-6 md:px-12 py-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-10"></div>
            <img 
              className="w-full h-full object-cover opacity-30 grayscale" 
              alt="library" 
              src="https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=1600"
            />
          </div>
          <div className="relative z-20 max-w-5xl mx-auto md:mx-0">
            <div className="inline-block px-3 py-1 mb-6 border border-primary/20 bg-primary/5 rounded-full">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Volume IV • Issue II</span>
            </div>
            <h1 className="font-headline font-extrabold text-5xl md:text-8xl tracking-tight leading-[0.9] text-on-surface mb-8">
              The Digital <br/><span className="text-primary italic font-light">Curator.</span>
            </h1>
            <p className="max-w-2xl text-lg md:text-xl text-on-surface-variant leading-relaxed mb-10 font-light">
              A private research sanctuary designed for the modern scholar. Transcending basic data storage into a fluid, intentional ecosystem where synthesis meets aesthetic rigor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-primary text-on-primary font-bold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(187,195,255,0.3)] hover:-translate-y-1">Initialize Collection</button>
              <button className="px-8 py-4 border border-outline-variant text-on-surface font-semibold rounded-xl hover:bg-surface-variant transition-colors">Review Documentation</button>
            </div>
          </div>
          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
            <span className="material-symbols-outlined">expand_more</span>
          </div>
        </section>

        {/* Bento Grid: Curated Features */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Large Feature Card */}
            <div className="md:col-span-8 bg-surface-container-low rounded-3xl p-10 flex flex-col justify-between min-h-[400px] border border-outline-variant/10">
              <div>
                <span className="material-symbols-outlined text-primary text-4xl mb-6">auto_awesome</span>
                <h3 className="font-headline text-3xl font-bold mb-4">Semantic Synthesis</h3>
                <p className="text-on-surface-variant text-lg max-w-md">Our engine doesn't just store papers; it builds a mental map of your intellectual progress, suggesting peer-reviewed connections you haven't seen yet.</p>
              </div>
              <div className="mt-8 pt-8 border-t border-outline-variant/20 flex items-center justify-between">
                <span className="text-sm font-label tracking-widest uppercase text-outline">Faculty Verified</span>
                <span className="material-symbols-outlined text-primary">north_east</span>
              </div>
            </div>
            
            {/* Tall Feature Card */}
            <div className="md:col-span-4 bg-gradient-to-br from-surface-container-highest to-surface-container rounded-3xl p-8 border border-outline-variant/10 flex flex-col justify-between">
              <div>
                <h3 className="font-headline text-2xl font-bold mb-6">Archival Integrity</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <span className="material-symbols-outlined text-secondary">verified_user</span>
                    <div>
                      <h4 className="font-bold text-sm">Blockchain Citations</h4>
                      <p className="text-xs text-on-surface-variant mt-1">Immutable proof of your scholarly findings and temporal data points.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="material-symbols-outlined text-secondary">encrypted</span>
                    <div>
                      <h4 className="font-bold text-sm">Dark-Cloud Privacy</h4>
                      <p className="text-xs text-on-surface-variant mt-1">End-to-end encrypted research vaults accessible only by your biometric key.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 overflow-hidden rounded-xl h-32 relative">
                <img 
                  className="w-full h-full object-cover opacity-50" 
                  alt="abstract" 
                  src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800"
                />
              </div>
            </div>
            
            {/* Smaller Grid Items */}
            <div className="md:col-span-4 bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-tertiary text-4xl mb-4">history_edu</span>
              <h4 className="font-headline font-bold text-xl mb-2">Refined Typography</h4>
              <p className="text-sm text-on-surface-variant">A reading experience optimized for focus and visual longevity.</p>
            </div>
            <div className="md:col-span-4 bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-tertiary text-4xl mb-4">groups</span>
              <h4 className="font-headline font-bold text-xl mb-2">Peer Synthesis</h4>
              <p className="text-sm text-on-surface-variant">Collaborative environments that feel like a private lounge, not a chat room.</p>
            </div>
            <div className="md:col-span-4 bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-tertiary text-4xl mb-4">layers</span>
              <h4 className="font-headline font-bold text-xl mb-2">Tiered Layers</h4>
              <p className="text-sm text-on-surface-variant">Asymmetrical data views for complex cross-referencing of sources.</p>
            </div>
          </div>
        </section>

        {/* The "Slate" Annotation */}
        <section className="py-24 bg-surface-container-lowest relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
              <h2 className="font-headline text-4xl md:text-5xl font-bold mb-6 leading-tight">Interaction that <br/><span className="text-primary italic">breathes.</span></h2>
              <p className="text-on-surface-variant text-lg mb-8">Traditional dashboards trap you in grids. The Scholar Slate uses tonal layering to give your research physical presence.</p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <span className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0"></span>
                  <p className="text-on-surface font-medium">No-Line structural philosophy for cognitive clarity.</p>
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0"></span>
                  <p className="text-on-surface font-medium">Asymmetrical margins that mirror high-end editorial layouts.</p>
                </li>
              </ul>
            </div>
            <div className="w-full lg:w-1/2 relative">
              <div className="bg-surface rounded-3xl shadow-2xl border border-outline-variant/20 aspect-video relative overflow-hidden p-8">
                <div className="w-2/3 h-full space-y-4">
                  <div className="h-4 w-1/4 bg-surface-container-highest rounded"></div>
                  <div className="h-32 w-full bg-surface-container-low rounded-xl"></div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-surface-container-highest rounded"></div>
                    <div className="h-2 w-5/6 bg-surface-container-highest rounded"></div>
                    <div className="h-2 w-4/6 bg-surface-container-highest rounded"></div>
                  </div>
                </div>
                {/* Floating Slate Annotation */}
                <div className="absolute top-1/2 right-4 -translate-y-1/2 w-64 bg-surface-container-lowest/60 backdrop-blur-md p-6 rounded-2xl border border-primary/20 shadow-2xl">
                  <h5 className="font-bold text-primary text-xs uppercase tracking-widest mb-3">Slate Annotation</h5>
                  <p className="text-[11px] leading-relaxed text-on-surface mb-4">"The intersection of archival data and modern UX creates a 'flow state' for academic writing."</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-secondary"></div>
                    <span className="text-[10px] text-outline">Dr. Julian Vane</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-headline text-4xl md:text-6xl font-bold mb-8">Ready to curate your legacy?</h2>
            <p className="text-on-surface-variant text-xl mb-12 font-light">Join an elite cohort of scholars redefining the digital workspace.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <button className="px-10 py-5 bg-primary text-on-primary font-bold rounded-xl text-lg shadow-2xl shadow-primary/20 hover:scale-105 transition-transform">Get Started Today</button>
              <button className="px-10 py-5 border border-outline text-on-surface font-bold rounded-xl text-lg hover:bg-surface-variant transition-colors">Request Institutional Access</button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-surface-container-lowest py-20 px-6 border-t border-outline-variant/10 relative z-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary">menu_book</span>
                <span className="text-lg font-bold tracking-tighter text-[#e1e1ef] font-headline">The Scholarly Editorial</span>
              </div>
              <p className="text-on-surface-variant max-w-sm mb-8">A nocturnal ecosystem for the rigorous mind. Designed in London, hosted in the cloud, preserved for the future.</p>
              <div className="flex gap-4">
                <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary/10 transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-sm">language</span>
                </button>
                <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary/10 transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-sm">share</span>
                </button>
              </div>
            </div>
            <div>
              <h5 className="font-bold text-sm uppercase tracking-widest mb-6">Platform</h5>
              <ul className="space-y-4 text-on-surface-variant text-sm">
                <li><button className="hover:text-primary transition-colors">Synthesis Engine</button></li>
                <li><button className="hover:text-primary transition-colors">Archival Storage</button></li>
                <li><button className="hover:text-primary transition-colors">Peer Networks</button></li>
                <li><button className="hover:text-primary transition-colors">Typography Lab</button></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-sm uppercase tracking-widest mb-6">Institution</h5>
              <ul className="space-y-4 text-on-surface-variant text-sm">
                <li><button className="hover:text-primary transition-colors">Ethics Charter</button></li>
                <li><button className="hover:text-primary transition-colors">Privacy Policy</button></li>
                <li><button className="hover:text-primary transition-colors">Scholar Program</button></li>
                <li><button className="hover:text-primary transition-colors">Security Audit</button></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-outline">
            <span>© 2026 Scholar Slate. All Rights Reserved.</span>
            <span className="tracking-[0.3em] uppercase">V.4.2.0 "Nocturnal"</span>
          </div>
        </footer>
      </main>

      {/* BottomNavBar (Mobile) */}
      <nav className="md:hidden bg-background/60 backdrop-blur-md fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-2 z-50 border-t border-[#46464c]/20 shadow-[0_-12px_40px_rgba(225,225,239,0.06)]">
        <button className="flex flex-col items-center justify-center text-[#90909a] opacity-60 hover:text-[#e1e1ef] transition-all scale-95 active:scale-90">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-['Inter'] text-[10px] uppercase tracking-[0.05em] font-medium mt-1">Curate</span>
        </button>
        <button className="flex flex-col items-center justify-center text-[#90909a] opacity-60 hover:text-[#e1e1ef] transition-all scale-95 active:scale-90">
          <span className="material-symbols-outlined">menu_book</span>
          <span className="font-['Inter'] text-[10px] uppercase tracking-[0.05em] font-medium mt-1">Research</span>
        </button>
        <button className="flex flex-col items-center justify-center text-[#90909a] opacity-60 hover:text-[#e1e1ef] transition-all scale-95 active:scale-90">
          <span className="material-symbols-outlined">collections_bookmark</span>
          <span className="font-['Inter'] text-[10px] uppercase tracking-[0.05em] font-medium mt-1">Library</span>
        </button>
        <button className="flex flex-col items-center justify-center text-[#90909a] opacity-60 hover:text-[#e1e1ef] transition-all scale-95 active:scale-90">
          <span className="material-symbols-outlined">account_circle</span>
          <span className="font-['Inter'] text-[10px] uppercase tracking-[0.05em] font-medium mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
}
