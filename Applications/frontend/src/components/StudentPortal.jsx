import React, { useState } from 'react';
import StudentHome from './StudentHome';
import StudentHistory from './StudentHistory';
import StudentCourses from './StudentCourses';
import StudentProfile from './StudentProfile';

export default function StudentPortal({ user, onLogout }) {
  const [currentTab, setCurrentTab] = useState('home');

  return (
    <div className="bg-background text-on-surface min-h-screen">
      {currentTab === 'home' && <StudentHome user={user} onLogout={onLogout} setCurrentTab={setCurrentTab} />}
      {currentTab === 'history' && <StudentHistory setCurrentTab={setCurrentTab} />}
      {currentTab === 'courses' && <StudentCourses setCurrentTab={setCurrentTab} />}
      {currentTab === 'profile' && <StudentProfile user={user} onLogout={onLogout} setCurrentTab={setCurrentTab} />}
    </div>
  );
}
