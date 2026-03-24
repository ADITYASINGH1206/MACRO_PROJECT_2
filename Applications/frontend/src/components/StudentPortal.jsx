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
      {currentTab === 'home' && <StudentHome user={user} onLogout={onLogout} setCurrentTab={setCurrentTab} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}
      {currentTab === 'history' && <StudentHistory setCurrentTab={setCurrentTab} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}
      {currentTab === 'courses' && <StudentCourses setCurrentTab={setCurrentTab} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}
      {currentTab === 'profile' && <StudentProfile user={user} onLogout={onLogout} setCurrentTab={setCurrentTab} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}
    </div>
  );
}
