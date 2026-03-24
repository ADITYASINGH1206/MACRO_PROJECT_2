import React, { useState } from 'react';

export default function Login({ onLogin, onNavigateToRegister }) {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: role.charAt(0).toUpperCase() + role.slice(1) })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      if (onLogin) {
          onLogin(data.user, data.token);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background font-body min-h-screen flex items-center justify-center selection:bg-primary-container selection:text-primary relative overflow-x-hidden">
      {/* Hero Background Texture (Top Right) */}
      <div className="fixed top-0 right-0 w-[60vw] h-[530px] opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-primary/30 to-transparent blur-[120px]"></div>
      </div>
      
      {/* Main Content Shell */}
      <main className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row items-center justify-center px-6 gap-12 lg:gap-24">
        {/* Branding & Editorial Content Area */}
        <div className="w-full md:w-1/2 flex flex-col space-y-8">
          <header className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <span className="material-symbols-outlined text-4xl">menu_book</span>
              <span className="font-headline font-extrabold tracking-tighter text-2xl text-on-surface">The Scholarly Editorial</span>
            </div>
            <h1 className="font-headline text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-on-surface">
              Curating the <br/><span className="text-primary italic font-light">Intellectual</span> Frontier.
            </h1>
          </header>
          
          <div className="max-w-md space-y-6">
            <p className="text-on-surface-variant text-lg font-light leading-relaxed">
              Welcome back to your private digital archive. Access your curated research, peer reviews, and daily synthesis in a refined scholarly environment.
            </p>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-background object-cover bg-surface-container-highest" alt="scholar" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"/>
                <img className="w-10 h-10 rounded-full border-2 border-background object-cover bg-surface-container-highest" alt="scholar" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150"/>
                <img className="w-10 h-10 rounded-full border-2 border-background object-cover bg-surface-container-highest" alt="scholar" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"/>
              </div>
              <span className="text-sm font-label uppercase tracking-widest text-on-surface-variant">Joined by 4.2k Scholars</span>
            </div>
          </div>
        </div>
        
        {/* Login Form Container */}
        <div className="w-full md:w-[440px]">
          <div className="bg-surface-container-low rounded-xl p-8 lg:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.4)] border border-outline-variant/10 relative overflow-hidden group">
            {/* Subtle Gradient Accent at top */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary to-[#293aa6] opacity-50"></div>
            
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="font-headline text-2xl font-bold text-on-surface">Scholar Sign In</h2>
                <p className="text-on-surface-variant text-sm">Enter your institutional credentials to proceed.</p>
              </div>

              {error && <div className="p-3 rounded-lg bg-error-container/20 border border-error-container text-error text-[0.875rem]">{error}</div>}

              <div className="flex bg-surface-container p-1 rounded-md border border-outline-variant/20">
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

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Input */}
                <div className="space-y-2 group/field">
                  <label className="font-label text-xs uppercase tracking-[0.1em] text-on-surface-variant font-semibold" htmlFor="email">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg transition-colors group-focus-within/field:text-primary">alternate_email</span>
                    <input 
                      className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant/40 focus:border-primary focus:ring-0 text-on-surface py-3.5 pl-12 pr-4 rounded-t-lg transition-all duration-300 placeholder:text-outline/40" 
                      id="email" 
                      placeholder={role === 'faculty' ? 'scholar@university.edu' : 'student@university.edu'} 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Password Input */}
                <div className="space-y-2 group/field">
                  <div className="flex justify-between items-center">
                    <label className="font-label text-xs uppercase tracking-[0.1em] text-on-surface-variant font-semibold" htmlFor="password">Password</label>
                    <a className="text-[10px] uppercase tracking-wider text-primary hover:text-on-primary-container transition-colors" href="#">Forgot Password?</a>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg transition-colors group-focus-within/field:text-primary">lock</span>
                    <input 
                      className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant/40 focus:border-primary focus:ring-0 text-on-surface py-3.5 pl-12 pr-4 rounded-t-lg transition-all duration-300 placeholder:text-outline/40" 
                      id="password" 
                      placeholder="••••••••" 
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Sign In Button */}
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-tr from-primary to-[#293aa6] text-on-primary font-headline font-bold text-sm tracking-wide rounded-lg shadow-xl shadow-primary/10 hover:opacity-90 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  <span>{loading ? 'Initializing...' : 'Initialize Session'}</span>
                  {!loading && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
                </button>
              </form>
              
              {/* Divider */}
              <div className="flex items-center gap-4 py-2">
                <div className="h-[1px] flex-1 bg-outline-variant/20"></div>
                <span className="font-label text-[10px] uppercase tracking-widest text-outline/60">Institutional Login</span>
                <div className="h-[1px] flex-1 bg-outline-variant/20"></div>
              </div>
              
              <div className="text-center text-on-surface-variant text-xs pt-4">
                New to the library? 
                <button 
                  onClick={onNavigateToRegister}
                  type="button"
                  className="text-primary font-semibold hover:underline underline-offset-4 ml-1"
                >
                  Request Access
                </button>
              </div>
            </div>
          </div>
          
          {/* Trust Badges */}
          <div className="mt-8 flex justify-center items-center gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-80 transition-all duration-500">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span className="text-[10px] uppercase tracking-widest font-medium">End-to-End Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">account_balance</span>
              <span className="text-[10px] uppercase tracking-widest font-medium">Internal Secure</span>
            </div>
          </div>
        </div>
      </main>
      
      {/* Background Decoration */}
      <div className="fixed bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none"></div>
      
      {/* Minimalistic Footer */}
      <footer className="fixed bottom-8 left-0 w-full px-12 flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-outline/40 font-medium z-20">
        <div>© 2026 Scholar Slate Editorial</div>
        <div className="flex gap-8">
          <a className="hover:text-primary transition-colors" href="#">Privacy Protocol</a>
          <a className="hover:text-primary transition-colors" href="#">Archive Status</a>
        </div>
      </footer>
    </div>
  );
}
