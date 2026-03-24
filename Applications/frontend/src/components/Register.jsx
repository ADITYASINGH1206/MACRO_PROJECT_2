import React, { useState } from 'react';

export default function Register({ onRegister, onNavigateToLogin }) {
  const [role, setRole] = useState('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, password, role })
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      
      // Successfully registered, pass the user object back up
      if (onRegister) {
          onRegister(data.user, data.token);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary/30 min-h-screen flex flex-col items-center justify-center overflow-x-hidden relative">
      {/* Hero Visual Background (Asymmetric Overlay) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[120%] bg-surface-container-lowest rotate-6 rounded-[4rem] opacity-50"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[80%] bg-primary-container/20 -rotate-12 rounded-full blur-[120px]"></div>
        <img 
          className="absolute top-12 right-12 w-96 h-96 object-cover rounded-xl opacity-20 grayscale brightness-50 mix-blend-luminosity" 
          alt="Detail of high-end library shelving" 
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1200"
        />
      </div>

      {/* Main Registration Container */}
      <main className="relative z-10 w-full max-w-6xl px-6 py-12 flex flex-col md:flex-row gap-16 items-center">
        {/* Left Column: Editorial Brand Presence */}
        <div className="w-full md:w-1/2 flex flex-col space-y-8">
          <header className="space-y-2">
            <div className="flex items-center gap-3 text-primary mb-6">
              <span className="material-symbols-outlined text-4xl">menu_book</span>
              <span className="font-headline font-bold text-2xl tracking-tighter text-on-surface">The Scholarly Editorial</span>
            </div>
            <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-on-surface">
              Join the Elite <br/>
              <span className="text-primary italic">Circle of Inquiry.</span>
            </h1>
            <p className="text-on-surface-variant text-lg max-w-md leading-relaxed pt-4">
              Access a curated ecosystem designed for high-impact synthesis, archival research, and peer collaboration.
            </p>
          </header>
          
          <div className="space-y-6 pt-8 border-t border-outline-variant/20 max-w-sm">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary-fixed-dim">verified</span>
              <div>
                <h3 className="font-headline font-semibold text-on-surface">Verified Credentials</h3>
                <p className="text-sm text-on-surface-variant">Secure institutional verification for academic integrity.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary-fixed-dim">auto_awesome</span>
              <div>
                <h3 className="font-headline font-semibold text-on-surface">Daily Synthesis</h3>
                <p className="text-sm text-on-surface-variant">Automated editorial summaries of the latest peer reviews.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column: Registration Form */}
        <div className="w-full md:w-1/2">
          <div className="bg-surface-container-low rounded-xl p-8 md:p-12 shadow-[0_12px_40px_rgba(0,0,0,0.4)] relative border border-outline-variant/10">
            <div className="mb-10">
              <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight">Scholar Registration</h2>
              <p className="text-on-surface-variant text-sm mt-1">Initialize your digital research portfolio.</p>
            </div>
            
            {error && <div className="mb-6 p-3 rounded-lg bg-error-container/20 border border-error-container text-error text-[0.875rem]">{error}</div>}

            <div className="flex bg-surface-container p-1 rounded-md border border-outline-variant/20 mb-6">
              <button 
                type="button"
                className={`flex-1 py-2 text-[0.875rem] font-medium transition-colors rounded ${role === 'student' ? 'bg-surface-container-highest text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}
                onClick={() => setRole('student')}
              >
                Student
              </button>
              <button 
                type="button"
                className={`flex-1 py-2 text-[0.875rem] font-medium transition-colors rounded ${role === 'faculty' ? 'bg-surface-container-highest text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}
                onClick={() => setRole('faculty')}
              >
                Faculty
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="font-label text-[10px] uppercase tracking-[0.1em] font-semibold text-primary/80 ml-1">Full Name</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg transition-colors group-focus-within:text-primary">person</span>
                  <input 
                    className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant/30 py-4 pl-12 pr-4 text-on-surface placeholder:text-outline/40 focus:ring-0 focus:border-primary transition-all rounded-t-lg" 
                    placeholder="Dr. Julian Vane" 
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="font-label text-[10px] uppercase tracking-[0.1em] font-semibold text-primary/80 ml-1">Institutional Email</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg group-focus-within:text-primary">alternate_email</span>
                    <input 
                      className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant/30 py-4 pl-12 pr-4 text-on-surface placeholder:text-outline/40 focus:ring-0 focus:border-primary transition-all rounded-t-lg" 
                      placeholder={role === 'faculty' ? 'professor@university.edu' : 'student@university.edu'} 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="font-label text-[10px] uppercase tracking-[0.1em] font-semibold text-primary/80 ml-1">Password</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg group-focus-within:text-primary">lock</span>
                  <input 
                    className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant/30 py-4 pl-12 pr-12 text-on-surface placeholder:text-outline/40 focus:ring-0 focus:border-primary transition-all rounded-t-lg" 
                    placeholder="••••••••••••" 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-primary-fixed-dim py-4 rounded-xl font-headline font-bold text-on-primary tracking-wide shadow-lg shadow-primary/10 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-8 disabled:opacity-70"
              >
                {loading ? 'Creating...' : 'Create Account'}
                {!loading && <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_right_alt</span>}
              </button>
            </form>
            
            <div className="mt-10 pt-8 border-t border-outline-variant/10 text-center">
              <p className="text-on-surface-variant text-sm">
                Already a Fellow? 
                <button 
                  onClick={onNavigateToLogin}
                  type="button"
                  className="text-primary font-semibold ml-1 hover:underline underline-offset-4 transition-all"
                >
                  Sign in to your Archive
                </button>
              </p>
            </div>
          </div>
          
          {/* Footer Meta */}
          <div className="mt-8 flex justify-between px-2">
            <div className="flex gap-4">
              <a className="text-[10px] uppercase tracking-widest text-outline hover:text-on-surface transition-colors" href="#">Privacy</a>
              <a className="text-[10px] uppercase tracking-widest text-outline hover:text-on-surface transition-colors" href="#">Terms</a>
              <a className="text-[10px] uppercase tracking-widest text-outline hover:text-on-surface transition-colors" href="#">Help</a>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-outline/60">EST. 2026</p>
          </div>
        </div>
      </main>
      
      {/* Decorative Top Accent Line */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
    </div>
  );
}
