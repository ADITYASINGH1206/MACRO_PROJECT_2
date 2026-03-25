import React, { useState, useEffect } from 'react';

export default function AdminPortal({ isDarkMode, onBack }) {
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchFaculties();
    fetchCourses();
  }, []);

  const fetchFaculties = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/admin/faculties');
      const data = await res.json();
      setFaculties(data);
    } catch (err) { console.error(err); }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/admin/courses');
      const data = await res.json();
      setCourses(data);
    } catch (err) { console.error(err); }
  };

  const styles = {
    surface: isDarkMode ? 'bg-[#0b1326]' : 'bg-[#f8f9fc]',
    surfaceLow: isDarkMode ? 'bg-[#131b2e]' : 'bg-[#ffffff]',
    surfaceContainer: isDarkMode ? 'bg-[#171f33]' : 'bg-[#f1f3f9]',
    textPrimary: isDarkMode ? 'text-[#dae2fd]' : 'text-[#1e293b]',
    textSecondary: isDarkMode ? 'text-[#c7c4d7]' : 'text-[#64748b]',
    accentPrimary: 'text-[#c0c1ff]',
  };

  return (
    <div className={`min-h-screen ${styles.surface} ${styles.textPrimary} font-inter p-12 space-y-16`}>
      <header className="flex items-center justify-between">
         <div className="flex items-center gap-6">
            <button onClick={onBack} className={`w-12 h-12 rounded-xl ${styles.surfaceLow} flex items-center justify-center border border-white/5`}>
               <span className="material-symbols-outlined uppercase">arrow_back</span>
            </button>
            <div>
               <h2 className="text-4xl font-black tracking-tight">System Registry</h2>
               <p className={`${styles.textSecondary} text-sm font-light mt-1`}>Authorized Management of Scholarly Assets.</p>
            </div>
         </div>
      </header>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        {/* Faculty Registry */}
        <div className={`${styles.surfaceLow} p-12 rounded-[2.5rem] border border-white/5 shadow-2xl`}>
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black tracking-tight">Faculty Identities</h3>
              <span className={`px-4 py-1.5 rounded-full ${styles.surfaceContainer} text-[10px] font-black uppercase tracking-widest`}>{faculties.length} Verified</span>
           </div>
           <div className="space-y-4">
              {faculties.map(f => (
                <div key={f.id} className={`${styles.surfaceContainer} p-6 rounded-2xl flex items-center justify-between group`}>
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center font-black text-xl text-[#c0c1ff]">
                        {f.full_name[0]}
                      </div>
                      <div>
                         <h4 className="font-black text-lg tracking-tight mb-1">{f.full_name}</h4>
                         <p className={`text-xs ${styles.textSecondary}`}>{f.email}</p>
                      </div>
                   </div>
                   <button className="opacity-0 group-hover:opacity-100 transition-all text-[#c0c1ff] text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 bg-white/5 rounded-lg">Configure</button>
                </div>
              ))}
           </div>
        </div>

        {/* Course Registry */}
        <div className={`${styles.surfaceLow} p-12 rounded-[2.5rem] border border-white/5 shadow-2xl`}>
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black tracking-tight">Active Courses</h3>
              <button className={`${styles.accentPrimary} text-[10px] font-black uppercase tracking-[0.2em] italic underline underline-offset-4 decoration-2`}>Register New</button>
           </div>
           <div className="space-y-4">
              {courses.map(c => (
                <div key={c.id} className={`${styles.surfaceContainer} p-8 rounded-2xl relative overflow-hidden group`}>
                   <div className="absolute top-0 right-0 w-1 h-full bg-[#8083ff] opacity-0 group-hover:opacity-100 transition-all"></div>
                   <h4 className="text-xl font-black tracking-tight mb-2 italic">{c.name}</h4>
                   <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{c.code}</span>
                      <div className="h-3 w-px bg-white/10"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{c.department}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
}
