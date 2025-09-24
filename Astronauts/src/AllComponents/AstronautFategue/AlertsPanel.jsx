import React from 'react';

function AlertsPanel({ apiData, error }) {
  const getPillClassName = () => {
    if (!apiData) return 'badge';
    const { fatigueState } = apiData;
    if (['High', 'Critical'].includes(fatigueState)) return 'badge badge-red';
    if (fatigueState === 'Moderate') return 'badge badge-amber';
    return 'badge badge-green';
  };

  return (
    <aside className="glass rounded-2xl p-5 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="head text-lg neon">Alerts</h2>
        <span className={getPillClassName()}>
          STATUS: {apiData ? apiData.fatigueState.toUpperCase() : 'IDLE'}
        </span>
      </div>
      <ul className="space-y-3">
        {error && <li className="text-red-400 text-sm">{error}</li>}

        {!error && !apiData && (
          <li className="text-slate-400 text-sm">Submit telemetry data to generate alerts.</li>
        )}

        {apiData && apiData.alerts.length === 0 && (
          <li className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(34,197,94,0.1)' }}>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500"></span>
            <span className="text-sm text-slate-300">All systems nominal. Vitals are optimal.</span>
          </li>
        )}

        {apiData && apiData.alerts.map((alert, index) => {
          const color = alert.level === 'red' ? 'ef4444' : 'f59e0b';
          const bgColor = `rgba(${parseInt(color.slice(0, 2), 16)}, ${parseInt(color.slice(2, 4), 16)}, ${parseInt(color.slice(4, 6), 16)}, 0.1)`;
          return (
            <li key={index} className="flex items-start gap-3 p-3 rounded-lg row-click" style={{ background: bgColor }}>
              <span className="inline-block w-2.5 h-2.5 rounded-full mt-1.5" style={{ background: `#${color}` }}></span>
              <div>
                <div className="font-bold text-sm text-white">{alert.metric} Alert</div>
                <div className="text-xs text-slate-300">{alert.message}</div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
        <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: '#22c55e' }}></span> Optimal
        <span className="inline-block w-2.5 h-2.5 rounded-full ml-2" style={{ background: '#f59e0b' }}></span> Caution
        <span className="inline-block w-2.5 h-2.5 rounded-full ml-2" style={{ background: '#ef4444' }}></span> Critical
      </div>
    </aside>
  );
}

export default AlertsPanel;