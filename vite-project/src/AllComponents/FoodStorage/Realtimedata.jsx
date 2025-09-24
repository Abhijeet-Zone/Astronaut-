import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';

export const RealTimeDataContext = createContext(null);

const initialTimeSeries = [
  { ts: 'Jan', waste: 12, recycled: 7, organic: 3, energy: 2 },
  { ts: 'Feb', waste: 14, recycled: 8, organic: 3.5, energy: 2.5 },
  { ts: 'Mar', waste: 13, recycled: 8.5, organic: 4, energy: 2.2 },
  { ts: 'Apr', waste: 15, recycled: 9, organic: 4.5, energy: 2.8 },
  { ts: 'May', waste: 16, recycled: 10, organic: 5, energy: 3 },
  { ts: 'Jun', waste: 15, recycled: 10.5, organic: 5.2, energy: 2.6 },
  { ts: 'Jul', waste: 17, recycled: 11, organic: 5.6, energy: 3.2 },
  { ts: 'Aug', waste: 16, recycled: 11.5, organic: 5.3, energy: 3.1 },
  { ts: 'Sep', waste: 15, recycled: 11.7, organic: 5.1, energy: 2.9 },
  { ts: 'Oct', waste: 14, recycled: 11.2, organic: 4.7, energy: 2.5 },
  { ts: 'Nov', waste: 13, recycled: 10.8, organic: 4.2, energy: 2.2 },
  { ts: 'Dec', waste: 12, recycled: 10.5, organic: 4, energy: 2 },
];

const initialComposition = [
  { name: 'Organic', value: 42, color: '#22c55e' },
  { name: 'Plastic', value: 18, color: '#60a5fa' },
  { name: 'Paper', value: 14, color: '#f97316' },
  { name: 'Glass', value: 9, color: '#a78bfa' },
  { name: 'Metal', value: 7, color: '#f472b6' },
  { name: 'Other', value: 10, color: '#94a3b8' },
];

const initialRadar = [
  { category: 'Airframe', generated: 120, recycled: 70 },
  { category: 'External Panels', generated: 100, recycled: 65 },
  { category: 'Thermal Shielding', generated: 60, recycled: 40 },
  { category: 'Workshops', generated: 80, recycled: 55 },
  { category: 'Labs', generated: 75, recycled: 50 },
];

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

export function RealTimeDataProvider({ children, tickMs = 2000, maxPoints = 24 }) {
  const [timeSeries, setTimeSeries] = useState(initialTimeSeries);
  const [composition, setComposition] = useState(initialComposition);
  const [radarData, setRadarData] = useState(initialRadar);
  const runningRef = useRef(true);
  const labelCounter = useRef(0);

  const nextLabel = useCallback(() => `T+${labelCounter.current * (tickMs / 1000)}s`, []);

  const randomStep = useCallback((v, step = 0.4, min = 0, max = 40) => {
    const delta = (Math.random() - 0.5) * step * 2;
    return clamp(parseFloat((v + delta).toFixed(2)), min, max);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (!runningRef.current) return;
      labelCounter.current += 1;

      setTimeSeries(prev => {
        const last = prev[prev.length - 1];
        const next = {
          ts: nextLabel(),
          waste: randomStep(last.waste, 0.8, 5, 40),
          recycled: randomStep(last.recycled, 0.6, 2, 30),
          organic: randomStep(last.organic, 0.4, 0.2, 15),
          energy: randomStep(last.energy, 0.4, 0.1, 10),
        };
        const arr = [...prev, next];
        if (arr.length > maxPoints) arr.shift();
        return arr;
      });

      setComposition(prev => {
        const idx = Math.floor(Math.random() * prev.length);
        return prev.map((item, i) => i === idx ? { ...item, value: clamp(item.value + (Math.random() - 0.5) * 2, 5, 60) } : item);
      });

      setRadarData(prev => prev.map(r => ({
        ...r,
        generated: clamp(r.generated + (Math.random() - 0.5) * 3, 40, 160),
        recycled: clamp(r.recycled + (Math.random() - 0.5) * 3, 20, 120),
      })));
    }, tickMs);

    return () => clearInterval(id);
  }, [tickMs, maxPoints, nextLabel, randomStep]);

  const addPoint = useCallback((point) => {
    setTimeSeries(prev => {
      const ts = point?.ts ?? `Manual ${prev.length + 1}`;
      const next = { ts, waste: 0, recycled: 0, organic: 0, energy: 0, ...point };
      const arr = [...prev, next];
      if (arr.length > maxPoints) arr.shift();
      return arr;
    });
  }, [maxPoints]);

  const updateLatest = useCallback((partial) => {
    setTimeSeries(prev => {
      if (!prev.length) return prev;
      const last = { ...prev[prev.length - 1], ...partial };
      return [...prev.slice(0, -1), last];
    });
  }, []);

  const setCompositionValue = useCallback((name, value) => {
    setComposition(prev => prev.map(c => c.name === name ? { ...c, value: Number(value) } : c));
  }, []);

  const setRunning = useCallback(v => { runningRef.current = !!v; }, []);

  const value = useMemo(() => ({
    timeSeries,
    composition,
    radarData,
    setRunning,
    addPoint,
    updateLatest,
    setCompositionValue,
  }), [timeSeries, composition, radarData, addPoint, updateLatest, setCompositionValue, setRunning]);

  return (
    <RealTimeDataContext.Provider value={value}>
      {children}
    </RealTimeDataContext.Provider>
  );
}
export default RealTimeDataProvider;