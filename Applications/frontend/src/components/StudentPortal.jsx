import React, { useState, useEffect } from 'react';
import StudentHome from './StudentHome';
import StudentHistory from './StudentHistory';
import StudentCourses from './StudentCourses';
import StudentProfile from './StudentProfile';

export default function StudentPortal({ user, onLogout }) {
  const [currentTab, setCurrentTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/student/dashboard/${user.id}`);
        const data = await response.json();
        setStudentData(data);
      } catch (error) {
        console.error('Failed to fetch student data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchStudentData();
  }, [user?.id]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-on-surface-variant font-medium animate-pulse">Syncing Academic Records...</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface min-h-screen relative">
      {currentTab === 'home' && (
        <StudentHome 
          user={user} 
          studentData={studentData}
          onLogout={onLogout} 
          setCurrentTab={setCurrentTab} 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
        />
      )}
      {currentTab === 'history' && (
        <StudentHistory 
          history={studentData?.history || []}
          setCurrentTab={setCurrentTab} 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
        />
      )}
      {currentTab === 'courses' && (
        <StudentCourses 
          courses={studentData?.courses || []}
          setCurrentTab={setCurrentTab} 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
        />
      )}
      {currentTab === 'profile' && (
        <StudentProfile 
          user={user} 
          records={studentData?.profile?.academic_records?.[0]} 
          onLogout={onLogout} 
          setCurrentTab={setCurrentTab} 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
        />
      )}
    </div>
  );
}
