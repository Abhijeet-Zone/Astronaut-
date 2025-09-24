import React, { useState, useEffect, useRef } from 'react';

function DashboardTab() {
  const [liveData, setLiveData] = useState({
    issLat: '51.6461°N',
    issLon: '0.0939°W',
    issAlt: '408 km',
    solarWind: '425 km/s',
    geomagnetic: 'Quiet',
    solarFlares: 'C2.1'
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
        solarWind: `${(400 + Math.random() * 100).toFixed(0)} km/s`,
        geomagnetic: geoStates[Math.floor(Math.random() * geoStates.length)],
        solarFlares: flareTypes[Math.floor(Math.random() * flareTypes.length)],
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
    <div className="tab-content active">
        <div className="dashboard-grid">
            <div className="widget iss-tracker">
                <h3>🛰 International Space Station</h3>
                <div className="iss-position">
                    <div className="coordinates">
                        <div>Latitude: <span>{liveData.issLat}</span></div>
                        <div>Longitude: <span>{liveData.issLon}</span></div>
                        <div>Altitude: <span>{liveData.issAlt}</span></div>
                    </div>
                    <div>Speed: <span>27,600 km/h</span></div>
                    <div>Crew: <span className="status-indicator status-online"></span>7 Astronauts</div>
                </div>
            </div>

            <div className="widget">
                <h3>☀ Solar Activity</h3>
                <div className="weather-data">
                    <div className="weather-item">
                        <div>Solar Wind</div>
                        <div className="weather-value">{liveData.solarWind}</div>
                    </div>
                    <div className="weather-item">
                        <div>Geomagnetic</div>
                        <div className="weather-value">{liveData.geomagnetic}</div>
                    </div>
                    <div className="weather-item">
                        <div>Solar Flares</div>
                        <div className="weather-value">{liveData.solarFlares}</div>
                    </div>
                </div>
            </div>

            <div className="widget">
                <h3>🌍 Space Weather</h3>
                <div className="weather-data">
                    <div className="weather-item"><div>Cosmic Rays</div><div className="weather-value">6,432 /hr</div></div>
                    <div className="weather-item"><div>Radiation</div><div className="weather-value">Normal</div></div>
                    <div className="weather-item"><div>Aurora Activity</div><div className="weather-value">Moderate</div></div>
                </div>
            </div>

            <div className="widget">
                <h3>🕐 Mission Control Time</h3>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', color: '#4ecdc4', margin: '10px 0' }}>{dateTime.time}</div>
                    <div style={{ fontSize: '1rem', margin: '5px 0' }}>{dateTime.date}</div>
                    <div style={{ fontSize: '0.9rem', color: '#45b7d1' }}>{dateTime.utc}</div>
                </div>
            </div>

             <div className="widget">
                <h3>🚀 Active Missions</h3>
                <div style={{ textAlign: 'left' }}>
                    <div style={{ margin: '10px 0' }}><span className="status-indicator status-online"></span>Artemis Program - Lunar Gateway</div>
                    <div style={{ margin: '10px 0' }}><span className="status-indicator status-online"></span>Mars Perseverance Rover</div>
                    <div style={{ margin: '10px 0' }}><span className="status-indicator status-warning"></span>James Webb Space Telescope</div>
                    <div style={{ margin: '10px 0' }}><span className="status-indicator status-online"></span>Parker Solar Probe</div>
                </div>
            </div>

             <div className="widget">
                <h3>📊 Live Data Visualization</h3>
                <div className="chart" style={{ height: '150px' }}>
                    <canvas ref={chartRef} width="280" height="130" style={{ borderRadius: '10px' }}></canvas>
                </div>
            </div>
            
            <div className="widget">
                <h3>📋 Mission Reports</h3>
                <div style={{ textAlign: 'left', fontSize: '0.9rem' }}>
                    <div style={{ margin: '8px 0', padding: '8px', background: 'rgba(76, 175, 80, 0.2)', borderRadius: '5px' }}>✅ ISS Docking Successful - 14:32 UTC</div>
                    <div style={{ margin: '8px 0', padding: '8px', background: 'rgba(255, 152, 0, 0.2)', borderRadius: '5px' }}>⚠ Solar Panel Adjustment - 12:15 UTC</div>
                    <div style={{ margin: '8px 0', padding: '8px', background: 'rgba(33, 150, 243, 0.2)', borderRadius: '5px' }}>ℹ Crew EVA Scheduled - 16:00 UTC</div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default DashboardTab;