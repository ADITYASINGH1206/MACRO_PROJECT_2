import React, { useState, useEffect } from 'react';
import { Shield, Fingerprint, ChevronRight, LogOut, Loader2, UserPlus } from 'lucide-react';
import { supabase } from './lib/supabase.js';
import FacultyDashboard from './pages/FacultyDashboard.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';

function App() {
  const [role, setRole] = useState('faculty');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [session, setSession] = useState(null);

  // Check active session on mount
  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!supabase) {
      setError('Supabase is not configured. Please add keys to the .env file.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (isSignUp) {
        // Handle Signup
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: role, // Save the selected role into user metadata
            }
          }
        });

        if (error) throw error;

        if (data.user && data.user.identities && data.user.identities.length === 0) {
          setError('This email is already registered. Please sign in instead.');
        } else {
          setSuccessMsg('Registration successful! Check your email for a confirmation link (if enabled in your project) or login now.');
          setIsSignUp(false); // Switch to login view
        }

      } else {
        // Handle Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      }
    } catch (err) {
      // Student Account Claiming Flow
      if (isSignUp && role === 'student' && err.message.toLowerCase().includes('already registered')) {
        const { data: claimData, error: claimError } = await supabase.auth.signInWithPassword({
          email,
          password: 'password123'
        });
        
        if (!claimError && claimData?.user) {
          // Successfully logged into the default faculty-created account
          const { error: updateError } = await supabase.auth.updateUser({ password: password });
          if (!updateError) {
            setSuccessMsg('Account claimed successfully! Welcome.');
            setError(''); 
            return; // Exit out, let the session auto-route
          }
        }
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSession(null);
  };

  // If user is logged in, route to the correct dashboard based on role
  if (session) {
    const userRole = session.user.user_metadata?.role || 'student';

    if (userRole === 'faculty') {
      return <FacultyDashboard session={session} onLogout={handleLogout} />;
    }
    return <StudentDashboard session={session} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex flex-col items-center justify-center p-6 font-sans">
      
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#4f46e5] rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4cd7f6] rounded-full mix-blend-screen filter blur-[100px] opacity-10"></div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md mt-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#131b2e] border border-[#2d3449] mb-6 shadow-[0px_24px_48px_rgba(0,0,0,0.4)] relative">
            <Shield className="w-8 h-8 text-[#4cd7f6]" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#ddb8ff] rounded-full border-2 border-[#131b2e]"></div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Ethereal Sentinel
          </h1>
          <p className="text-[#c7c4d8] text-sm">Biometric Attendance Interface</p>
        </div>

        {/* Login Form Container */}
        <div className="bg-[#131b2e] rounded-3xl p-8 shadow-[0px_24px_48px_rgba(0,0,0,0.5)] border border-[#2d3449]/50 backdrop-blur-xl">
          
          <h2 className="text-xl font-semibold mb-6 text-center text-white">
            {isSignUp ? 'Create Credentials' : 'Secure Sign In'}
          </h2>

          {/* Role Toggle */}
          <div className="flex p-1 bg-[#060e20] rounded-xl mb-6">
            <button 
              onClick={() => setRole('faculty')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${role === 'faculty' ? 'bg-[#2d3449] text-white shadow-md' : 'text-[#918fa1] hover:text-[#dae2fd]'}`}
            >
              Faculty
            </button>
            <button 
              onClick={() => setRole('student')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${role === 'student' ? 'bg-[#2d3449] text-white shadow-md' : 'text-[#918fa1] hover:text-[#dae2fd]'}`}
            >
              Student
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleAuth}>
            <div>
              <label className="block text-xs font-semibold text-[#918fa1] uppercase tracking-wider mb-2 ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0b1326] text-white placeholder-[#464555] rounded-xl px-4 py-3.5 outline-none border border-[#464555]/30 focus:border-[#c3c0ff] focus:ring-1 focus:ring-[#c3c0ff]/50 transition-all duration-300"
                placeholder="system.admin@university.edu"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-[#918fa1] uppercase tracking-wider mb-2 ml-1">Pass-phrase</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0b1326] text-white placeholder-[#464555] rounded-xl px-4 py-3.5 outline-none border border-[#464555]/30 focus:border-[#c3c0ff] focus:ring-1 focus:ring-[#c3c0ff]/50 transition-all duration-300"
                placeholder="••••••••••••"
                required
                minLength="6"
              />
            </div>

            {error && (
              <div className="p-3 bg-[#93000a]/20 border border-[#93000a] text-[#ffb4ab] text-sm rounded-lg">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-900/40 border border-emerald-500/50 text-emerald-300 text-sm rounded-lg">
                {successMsg}
              </div>
            )}

            <div className="pt-2">
              <button 
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#4f46e5] to-[#7c03d3] hover:from-[#4d44e3] hover:to-[#6800b4] text-white rounded-full py-4 text-sm font-bold shadow-[0_8px_32px_rgba(79,70,229,0.3)] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(79,70,229,0.5)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {isSignUp ? <UserPlus className="w-4 h-4" /> : <Fingerprint className="w-4 h-4" />}
                    <span>{isSignUp ? 'Create Credentials' : 'Initialize Session'}</span>
                    <ChevronRight className="w-4 h-4 opacity-70" />
                  </>
                )}
              </button>
            </div>
            
            <div className="text-center mt-4">
              <button 
                type="button" 
                onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccessMsg(''); }}
                className="text-xs text-[#918fa1] hover:text-[#c3c0ff] transition-colors underline-offset-4 hover:underline"
              >
                {isSignUp ? "Already have credentials? Sign In" : "Request credentials? Sign Up"}
              </button>
            </div>
          </form>
          
        </div>

      </div>
    </div>
  );
}

export default App;
