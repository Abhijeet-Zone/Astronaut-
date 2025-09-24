import React from 'react';

function GaugePanel({ formData, apiData, error }) {
  const circumference = 2 * Math.PI * 82; // SVG radius
  const gaugeOffset = apiData
    ? circumference - (apiData.fatigueScore / 100) * circumference
    : circumference;

  return (
    <section className="glass rounded-2xl p-5 lg:p-6 w-screen">
      <h2 className="head text-lg neon mb-4">Fatigue Analysis</h2>
      <div className="flex flex-col items-center gap-4">
        <div className="gauge relative">
          <svg viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="82" stroke="#1f2a49" strokeWidth="16" fill="none" />
            <defs>
              <linearGradient id="gg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="82" stroke="url(#gg)" strokeWidth="16" fill="none"
              strokeLinecap="round"
              strokeDasharray={`${circumference - gaugeOffset} ${gaugeOffset}`}
              transform="rotate(-90 100 100)"
              style={{ transition: 'stroke-dasharray 0.5s ease' }} />
            <circle cx="100" cy="100" r="68" fill="none" stroke="#22d3ee22" strokeWidth="12" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="center-num">{error ? 'ERR' : (apiData ? apiData.fatigueScore : '—')}</div>
            <div className="label mt-1 tracking-[0.2em] text-cyan-200">FATIGUE SCORE</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 w-full">
          <div className="pill rounded-xl p-3">
            <div className="text-[11px] text-slate-400 head tracking-wide">HR</div>
            <div className="text-cyan-200 text-lg head">{formData.hr || '—'}</div>
          </div>
          <div className="pill rounded-xl p-3">
            <div className="text-[11px] text-slate-400 head tracking-wide">HRV</div>
            <div className="text-cyan-200 text-lg head">{formData.hrv || '—'}</div>
          </div>
          <div className="pill rounded-xl p-3">
            <div className="text-[11px] text-slate-400 head tracking-wide">SpO₂</div>
            <div className="text-cyan-200 text-lg head">{formData.spo2 || '—'}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GaugePanel;