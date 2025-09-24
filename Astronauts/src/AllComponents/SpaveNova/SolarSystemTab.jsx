import React, { useRef } from 'react';

function SolarSystemTab() {
  const solarSystemRef = useRef(null);

  const switchSolarView = (viewType, event) => {
    const solarSystem = solarSystemRef.current;
    const buttons = document.querySelectorAll('#solar-system .tab-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    switch(viewType) {
      case 'map':
        solarSystem.style.transform = 'perspective(1000px) rotateX(45deg) rotateY(15deg)';
        solarSystem.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0c0c0c 100%)';
        break;
      case 'telescope':
        solarSystem.style.transform = 'perspective(1000px) rotateX(75deg)';
        solarSystem.style.background = 'radial-gradient(ellipse, #16213e 0%, #0c0c0c 70%)';
        break;
      default: // 'orbit'
        solarSystem.style.transform = 'perspective(1000px) rotateX(0deg)';
        solarSystem.style.background = 'radial-gradient(circle, #1a1a2e 0%, #0c0c0c 100%)';
        break;
    }
  };

  return (
    <div id="solar-system" className="tab-content active">
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Interactive 3D Solar System</h2>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <button className="tab-btn active" onClick={(e) => switchSolarView('orbit', e)} style={{ margin: '5px' }}>Orbital View</button>
            <button className="tab-btn" onClick={(e) => switchSolarView('map', e)} style={{ margin: '5px' }}>3D Map View</button>
            <button className="tab-btn" onClick={(e) => switchSolarView('telescope', e)} style={{ margin: '5px' }}>Telescope View</button>
        </div>
        
        <div className="solar-system" ref={solarSystemRef}>
            <div className="sun"></div>
            <div className="planet mercury" style={{ animationDelay: '0s' }}></div>
            <div className="planet venus" style={{ animationDelay: '-2s' }}></div>
            <div className="planet earth" style={{ animationDelay: '-4s' }}></div>
            <div className="planet mars" style={{ animationDelay: '-6s' }}></div>
        </div>
        
        <div className="dashboard-grid" style={{ marginTop: '30px' }}>
            <div className="widget"><h3>🌞 Sun</h3><p>Surface Temperature: 5,778 K</p><p>Core Temperature: 15 million °C</p><p>Age: 4.6 billion years</p></div>
            <div className="widget"><h3>🌍 Earth</h3><p>Distance from Sun: 149.6 million km</p><p>Orbital Period: 365.25 days</p><p>Moons: 1 (Luna)</p></div>
            <div className="widget"><h3>🔴 Mars</h3><p>Distance from Sun: 227.9 million km</p><p>Orbital Period: 687 days</p><p>Moons: 2 (Phobos, Deimos)</p></div>
        </div>
    </div>
  );
}

export default SolarSystemTab;