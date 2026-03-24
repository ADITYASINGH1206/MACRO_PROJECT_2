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
    <div className="min-h-screen flex items-center justify-center bg-[#060e20] p-4 font-sans">
      <div className="w-full max-w-md bg-[#131b2e] rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] p-8 border border-[#2d3449]">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-lg bg-gradient-to-br from-[#8083ff] to-[#c0c1ff] items-center justify-center mb-5 shadow-[0_0_20px_rgba(192,193,255,0.2)]">
            <span className="text-[1.5rem] font-bold text-[#1000a9] uppercase tracking-widest">FR</span>
          </div>
          <h1 className="text-[2rem] text-[#dae2fd] font-medium tracking-tight">Create Account</h1>
          <p className="text-[#c7c4d7] text-[0.875rem] mt-2">Join the Facial Recognition platform</p>
        </div>

        {error && <div className="mb-6 p-3 rounded-lg bg-[#93000a]/20 border border-[#93000a] text-[#ffb4ab] text-[0.875rem]">{error}</div>}

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

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-[0.875rem] font-medium text-[#c7c4d7] mb-1">Full Name</label>
            <input 
              type="text" 
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#0b1326] border border-[#2d3449] rounded-md px-4 py-3 text-[#dae2fd] focus:outline-none focus:border-[#8083ff] focus:ring-1 focus:ring-[#8083ff] transition-all"
              placeholder="John Doe"
            />
          </div>
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
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0b1326] border border-[#2d3449] rounded-md px-4 py-3 text-[#dae2fd] focus:outline-none focus:border-[#8083ff] focus:ring-1 focus:ring-[#8083ff] transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-br from-[#8083ff] to-[#c0c1ff] text-[#1000a9] py-3 rounded-md font-medium shadow-[0_0_15px_rgba(192,193,255,0.15)] hover:shadow-[0_0_20px_rgba(192,193,255,0.3)] transition-all disabled:opacity-70"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-[#908fa0] text-[0.875rem]">
                Already have an account?{' '}
                <button 
                  onClick={onNavigateToLogin}
                  className="text-[#8083ff] hover:text-[#c0c1ff] font-medium transition-colors"
                >
                    Sign In
                </button>
            </p>
        </div>
      </div>
    </div>
  );
}
