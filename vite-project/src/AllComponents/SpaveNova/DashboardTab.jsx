import React, { useState, useEffect, useRef } from 'react';

function DashboardTab() {
  const [liveData, setLiveData] = useState({
    issLat: '41.5707°S',
    issLon: '118.2815°E',
    issAlt: '405 km',
    issSpeed: '27,600 km/h',
    crew: '7 Astronauts',
    solarWind: '407 km/s',
    geomagnetic: 'Active',
    solarFlares: 'C2.1',
    cosmicRays: '6,432 /hr',
    radiation: 'Normal',
    auroraActivity: 'Moderate'
  });

  const [dateTime, setDateTime] = useState({
    time: '--:--:--',
    date: 'Loading...',
    utc: 'UTC: --:--:--'
  });

  const chartRef = useRef(null);

  useEffect(() => {
    const updateLiveData = () => {
      const lat = (Math.random() * 180 - 90).toFixed(4);
      const lon = (Math.random() * 360 - 180).toFixed(4);
      const geoStates = ['Quiet', 'Unsettled', 'Active', 'Minor Storm'];
      const flareTypes = ['A1.2', 'B3.4', 'C2.1', 'C5.7', 'M1.3'];

      setLiveData({
        issLat: `${Math.abs(lat)}°${lat > 0 ? 'N' : 'S'}`,
        issLon: `${Math.abs(lon)}°${lon > 0 ? 'E' : 'W'}`,
        issAlt: `${(400 + Math.random() * 20).toFixed(0)} km`,
        issSpeed: '27,600 km/h',
        crew: '7 Astronauts',
        solarWind: `${(400 + Math.random() * 100).toFixed(0)} km/s`,
        geomagnetic: geoStates[Math.floor(Math.random() * geoStates.length)],
        solarFlares: flareTypes[Math.floor(Math.random() * flareTypes.length)],
        cosmicRays: `${(6000 + Math.random() * 1000).toFixed(0)} /hr`,
        radiation: 'Normal',
        auroraActivity: 'Moderate'
      });
    };

    const updateDateTime = () => {
      const now = new Date();
      setDateTime({
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        date: now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        utc: 'UTC: ' + now.toUTCString().split(' ')[4]
      });
    };

    updateLiveData();
    updateDateTime();

    const dataInterval = setInterval(updateLiveData, 10000);
    const timeInterval = setInterval(updateDateTime, 1000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(timeInterval);
    };
  }, []);

  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const drawChart = () => {
        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);

        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(69, 183, 209, 0.3)');
        gradient.addColorStop(1, 'rgba(78, 205, 196, 0.1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = '#4ecdc4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const dataPoints = 20;
        for (let i = 0; i < dataPoints; i++) {
            const x = (i / (dataPoints - 1)) * width;
            const y = height - (Math.sin(Date.now() * 0.001 + i * 0.5) * (height / 4) + (height / 2));
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
    };

    const chartInterval = setInterval(drawChart, 100);
    return () => clearInterval(chartInterval);
  }, []);

  return (
    <div className="space-nova-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="title-section">
            <div className="rocket-icon">🚀</div>
            <h1 className="main-title">Space NOVA</h1>
          </div>
          <p className="subtitle">Interactive AI Platform for Aerospace Engineering & Space Exploration</p>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* International Space Station Panel */}
        <div className="dashboard-panel iss-panel">
          <div className="panel-header">
            <div className="panel-icon">*</div>
            <h3 className="panel-title">International Space Station</h3>
          </div>
          <div className="panel-content">
            <div className="data-row">
              <span className="data-label">Latitude:</span>
              <span className="data-value">{liveData.issLat}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Longitude:</span>
              <span className="data-value">{liveData.issLon}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Altitude:</span>
              <span className="data-value">{liveData.issAlt}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Speed:</span>
              <span className="data-value">{liveData.issSpeed}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Crew:</span>
              <span className="status-indicator status-online"></span>
              <span className="data-value">{liveData.crew}</span>
            </div>
          </div>
        </div>

        {/* Solar Activity Panel */}
        <div className="dashboard-panel solar-panel">
          <div className="panel-header">
            <div className="panel-icon">*</div>
            <h3 className="panel-title">Solar Activity</h3>
          </div>
          <div className="panel-content">
            <div className="weather-item">
              <div className="weather-label">Solar Wind</div>
              <div className="weather-value-large">{liveData.solarWind}</div>
            </div>
            <div className="weather-item">
              <div className="weather-label">Geomagnetic</div>
              <div className="weather-value">{liveData.geomagnetic}</div>
            </div>
            <div className="weather-item">
              <div className="weather-label">Solar Flares</div>
              <div className="weather-value">{liveData.solarFlares}</div>
            </div>
          </div>
        </div>

        {/* Space Weather Panel */}
        <div className="dashboard-panel weather-panel">
          <div className="panel-header">
            <div className="panel-icon">🌍</div>
            <h3 className="panel-title">Space Weather</h3>
          </div>
          <div className="panel-content">
            <div className="weather-item">
              <div className="weather-label">Cosmic Rays</div>
              <div className="weather-value-large">{liveData.cosmicRays}</div>
            </div>
            <div className="weather-item">
              <div className="weather-label">Radiation</div>
              <div className="weather-value">{liveData.radiation}</div>
            </div>
            <div className="weather-item">
              <div className="weather-label">Aurora Activity</div>
              <div className="weather-value">{liveData.auroraActivity}</div>
            </div>
          </div>
        </div>

        {/* Mission Control Time Panel */}
        <div className="dashboard-panel time-panel">
          <div className="panel-header">
            <div className="panel-icon">🕐</div>
            <h3 className="panel-title">Mission Control Time</h3>
          </div>
          <div className="panel-content">
            <div className="time-display">
              <div className="current-time">{dateTime.time}</div>
              <div className="current-date">{dateTime.date}</div>
              <div className="utc-time">{dateTime.utc}</div>
            </div>
          </div>
        </div>

        {/* Active Missions Panel */}
        <div className="dashboard-panel missions-panel">
          <div className="panel-header">
            <div className="panel-icon">🚀</div>
            <h3 className="panel-title">Active Missions</h3>
          </div>
          <div className="panel-content">
            <div className="mission-list">
              <div className="mission-item">
                <span className="status-indicator status-online"></span>
                <span className="mission-name">Artemis Program - Lunar Gateway</span>
              </div>
              <div className="mission-item">
                <span className="status-indicator status-online"></span>
                <span className="mission-name">Mars Perseverance Rover</span>
              </div>
              <div className="mission-item">
                <span className="status-indicator status-warning"></span>
                <span className="mission-name">James Webb Space Telescope</span>
              </div>
              <div className="mission-item">
                <span className="status-indicator status-online"></span>
                <span className="mission-name">Parker Solar Probe</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Data Visualization Panel */}
        <div className="dashboard-panel viz-panel">
          <div className="panel-header">
            <div className="panel-icon">📊</div>
            <h3 className="panel-title">Live Data Visualization</h3>
          </div>
          <div className="panel-content">
            <div className="chart-container">
              <canvas ref={chartRef} width="280" height="130"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardTab;