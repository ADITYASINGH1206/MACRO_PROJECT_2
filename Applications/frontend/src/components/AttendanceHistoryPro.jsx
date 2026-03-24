import React, { useState } from 'react';

export default function AttendanceHistoryPro({ attendanceLogs, onExportCSV, isDarkMode, onBack }) {
  const [filter, setFilter] = useState('all');

  const styles = {
    surface: isDarkMode ? 'bg-[#0b1326]' : 'bg-[#f8f9fc]',
    surfaceLow: isDarkMode ? 'bg-[#131b2e]' : 'bg-[#ffffff]',
    surfaceContainer: isDarkMode ? 'bg-[#171f33]' : 'bg-[#f1f3f9]',
    textPrimary: isDarkMode ? 'text-[#dae2fd]' : 'text-[#1e293b]',
    textSecondary: isDarkMode ? 'text-[#c7c4d7]' : 'text-[#64748b]',
    accentPrimary: 'text-[#c0c1ff]',
    accentSecondary: 'text-[#4edea3]',
  };

  const filteredLogs = attendanceLogs.filter(log => {
    if (filter === 'present') return log.status === 'present';
    if (filter === 'absent') return log.status === 'absent';
    return true;
  });

  return (
    <div className={`min-h-screen ${styles.surface} ${styles.textPrimary} p-8 animate-in fade-in duration-700`}>
      <div className="max-w-[1200px] mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-8">
          <div className="flex-1">
            <button onClick={onBack} className={`text-[10px] font-black uppercase tracking-[0.3em] ${styles.accentPrimary} mb-4 flex items-center gap-2 hover:translate-x-[-4px] transition-transform`}>
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Return to Core
            </button>
            <h2 className="text-5xl font-black tracking-tight leading-[0.9]">Temporal<br/>Audit Ledger</h2>
            <p className={`${styles.textSecondary} text-lg font-light mt-4`}>High-fidelity historical log of institutional presence.</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className={`p-1 ${styles.surfaceContainer} rounded-2xl flex border border-white/5`}>
              {['all', 'present', 'absent'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${filter === f ? `${styles.surfaceLow} ${styles.accentPrimary} shadow-xl` : 'opacity-40 hover:opacity-100'}`}
                >
                  {f === 'all' ? 'Universal' : f === 'present' ? 'Verified' : 'Flagged'}
                </button>
              ))}
            </div>
            <button 
              onClick={onExportCSV}
              className="px-8 py-4 bg-[#c0c1ff] text-[#0b1326] font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-[#8083ff]/30 hover:scale-[1.05] active:scale-[0.98] transition-all flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-sm">file_download</span>
              Extract Ledger
            </button>
          </div>
        </header>

        <div className={`${styles.surfaceLow} rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden`}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] opacity-30">Identity</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] opacity-30">Status</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] opacity-30 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, idx) => (
                <tr key={idx} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-all group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-xl ${styles.surfaceContainer} flex items-center justify-center font-black text-sm text-[#4edea3] border border-white/5 group-hover:scale-110 transition-transform`}>
                         {(log.profiles?.full_name?.[0] || 'S')}
                       </div>
                       <div>
                         <p className="font-black tracking-tight">{log.profiles?.full_name || 'Anonymous'}</p>
                         <p className={`text-[10px] ${styles.textSecondary} font-medium uppercase tracking-widest`}>{log.profiles?.email || 'N/A'}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${log.status === 'present' ? 'bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                      {log.status === 'present' ? 'Verified' : 'Incomplete'}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right font-mono text-xs opacity-50">
                    {new Date(log.timestamp || log.created_at).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLogs.length === 0 && (
            <div className="py-48 text-center opacity-30 italic font-black uppercase tracking-[0.4em]">
               No historical records available for current filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
