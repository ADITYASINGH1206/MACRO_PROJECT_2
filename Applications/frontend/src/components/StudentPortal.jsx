import React from 'react';

export default function StudentPortal() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0b1326] text-[#dae2fd] p-8 font-sans">
      <h1 className="text-[3.5rem] font-medium tracking-tight mb-8">Student Portal</h1>
      
      <div className="bg-[#131b2e]/70 backdrop-blur-xl border border-white/5 rounded-xl p-8 mb-10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <h2 className="text-[1.5rem] font-semibold mb-6 text-[#dae2fd]">Aggregate Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#171f33] p-8 rounded-xl flex flex-col justify-center items-center shadow-[inset_0_0_0_1px_#2d3449]">
            <p className="text-[3.5rem] font-medium text-[#4edea3] tracking-[-0.04em]">85%</p>
            <p className="text-[0.875rem] text-[#c7c4d7] mt-2 uppercase tracking-[0.05em]">Overall Attendance</p>
          </div>
          <div className="bg-[#171f33] p-8 rounded-xl flex flex-col justify-center items-center shadow-[inset_0_0_0_1px_#2d3449]">
            <p className="text-[3.5rem] font-medium text-[#c0c1ff] tracking-[-0.04em]">12 <span className="text-[1.5rem] text-[#908fa0]">/ 14</span></p>
            <p className="text-[0.875rem] text-[#c7c4d7] mt-2 uppercase tracking-[0.05em]">Classes Attended</p>
          </div>
        </div>
      </div>

      <div className="bg-[#131b2e]/70 backdrop-blur-xl border border-white/5 rounded-xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <h2 className="text-[1.5rem] font-semibold mb-6 text-[#dae2fd]">Attendance History</h2>
        <ul className="space-y-4">
          <li className="flex justify-between items-center bg-[#171f33] px-6 py-5 rounded-xl shadow-[inset_0_0_0_1px_#2d3449]">
            <span className="text-[1.125rem] font-medium text-[#dae2fd]">CS101 - Intro to Programming</span>
            <div className="flex flex-col items-end">
                <span className="inline-flex items-center px-3 py-1 rounded-sm text-[0.6875rem] font-bold uppercase tracking-[0.05em] bg-[#00a572]/20 text-[#4edea3] mb-1">Present</span>
                <span className="text-[0.875rem] text-[#c7c4d7]">Oct 12, 2026</span>
            </div>
          </li>
          <li className="flex justify-between items-center bg-[#171f33] px-6 py-5 rounded-xl shadow-[inset_0_0_0_1px_#2d3449]">
            <span className="text-[1.125rem] font-medium text-[#dae2fd]">CS101 - Intro to Programming</span>
            <div className="flex flex-col items-end">
                <span className="inline-flex items-center px-3 py-1 rounded-sm text-[0.6875rem] font-bold uppercase tracking-[0.05em] bg-[#93000a] text-[#ffb4ab] mb-1">Absent</span>
                <span className="text-[0.875rem] text-[#c7c4d7]">Oct 10, 2026</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
