import React from 'react';

export default function StudentHistory({ history, isDarkMode }) {
  const styles = {
    surface: isDarkMode ? 'bg-[#0b1326]' : 'bg-[#f8f9fc]',
    surfaceLow: isDarkMode ? 'bg-[#131b2e]' : 'bg-[#ffffff]',
    surfaceContainer: isDarkMode ? 'bg-[#171f33]' : 'bg-[#f1f3f9]',
    surfaceHighest: isDarkMode ? 'bg-[#2d3449]' : 'bg-[#e2e8f0]',
    textPrimary: isDarkMode ? 'text-[#dae2fd]' : 'text-[#1e293b]',
    textSecondary: isDarkMode ? 'text-[#c7c4d7]' : 'text-[#64748b]',
    accentPrimary: 'text-[#c0c1ff]',
    accentSecondary: 'text-[#4edea3]',
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-5xl font-black tracking-tight leading-[0.9]">Session<br/>Archives</h2>
          <p className={`${styles.textSecondary} text-lg font-light mt-4`}>The immutable historical ledger of institutional presence.</p>
        </div>
        <div className="flex gap-4">
           <button className={`${styles.surfaceLow} px-6 py-4 rounded-2xl border border-white/5 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-white/5 transition-all`}>
              <span className="material-symbols-outlined text-lg">filter_alt</span>
              Filter Segment
           </button>
        </div>
      </div>

      <div className={`${styles.surfaceLow} rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl relative`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={styles.surfaceContainer}>
              <tr>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Temporal Index</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Authentication Event</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Presence Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {history.map((log, idx) => {
                const dateObj = new Date(log.timestamp);
                return (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <span className="text-lg font-black tracking-tight leading-none mb-1">{dateObj.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <span className={`text-[10px] ${styles.textSecondary} font-bold uppercase tracking-widest opacity-60`}>{dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl ${styles.surfaceContainer} flex items-center justify-center text-[#c0c1ff] border border-white/5`}>
                             <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
                          </div>
                          <div>
                             <p className="text-sm font-black tracking-tight">Main Campus Entrance</p>
                             <p className={`text-[10px] ${styles.textSecondary} font-bold opacity-60 uppercase tracking-widest`}>Validated Session</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                       <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${log.status === 'present' ? 'bg-[#4edea3]/5 text-[#4edea3] border-[#4edea3]/20' : 'bg-red-500/5 text-red-400 border-red-500/20'}`}>
                          {log.status}
                       </span>
                    </td>
                  </tr>
                );
              })}
              {history.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-10 py-32 text-center opacity-20 font-black uppercase tracking-[0.4em] text-sm italic">
                    Archives clear. No session logs detected.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
