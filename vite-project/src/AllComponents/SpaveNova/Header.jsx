import React from 'react';

function Header({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'dashboard', name: 'Live Dashboard' },
    { id: 'solar-system', name: '3D Solar System' },
    { id: 'voice-ai', name: 'Voice Assistant' },
    { id: 'chat', name: 'AI Chat' },
    { id: 'data-viz', name: 'Data Analytics' },
    { id: 'gallery', name: 'Space Gallery' },
  ];

  return (
    <header className="header">
      <div className="logo">🚀 Space NOVA</div>
      <p>Interactive AI Platform for Aerospace Engineering & Space Exploration</p>

      <div className="nav-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
          </button>
        ))}
      </div>
    </header>
  );
}

export default Header;