import React, { useState, useEffect } from 'react';

export default function ManualAttendance({ students, courses, onMarkBulkAttendance, isDarkMode, onBack }) {
  const [search, setSearch] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [stagedUpdates, setStagedUpdates] = useState({}); // { studentId: status }
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default to first course if available
  useEffect(() => {
    if (!selectedCourseId && courses && courses.length > 0) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  const styles = {
    surface: isDarkMode ? 'bg-[#0A0F1C]' : 'bg-[#f8f9fc]',
    surfaceLow: isDarkMode ? 'bg-[#111A2C]' : 'bg-[#ffffff]',
    surfaceContainer: isDarkMode ? 'bg-[#15213A]' : 'bg-[#f1f3f9]',
    surfaceHighest: isDarkMode ? 'bg-[#1e2d4a]' : 'bg-[#e2e8f0]',
    textPrimary: isDarkMode ? 'text-[#F8FAFC]' : 'text-[#1e293b]',
    textSecondary: isDarkMode ? 'text-[#94a3b8]' : 'text-[#64748b]',
    accentPrimary: 'text-[#8283ff]',
    accentSecondary: 'text-[#4edea3]',
    accentTertiary: 'text-[#ffb783]',
    border: 'border-white/10',
  };

  const filteredStudents = students.filter(s => 
    s.full_name.toLowerCase().includes(search.toLowerCase()) || 
    (s.email && s.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleStageStatus = (studentId, status) => {
    setStagedUpdates(prev => ({
      ...prev,
      [studentId]: prev[studentId] === status ? null : status
    }));
  };

  const handleMarkAllPresent = () => {
    const bulk = {};
    filteredStudents.forEach(s => {
      bulk[s.id] = 'present';
    });
    setStagedUpdates(prev => ({ ...prev, ...bulk }));
  };

  const handleSubmit = async () => {
    if (!selectedCourseId) {
      alert("Please select a course first.");
      return;
    }

    const records = Object.entries(stagedUpdates)
      .filter(([_, status]) => status !== null)
      .map(([studentId, status]) => ({
        student_id: studentId,
        status: status,
        course_id: selectedCourseId,
        timestamp: new Date().toISOString()
      }));

    if (records.length === 0) {
      alert("No attendance records to submit.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onMarkBulkAttendance(records);
      setStagedUpdates({});
      alert(`Successfully submitted ${records.length} attendance records.`);
    } catch (err) {
      console.error(err);
      alert("Failed to submit attendance.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stagedCount = Object.values(stagedUpdates).filter(v => v !== null).length;

  return (
    <div className={`min-h-screen ${styles.surface} ${styles.textPrimary} font-sans selection:bg-[#8283ff]/30 pb-32`}>
      {/* Navigation Header */}
      <header className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b ${styles.border} flex items-center justify-between px-8 py-5`} style={{backgroundColor: isDarkMode ? 'rgba(10,15,28,0.9)' : 'rgba(248,249,252,0.9)'}}>
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border ${styles.border} transition-all`}
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>
          <div>
             <h1 className="text-lg font-black tracking-[-0.04em] uppercase leading-none">Manual <span className={styles.accentPrimary}>Attendance</span></h1>
             <p className={`text-[10px] ${styles.textSecondary} font-bold tracking-[0.2em] mt-1.5 uppercase`}>Bulk Registry Entry</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4">
             <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Active Course</p>
                <select 
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className={`bg-transparent text-xs font-bold outline-none cursor-pointer ${styles.accentPrimary}`}
                >
                   <option value="" disabled className="bg-[#0A0F1C]">Select Course</option>
                  {(courses || []).map(c => <option key={c.id} value={c.id} className="bg-[#0A0F1C]">{c.name}</option>)}
                </select>
             </div>
             <div className={`w-px h-8 bg-white/10 mx-2`}></div>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={stagedCount === 0 || isSubmitting}
            className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${stagedCount > 0 ? 'bg-[#8283ff] text-white shadow-lg shadow-[#8283ff]/30' : 'bg-white/5 text-white/20 border ' + styles.border}`}
          >
            {isSubmitting ? 'Processing...' : `Submit (${stagedCount})`}
          </button>
        </div>
      </header>

      <main className="pt-32 px-8 max-w-[1400px] mx-auto space-y-12">
        {/* Controls Bar */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="relative group w-full md:w-96">
              <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">search</span>
              <input 
                type="text" 
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full ${styles.surfaceLow} border ${styles.border} rounded-2xl py-5 pl-16 pr-8 text-sm font-bold placeholder:opacity-20 outline-none focus:border-[#8283ff]/40 shadow-xl transition-all`}
              />
           </div>
           <div className="flex items-center gap-4 w-full md:w-auto">
              <button 
                onClick={handleMarkAllPresent}
                className={`flex-1 md:flex-none px-8 py-5 rounded-2xl border ${styles.border} bg-white/5 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#4edea3]/10 hover:text-[#4edea3] transition-all`}
              >
                Mark All Present
              </button>
              <button 
                onClick={() => setStagedUpdates({})}
                className={`px-8 py-5 rounded-2xl border ${styles.border} bg-white/5 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-500/10 hover:text-red-400 transition-all`}
              >
                Reset
              </button>
           </div>
        </section>

        {/* Student List View */}
        <div className={`${styles.surfaceLow} rounded-[2.5rem] border ${styles.border} shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700`}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${styles.surfaceContainer} border-b ${styles.border}`}>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Student Detail</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] opacity-40 text-center">Status Selection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(filteredStudents || []).map(student => (
                <tr key={student.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl ${styles.surfaceContainer} flex items-center justify-center font-black text-xl text-[#8283ff] border ${styles.border} shadow-inner group-hover:scale-110 transition-all`}>
                        {student.full_name?.[0] || 'S'}
                      </div>
                      <div>
                        <h4 className="font-black text-lg tracking-tight leading-none mb-1.5 group-hover:text-[#8283ff] transition-colors">{student.full_name}</h4>
                        <p className={`text-[10px] ${styles.textSecondary} font-bold uppercase tracking-[0.2em] opacity-40`}>{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center justify-center gap-3">
                       {[
                         { id: 'present', icon: 'check_circle', label: 'Present', color: 'bg-[#4edea3]', effect: 'shadow-[#4edea3]/20' },
                         { id: 'absent', icon: 'cancel', label: 'Absent', color: 'bg-red-500', effect: 'shadow-red-500/20' },
                         { id: 'late', icon: 'schedule', label: 'Late', color: 'bg-[#ffb783]', effect: 'shadow-[#ffb783]/20' }
                       ].map(btn => (
                         <button
                           key={btn.id}
                           onClick={() => handleStageStatus(student.id, btn.id)}
                           className={`flex flex-col items-center justify-center w-24 py-3 rounded-2xl border ${styles.border} transition-all relative overflow-hidden group/btn ${stagedUpdates[student.id] === btn.id ? btn.color + ' text-white shadow-xl ' + btn.effect : 'bg-white/5 hover:bg-white/10 text-white/30'}`}
                         >
                            <span className={`material-symbols-outlined text-xl mb-1 ${stagedUpdates[student.id] === btn.id ? 'animate-bounce' : ''}`}>{btn.icon}</span>
                            <span className="text-[8px] font-black uppercase tracking-widest">{btn.label}</span>
                         </button>
                       ))}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="2" className="px-10 py-32 text-center">
                    <div className="opacity-10 italic font-black uppercase tracking-[0.4em]">No student records found</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Manual Submission Floating Bar (Mobile / Compact) */}
      {stagedCount > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] w-[90%] animate-in slide-in-from-bottom-12 duration-500">
           <button 
             onClick={handleSubmit}
             disabled={isSubmitting}
             className="w-full bg-[#8283ff] text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.4em] shadow-[0_20px_48px_rgba(130,131,255,0.4)] active:scale-[0.98] transition-all"
           >
             {isSubmitting ? 'Submitting...' : `Submit Attendance for ${stagedCount} Students`}
           </button>
        </div>
      )}
    </div>
  );
}
