import React from 'react';

export default function WelcomeHome({ onNavigateToLogin, onNavigateToRegister, isDarkMode }) {
  const styles = {
    surface: isDarkMode ? 'bg-[#0b1326]' : 'bg-[#f8f9fc]',
    textPrimary: isDarkMode ? 'text-[#dae2fd]' : 'text-[#1e293b]',
    textSecondary: isDarkMode ? 'text-[#c7c4d7]' : 'text-[#64748b]',
    accentPrimary: 'text-[#c0c1ff]',
    accentSecondary: 'text-[#4edea3]',
  };

  return (
    <div className={`min-h-screen ${styles.surface} ${styles.textPrimary} font-inter selection:bg-[#c0c1ff]/30 overflow-hidden relative`}>
      {/* Background Orbs */}
      <div className="absolute top-0 -left-48 w-[600px] h-[600px] bg-[#8083ff]/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-0 -right-48 w-[500px] h-[500px] bg-[#4edea3]/5 rounded-full blur-[100px]"></div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-opacity-80 backdrop-blur-xl border-b border-white/5 px-8 pt-8 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8083ff] to-[#c0c1ff] flex items-center justify-center shadow-lg shadow-[#8083ff]/20">
            <span className="material-symbols-outlined text-white">architecture</span>
          </div>
          <h1 className="text-lg font-black tracking-[-0.04em] uppercase">Scholar <span className={styles.accentPrimary}>Slate Pro</span></h1>
        </div>
        <div className="flex gap-8">
          <button onClick={onNavigateToLogin} className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-opacity">Intelligence Entry</button>
          <button onClick={onNavigateToRegister} className={`px-6 py-2.5 rounded-xl border border-[#c0c1ff]/20 ${styles.accentPrimary} text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#c0c1ff]/5 transition-all`}>Request Access</button>
        </div>
      </nav>

      <main className="relative pt-48 pb-24 px-8 max-w-[1200px] mx-auto flex flex-col items-center text-center">
        {/* Hero Section */}
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
            <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-70">Identity-First Academic Management</span>
          </div>
          
          <h2 className="text-[8rem] font-black tracking-[-0.07em] leading-[0.8] mb-12">
            Institutional<br/>
            <span className={`bg-gradient-to-br from-[#8083ff] to-[#c0c1ff] bg-clip-text text-transparent`}>Integrity</span>
          </h2>
          
          <p className={`${styles.textSecondary} text-2xl font-light max-w-2xl mx-auto leading-relaxed`}>
            A sophisticated ecosystem for biometric attendance, scholarly analytics, and multi-portal academic synchronization.
          </p>

          <div className="pt-12 flex flex-col sm:flex-row items-center justify-center gap-8">
            <button 
              onClick={onNavigateToRegister}
              className="px-12 py-6 bg-gradient-to-r from-[#8083ff] to-[#c0c1ff] text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-[#8083ff]/30 hover:scale-[1.05] active:scale-[0.98] transition-all"
            >
              Initialize Identity
            </button>
            <button 
              onClick={onNavigateToLogin}
              className={`px-12 py-6 ${isDarkMode ? 'bg-[#171f33]' : 'bg-white'} border border-white/10 font-black text-sm uppercase tracking-[0.2em] rounded-2xl hover:bg-white/5 transition-all shadow-xl`}
            >
              Access Portal
            </button>
          </div>
        </div>

        {/* Core Pillars */}
        <section className="mt-48 grid grid-cols-1 md:grid-cols-3 gap-12 w-full text-left">
          {[
            {
              icon: 'fingerprint',
              title: 'Biometric Ops',
              desc: 'Seamless facial recognition and identity verification with sub-millisecond precision.',
              color: 'text-[#4edea3]'
            },
            {
              icon: 'monitoring',
              title: 'Data Velocity',
              desc: 'Real-time scholastic analytics delivering actionable insights to faculty and scholars.',
              color: 'text-[#c0c1ff]'
            },
            {
              icon: 'security',
              title: 'Vault Security',
              desc: 'Enterprise-grade encryption protecting institutional data and personal academic records.',
              color: 'text-[#ffb783]'
            }
          ].map((item, idx) => (
            <div key={idx} className={`${isDarkMode ? 'bg-[#131b2e]' : 'bg-white'} p-10 rounded-[2.5rem] border border-white/5 shadow-2xl hover:translate-y-[-8px] transition-all group`}>
              <div className={`w-14 h-14 rounded-2xl ${isDarkMode ? 'bg-[#171f33]' : 'bg-[#f1f3f9]'} flex items-center justify-center mb-10 border border-white/5 group-hover:scale-110 transition-all shadow-inner`}>
                <span className={`material-symbols-outlined text-3xl ${item.color}`}>{item.icon}</span>
              </div>
              <h3 className="text-xl font-black mb-4 tracking-tight">{item.title}</h3>
              <p className={`${styles.textSecondary} text-sm font-medium leading-[1.8]`}>{item.desc}</p>
            </div>
          ))}
        </section>

        {/* Institutional Summary */}
        <footer className="mt-48 w-full border-t border-white/5 pt-24 pb-12 flex flex-col md:flex-row justify-between items-center gap-12">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">© 2026 Scholar Slate Institutional Hub</p>
          <div className="flex gap-12">
             <span className="text-[11px] font-bold opacity-40 hover:opacity-100 cursor-pointer transition-opacity">PROTOCOL</span>
             <span className="text-[11px] font-bold opacity-40 hover:opacity-100 cursor-pointer transition-opacity">ACCESSIBILITY</span>
             <span className="text-[11px] font-bold opacity-40 hover:opacity-100 cursor-pointer transition-opacity">INTELLECT</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
