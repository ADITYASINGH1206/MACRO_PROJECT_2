import React, { useState, useEffect } from 'react';
import StudentHome from './StudentHome';
import StudentHistory from './StudentHistory';
import StudentCourses from './StudentCourses';
import StudentProfile from './StudentProfile';

export default function StudentPortal({ user, onLogout }) {
  const [currentTab, setCurrentTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="bg-background text-on-surface min-h-screen relative">
      <button 
        onClick={toggleTheme}
        className="fixed bottom-24 right-6 z-[100] w-14 h-14 rounded-full bg-primary text-on-primary shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        aria-label="Toggle Theme"
      >
        <span className="material-symbols-outlined">
          {isDarkMode ? 'light_mode' : 'dark_mode'}
        </span>
      </button>
      
      {currentTab === 'home' && <StudentHome user={user} onLogout={onLogout} setCurrentTab={setCurrentTab} />}
      {currentTab === 'history' && <StudentHistory setCurrentTab={setCurrentTab} />}
      {currentTab === 'courses' && <StudentCourses setCurrentTab={setCurrentTab} />}
      {currentTab === 'profile' && <StudentProfile user={user} onLogout={onLogout} setCurrentTab={setCurrentTab} />}
    </div>
  );
}
