import React from 'react';

function DataVizTab() {
  return (
    <div id="data-viz" className="tab-content active">
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>📊 Mission Analytics & Performance</h2>
        
        <div className="data-viz">
            <div className="chart-container">
                <h3>Mission Success Rate</h3>
                <div className="chart">
                    <div className="chart-bar" style={{ left: '20px', '--height': '85%', background: '#4caf50' }}></div>
                    <div className="chart-bar" style={{ left: '50px', '--height': '92%', background: '#2196f3' }}></div>
                    <div className="chart-bar" style={{ left: '80px', '--height': '78%', background: '#ff9800' }}></div>
                    <div className="chart-bar" style={{ left: '110px', '--height': '95%', background: '#9c27b0' }}></div>
                    <div style={{ position: 'absolute', bottom: '10px', fontSize: '0.9rem' }}>Mars | Moon | ISS | Deep Space</div>
                </div>
            </div>
            
            <div className="chart-container">
                <h3>Launch Frequency</h3>
                <div className="chart">
                    <div className="chart-bar" style={{ left: '30px', '--height': '60%', background: '#45b7d1' }}></div>
                    <div className="chart-bar" style={{ left: '60px', '--height': '80%', background: '#4ecdc4' }}></div>
                    <div className="chart-bar" style={{ left: '90px', '--height': '95%', background: '#96ceb4' }}></div>
                    <div style={{ position: 'absolute', bottom: '10px', fontSize: '0.9rem' }}>2022 | 2023 | 2024</div>
                </div>
            </div>
            
            <div className="chart-container">
                <h3>Budget Allocation</h3>
                <div className="chart" style={{ background: 'conic-gradient(#ff6b6b 0deg 120deg, #4ecdc4 120deg 240deg, #45b7d1 240deg 360deg)', borderRadius: '50%' }}>
                    <div style={{ background: 'rgba(0,0,0,0.8)', borderRadius: '50%', width: '60%', height: '60%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <div style={{ fontSize: '0.8rem' }}>Exploration 33%</div>
                        <div style={{ fontSize: '0.8rem' }}>Research 33%</div>
                        <div style={{ fontSize: '0.8rem' }}>Operations 34%</div>
                    </div>
                </div>
            </div>

            <div className="chart-container">
                <h3>Astronaut Training Hours</h3>
                <div className="chart">
                    <div className="chart-bar" style={{ left: '20px', '--height': '70%', background: '#e74c3c' }}></div>
                    <div className="chart-bar" style={{ left: '40px', '--height': '85%', background: '#f39c12' }}></div>
                    <div className="chart-bar" style={{ left: '60px', '--height': '90%', background: '#27ae60' }}></div>
                    <div className="chart-bar" style={{ left: '80px', '--height': '95%', background: '#3498db' }}></div>
                    <div className="chart-bar" style={{ left: '100px', '--height': '88%', background: '#9b59b6' }}></div>
                    <div style={{ position: 'absolute', bottom: '10px', fontSize: '0.8rem' }}>Basic | EVA | Robotics | Science | Leadership</div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default DataVizTab;