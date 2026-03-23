import React, { useState, useEffect } from 'react';

export default function FacultyDashboard({ user }) {
  const [liveCount, setLiveCount] = useState(0);
  const [addStudentForm, setAddStudentForm] = useState({ name: '', email: '', course_id: 'test-course-id' });
  const [formStatus, setFormStatus] = useState('');
  
  const courseId = 'test-course-id';

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/attendance/live/${courseId}`);
        const data = await response.json();
        setLiveCount(data.live_count || 0);
      } catch (err) {
        setLiveCount(41); // Fallback mock value matching Stitch design (41/50)
      }
    };
    fetchAttendance();
    const interval = setInterval(fetchAttendance, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    setFormStatus('Enrolling...');
    try {
      const res = await fetch('http://localhost:3000/api/faculty/add-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addStudentForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to enroll');
      
      setFormStatus('Student enrolled successfully!');
      setAddStudentForm({ ...addStudentForm, name: '', email: '' });
      setTimeout(() => setFormStatus(''), 4000);
    } catch (err) {
      setFormStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0b1326] text-[#dae2fd] p-8 font-sans">
      <h1 className="text-[3.5rem] font-medium tracking-tight mb-8">Faculty Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Live Counter Card */}
        <div className="lg:col-span-2 bg-[#131b2e] rounded-xl p-8 shadow-lg flex flex-col justify-center items-center">
          <h2 className="text-[1.125rem] font-medium mb-4 text-[#c7c4d7]">Live Class Attendance</h2>
          <div className="flex flex-col items-center justify-center p-8 bg-[#171f33] rounded-full border-4 border-[#8083ff] shadow-[0_0_40px_rgba(99,102,241,0.2)] w-56 h-56 relative animate-pulse">
              <p className="text-[3.5rem] text-[#c0c1ff] font-bold leading-none">{((liveCount/50)*100).toFixed(0)}%</p>
              <p className="text-[0.875rem] text-[#c7c4d7] mt-2 font-medium tracking-[0.05em] uppercase">{liveCount} / 50 Present</p>
          </div>
        </div>

        {/* Enroll New Student Form */}
        <div className="bg-[#131b2e] rounded-xl p-8 shadow-lg flex flex-col">
          <h2 className="text-[1.125rem] font-medium mb-6 text-[#c7c4d7]">Class Enrollment</h2>
          
          <form onSubmit={handleEnrollStudent} className="space-y-4 flex-1">
            <div>
              <label className="block text-[0.75rem] uppercase tracking-[0.05em] font-medium text-[#908fa0] mb-1">Student Full Name</label>
              <input type="text" required value={addStudentForm.name} onChange={e => setAddStudentForm({...addStudentForm, name: e.target.value})} className="w-full bg-[#0b1326] border border-[#2d3449] rounded-md px-3 py-2 text-[0.875rem] text-[#dae2fd] focus:outline-none focus:border-[#4edea3]" placeholder="Alice Johnson" />
            </div>
            <div>
              <label className="block text-[0.75rem] uppercase tracking-[0.05em] font-medium text-[#908fa0] mb-1">University Email</label>
              <input type="email" required value={addStudentForm.email} onChange={e => setAddStudentForm({...addStudentForm, email: e.target.value})} className="w-full bg-[#0b1326] border border-[#2d3449] rounded-md px-3 py-2 text-[0.875rem] text-[#dae2fd] focus:outline-none focus:border-[#4edea3]" placeholder="alice@uni.edu" />
            </div>
            <button type="submit" className="w-full mt-4 bg-transparent border border-[#4edea3] text-[#4edea3] hover:bg-[#4edea3] hover:text-[#002113] transition-colors py-2 rounded-md font-medium text-[0.875rem]">
              Add to Course Directory
            </button>
            {formStatus && <div className="text-[0.75rem] mt-3 text-center text-[#ffb783]">{formStatus}</div>}
          </form>
        </div>
      </div>

      {/* Manual Override Data Table */}
      <div className="bg-[#131b2e] rounded-xl p-8 shadow-lg">
        <h2 className="text-[1.5rem] font-semibold mb-6 text-[#dae2fd]">Manual Override Table</h2>
        <div className="overflow-hidden rounded-lg bg-[#171f33]">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-[#2d3449] text-[#c7c4d7] text-[0.875rem] uppercase tracking-wider">
                  <th className="py-4 px-6 font-medium">Student ID</th>
                  <th className="py-4 px-6 font-medium">Name</th>
                  <th className="py-4 px-6 font-medium">Status</th>
                  <th className="py-4 px-6 font-medium text-right">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-[#2d3449]">
                <tr className="hover:bg-[#131b2e] transition-colors">
                  <td className="py-5 px-6 text-[#dae2fd]">101</td>
                  <td className="py-5 px-6 font-medium text-[#dae2fd]">John Doe</td>
                  <td className="py-5 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-sm text-[0.6875rem] font-bold uppercase tracking-[0.05em] bg-[#00a572]/20 text-[#4edea3]">Present</span>
                  </td>
                  <td className="py-5 px-6 text-right">
                      <button className="bg-transparent hover:underline text-[#ffb4ab] text-[0.875rem] tracking-wide font-medium">Mark Absent</button>
                  </td>
                </tr>
                <tr className="hover:bg-[#131b2e] transition-colors">
                  <td className="py-5 px-6 text-[#dae2fd]">102</td>
                  <td className="py-5 px-6 font-medium text-[#dae2fd]">Jane Smith</td>
                  <td className="py-5 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-sm text-[0.6875rem] font-bold uppercase tracking-[0.05em] bg-[#93000a] text-[#ffb4ab]">Absent</span>
                  </td>
                  <td className="py-5 px-6 text-right">
                      <button className="bg-gradient-to-br from-[#8083ff] to-[#c0c1ff] text-[#1000a9] px-4 py-2 rounded-md text-[0.875rem] font-medium shadow-[0_0_15px_rgba(192,193,255,0.3)]">Override Status</button>
                  </td>
                </tr>
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
