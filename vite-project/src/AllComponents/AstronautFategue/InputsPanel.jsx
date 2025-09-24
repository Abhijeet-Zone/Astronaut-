import React from 'react';

function InputsPanel({ formData, apiData, isLoading, handleInputChange, processFatigueData }) {
  return (
    <section className="glass rounded-2xl p-5 lg:p-6">
      <form id="telemetryForm" className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={processFatigueData}>
        {/* Heart Rate */}
        <div className="field">
          <label htmlFor="hr" className="label">Heart Rate (HR)</label>
          <div className="flex gap-2 items-center">
            <input id="hr" type="number" className="input w-full" placeholder="72" min="30" max="220" value={formData.hr} onChange={handleInputChange} />
            <span className="unit">bpm</span>
          </div>
          <small className="text-slate-400">Continuous from wearables</small>
        </div>

        {/* HRV */}
        <div className="field">
          <label htmlFor="hrv" className="label">Heart Rate Variability (HRV)</label>
          <div className="flex gap-2 items-center">
            <input id="hrv" type="number" className="input w-full" placeholder="58" min="10" max="200" value={formData.hrv} onChange={handleInputChange} />
            <span className="unit">ms</span>
          </div>
          <small className="text-slate-400">Stress + fatigue indicator</small>
        </div>

        {/* SpO2 */}
        <div className="field">
          <label htmlFor="spo2" className="label">SpO₂ (Blood Oxygen)</label>
          <div className="flex gap-2 items-center">
            <input id="spo2" type="number" className="input w-full" placeholder="98" min="70" max="100" value={formData.spo2} onChange={handleInputChange} />
            <span className="unit">%</span>
          </div>
          <small className="text-slate-400">Oxygen intake efficiency</small>
        </div>

        {/* Sleep */}
        <div className="field">
          <label htmlFor="sleep" className="label">Sleep (Duration)</label>
          <div className="flex gap-2 items-center">
            <input id="sleep" type="number" className="input w-full" placeholder="6.5" step="0.1" min="0" max="14" value={formData.sleep} onChange={handleInputChange} />
            <span className="unit">hrs</span>
          </div>
          <small className="text-slate-400">Duration last sleep</small>
        </div>

        {/* Activity */}
        <div className="field md:col-span-2">
          <label htmlFor="activity" className="label">Activity (Workload Intensity)</label>
          <input id="activity" type="range" className="w-full" min="0" max="10" step="1" value={formData.activity} onChange={handleInputChange} />
          <div className="flex justify-between text-xs text-slate-400 -mt-1">
            <span>Low</span><span>High</span>
          </div>
          <small className="text-slate-400">Movement + workload logs</small>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex flex-wrap gap-3">
          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? 'Analyzing...' : 'Apply'}
          </button>
        </div>
      </form>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="pill rounded-xl p-3">
          <div className="text-[11px] text-slate-400 head tracking-wide">Derived Fatigue Score</div>
          <div className="text-cyan-200 text-lg head">
            {isLoading ? '...' : (apiData ? apiData.fatigueScore : '—')}
          </div>
        </div>
        <div className="pill rounded-xl p-3">
          <div className="text-[11px] text-slate-400 head tracking-wide">Calculated State</div>
          <div className="text-cyan-200 text-lg head">
            {isLoading ? '...' : (apiData ? apiData.fatigueState : '—')}
          </div>
        </div>
      </div>
    </section>
  );
}

export default InputsPanel;