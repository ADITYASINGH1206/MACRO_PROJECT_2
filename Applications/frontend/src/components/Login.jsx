import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
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
        body: JSON.stringify({ email, role })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Login failed or user not found');
      
      onLogin(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060e20] p-4 font-sans">
      <div className="w-full max-w-md bg-[#131b2e] rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] p-8 border border-[#2d3449]">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-lg bg-gradient-to-br from-[#8083ff] to-[#c0c1ff] items-center justify-center mb-5 shadow-[0_0_20px_rgba(192,193,255,0.2)]">
            <span className="text-[1.5rem] font-bold text-[#1000a9] uppercase tracking-widest">FR</span>
          </div>
          <h1 className="text-[2rem] text-[#dae2fd] font-medium tracking-tight">Scholarly Login</h1>
          <p className="text-[#c7c4d7] text-[0.875rem] mt-2">Enter credentials to securely authenticate</p>
        </div>

        {error && <div className="mb-6 p-3 rounded bg-[#93000a]/20 border border-[#93000a] text-[#ffb4ab] text-[0.875rem]">{error}</div>}

        <div className="flex bg-[#171f33] p-1 rounded-md border border-[#2d3449] mb-6">
          <button 
            type="button"
            className={`flex-1 py-2 text-[0.875rem] font-medium transition-colors rounded ${role === 'student' ? 'bg-[#2d3449] text-[#dae2fd]' : 'text-[#c7c4d7] hover:text-[#dae2fd]'}`}
            onClick={() => setRole('student')}
          >
            Student
          </button>
          <button 
            type="button"
            className={`flex-1 py-2 text-[0.875rem] font-medium transition-colors rounded ${role === 'faculty' ? 'bg-[#2d3449] text-[#dae2fd]' : 'text-[#c7c4d7] hover:text-[#dae2fd]'}`}
            onClick={() => setRole('faculty')}
          >
            Faculty
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[0.875rem] font-medium text-[#c7c4d7] mb-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0b1326] border border-[#2d3449] rounded-md px-4 py-3 text-[#dae2fd] focus:outline-none focus:border-[#8083ff] focus:ring-1 focus:ring-[#8083ff] transition-all"
              placeholder={role === 'faculty' ? 'professor@university.edu' : 'student@university.edu'}
            />
          </div>
          <div>
            <label className="block text-[0.875rem] font-medium text-[#c7c4d7] mb-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-[#0b1326] border border-[#2d3449] rounded-md px-4 py-3 text-[#dae2fd] focus:outline-none focus:border-[#8083ff] focus:ring-1 focus:ring-[#8083ff] transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-br from-[#8083ff] to-[#c0c1ff] text-[#1000a9] py-3 rounded-md font-medium shadow-[0_0_15px_rgba(192,193,255,0.15)] hover:shadow-[0_0_20px_rgba(192,193,255,0.3)] transition-all disabled:opacity-70 mt-2"
          >
            {loading ? 'Authenticating...' : 'Secure Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
