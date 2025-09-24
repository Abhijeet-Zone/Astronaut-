import React, { useContext, useMemo, useState } from 'react';
import { RealTimeDataContext } from './Realtimedata'; 

export default function DataControls() {
  const { addPoint, updateLatest, setCompositionValue, setRunning, composition } = useContext(RealTimeDataContext);
  const [open, setOpen] = useState(false);
  const [running, setRunningLocal] = useState(true);

  // form state
  const [form, setForm] = useState({ ts: '', waste: '', recycled: '', organic: '', energy: '' });
  const [compEdit, setCompEdit] = useState({ name: '', value: '' });

  function onChangeField(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }
  function toNumOrUndefined(v) { return v === '' ? undefined : Number(v); }

  function handleAddPoint() {
    addPoint({
      ts: form.ts || undefined,
      waste: toNumOrUndefined(form.waste),
      recycled: toNumOrUndefined(form.recycled),
      organic: toNumOrUndefined(form.organic),
      energy: toNumOrUndefined(form.energy),
    });
  }

  function handleUpdateLatest() {
    updateLatest({
      waste: toNumOrUndefined(form.waste),
      recycled: toNumOrUndefined(form.recycled),
      organic: toNumOrUndefined(form.organic),
      energy: toNumOrUndefined(form.energy),
    });
  }

  function handleToggleRun() {
    const next = !running;
    setRunningLocal(next);
    setRunning(next);
  }

  function handleCompEdit() {
    if (!compEdit.name) return;
    setCompositionValue(compEdit.name, Number(compEdit.value));
  }

  const compOptions = useMemo(() => composition || [], [composition]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 8,
      background: '#0b1416', border: '1px solid #1f2937', borderRadius: 12,
      padding: 8, marginBottom: 12
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 14, color: '#e5e7eb' }}>Real-time Data Controls</div>
          <button
            aria-label={running ? 'Pause simulation' : 'Resume simulation'}
            onClick={handleToggleRun}
            className={`toggle ${running ? 'on' : 'off'}`}
          >
            <span className="knob" />
          </button>
        </div>
        <button onClick={() => setOpen((o) => !o)} style={{
          background: '#111827', border: '1px solid #1f2937', color: '#e5e7eb',
          padding: '6px 10px', borderRadius: 8, cursor: 'pointer'
        }}>
          {open ? 'Hide' : 'Show'}
        </button>
      </div>

      {open && (
        <div style={{ display: 'grid', gap: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <input name="ts" placeholder="Label (optional)" value={form.ts} onChange={onChangeField} />
            <input name="waste" placeholder="waste" value={form.waste} onChange={onChangeField} type="number" />
            <input name="recycled" placeholder="recycled" value={form.recycled} onChange={onChangeField} type="number" />
            <input name="organic" placeholder="organic" value={form.organic} onChange={onChangeField} type="number" />
            <input name="energy" placeholder="energy" value={form.energy} onChange={onChangeField} type="number" />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleAddPoint}>Add point</button>
            <button onClick={handleUpdateLatest}>Update latest</button>
          </div>

          <div style={{ display: 'grid', gap: 6 }}>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Edit Composition Slice</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 6 }}>
              <select value={compEdit.name} onChange={(e) => setCompEdit((c) => ({ ...c, name: e.target.value }))}>
                <option value="">Select material</option>
                {compOptions.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
              <input type="number" placeholder="value" value={compEdit.value} onChange={(e) => setCompEdit((c) => ({ ...c, value: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleCompEdit}>Set value</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
