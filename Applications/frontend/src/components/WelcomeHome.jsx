import React from 'react';

export default function WelcomeHome({ onNavigateToLogin, onNavigateToRegister, isDarkMode }) {
  const styles = {
    surface: isDarkMode ? 'bg-[#0A0F1C]' : 'bg-[#f8f9fc]',
    textPrimary: isDarkMode ? 'text-[#F8FAFC]' : 'text-[#1e293b]',
    textSecondary: isDarkMode ? 'text-[#94a3b8]' : 'text-[#64748b]',
    accentPrimary: 'text-[#8283ff]',
    accentSecondary: 'text-[#4edea3]',
  };

  return (
    <div className={`min-h-screen ${styles.surface} ${styles.textPrimary} font-sans selection:bg-primary/20 overflow-hidden relative`}>
      {/* Background Orbs */}
      <div className="absolute top-0 -left-48 w-[600px] h-[600px] bg-[#8083ff]/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-0 -right-48 w-[500px] h-[500px] bg-[#4edea3]/5 rounded-full blur-[100px]"></div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/10 px-8 pt-8 pb-6 flex items-center justify-between" style={{backgroundColor: isDarkMode ? 'rgba(10,15,28,0.85)' : 'rgba(248,249,252,0.85)'}}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8083ff] to-[#c0c1ff] flex items-center justify-center shadow-lg shadow-[#8083ff]/20">
            <span className="material-symbols-outlined text-white">architecture</span>
          </div>
          <h1 className="text-lg font-black tracking-[-0.04em] uppercase">Scholar <span className={styles.accentPrimary}>Slate Pro</span></h1>
        </div>
        <div className="flex gap-8">
          <button onClick={onNavigateToLogin} className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-all duration-200">Intelligence Entry</button>
          <button onClick={onNavigateToRegister} className={`px-6 py-2.5 rounded-xl border border-white/10 ${styles.accentPrimary} text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/5 hover:border-white/20 transition-all duration-200`}>Request Access</button>
        </div>
      </nav>

      <main className="relative pt-48 pb-24 px-8 max-w-[1200px] mx-auto flex flex-col items-center text-center">
        {/* Hero Section */}
        <div className="space-y-12 animate-fade-up">
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
              className="px-12 py-6 bg-gradient-to-r from-[#8283ff] to-[#a5b4fc] text-white font-bold text-sm uppercase tracking-[0.2em] rounded-2xl shadow-[0_0_32px_rgba(130,131,255,0.3)] hover:shadow-[0_0_48px_rgba(130,131,255,0.45)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
            >
              Initialize Identity
            </button>
            <button 
              onClick={onNavigateToLogin}
              className={`px-12 py-6 ${isDarkMode ? 'bg-[#111A2C]' : 'bg-white'} border border-white/10 font-bold text-sm uppercase tracking-[0.2em] rounded-2xl hover:border-white/20 hover:bg-white/5 transition-all duration-200 shadow-premium`}
            >
              Access Portal
            </button>
          </div>
        </div>

        {/* Core Pillars */}
        <section className="mt-48 grid grid-cols-1 md:grid-cols-3 gap-12 w-full text-left stagger">
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
            <div key={idx} className={`animate-fade-up ${isDarkMode ? 'bg-[#111A2C]' : 'bg-white'} p-10 rounded-[2.5rem] border border-white/[0.07] shadow-premium hover:shadow-premium-lg hover:-translate-y-2 hover:border-white/[0.12] transition-all duration-200 group`}>
              <div className={`w-14 h-14 rounded-2xl ${isDarkMode ? 'bg-[#0A0F1C]' : 'bg-[#f1f3f9]'} flex items-center justify-center mb-10 border border-white/10 group-hover:scale-110 transition-all duration-200 shadow-inner`}>
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
