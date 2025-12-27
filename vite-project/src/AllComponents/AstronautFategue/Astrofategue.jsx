import React, { useState, useEffect } from 'react';

import Background from './Background';
import Header from './Header';
import InputsPanel from './InputsPanel';
import GaugePanel from './GaugePanel';
import AlertsPanel from './AlertsPanel';
import "./Astrofate.css";

function Astrofategue() {
  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    hr: '88',
    hrv: '32',
    spo2: '97',
    sleep: '5.5',
    activity: '8',
  });
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- CONFIGURATION ---
  // Use relative path; Vite dev server will proxy /api to Flask (see vite.config.js)
  const API_URL = `/api/calculate_fatigue`;

  useEffect(() => {
    // Auto-process data when component loads
    processFatigueData();
  }, []);

  // --- EVENT HANDLERS & LOGIC ---
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const processFatigueData = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);

    console.log('Form data before processing:', formData);

    const payload = {
      hr: formData.hr && formData.hr !== '' ? parseInt(formData.hr) : 0,
      hrv: formData.hrv && formData.hrv !== '' ? parseInt(formData.hrv) : 0,
      spo2: formData.spo2 && formData.spo2 !== '' ? parseInt(formData.spo2) : 0,
      sleep: formData.sleep && formData.sleep !== '' ? parseFloat(formData.sleep) : 0,
      activity: formData.activity && formData.activity !== '' ? parseInt(formData.activity) : 0,
    };
    
    console.log('Sending payload:', payload);

    try {
      // Try a best-effort health check, but do not block the main request
      let healthWarning = '';
      try {
        const healthRes = await fetch('/api/health');
        if (!healthRes.ok) {
          let msg = `health ${healthRes.status}`;
          try { const t = await healthRes.text(); if (t) msg += `: ${t}`; } catch (_) {}
          healthWarning = `Backend ${msg}`;
        }
      } catch (healthErr) {
        healthWarning = `Backend healthcheck failed: ${healthErr.message}`;
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Try to parse JSON safely, even on non-OK responses.
      let data = null;
      let text = '';
      try {
        data = await response.json();
      } catch (parseErr) {
        try { text = await response.text(); } catch (_) {}
      }

      if (!response.ok) {
        const message = (data && (data.error || data.message)) || text || `HTTP error ${response.status}`;
        throw new Error(message);
      }

      if (!data) {
        // No JSON but OK status; treat as error for the UI
        const msg = text && text.trim().length > 0 ? text : 'Empty response from server';
        throw new Error(msg);
      }

      // success
      console.log('Received response:', data);
      setApiData(data);
    } catch (err) {
      console.error('Error fetching fatigue data:', err);
      setError(`Failed to connect to backend: ${err.message}. Is the server running?`);
    } finally {
      setIsLoading(false);
    }
  };

  const fillWithDemoData = () => {
    const demoData = {
      hr: '88',
      hrv: '32',
      spo2: '97',
      sleep: '5.5',
      activity: '8',
    };
    console.log('Setting demo data:', demoData);
    setFormData(demoData);
  };

  const fillWithRandomData = () => {
    const rand = (min, max, decimals = 0) => (Math.random() * (max - min) + min).toFixed(decimals);
    setFormData({
      hr: rand(55, 110),
      hrv: rand(25, 90),
      spo2: rand(94, 100),
      sleep: rand(4.0, 8.5, 1),
      activity: rand(1, 10),
    });
  };

  return (
    <>
      <Background />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header onDemo={fillWithDemoData} onRandomize={fillWithRandomData} />
        <main className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-6 px-6 lg:px-10 py-6">
          <InputsPanel
            formData={formData}
            apiData={apiData}
            isLoading={isLoading}
            handleInputChange={handleInputChange}
            processFatigueData={processFatigueData}
          />
          <GaugePanel formData={formData} apiData={apiData} error={error} />
          <AlertsPanel apiData={apiData} error={error} />
        </main>
      </div>
    </>
  );
}

export default Astrofategue;
