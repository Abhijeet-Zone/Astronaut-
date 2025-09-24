import React, { useState } from 'react';

const BasicDashboard = () => {
  const [stressLevel, setStressLevel] = useState(25);
  const [activeComponents, setActiveComponents] = useState({
    stressMonitor: true,
    hologram: false,
    novelty: false,
    vr: false
  });

  const toggleComponent = (component) => {
    setActiveComponents(prev => ({
      ...prev,
      [component]: !prev[component]
    }));
  };

  const getStatusMessage = () => {
    if (stressLevel > 80) return "🚨 CRITICAL STRESS - Emergency protocols active";
    if (stressLevel > 60) return "⚠️ HIGH STRESS - Relief systems recommended";
    if (stressLevel > 40) return "💡 MODERATE STRESS - Monitor closely";
    return "✅ NORMAL STRESS - All systems optimal";
  };

  const getStatusColor = () => {
    if (stressLevel > 70) return 'linear-gradient(90deg, #ff4757, #ff6b35)';
    if (stressLevel > 40) return 'linear-gradient(90deg, #ffa502, #ff6b35)';
    return 'linear-gradient(90deg, #2ed573, #00d4ff)';
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
      padding: '2rem',
      color: '#fff',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem'
    },
    title: {
      fontSize: '3rem',
      background: 'linear-gradient(45deg, #00d4ff, #ff6b35, #8b5cf6)',
      backgroundSize: '200% 200%',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      animation: 'gradientShift 3s ease-in-out infinite',
      marginBottom: '1rem'
    },
    subtitle: {
      color: '#a4b0be',
      fontSize: '1.2rem',
      marginBottom: '2rem'
    },
    statusBanner: {
      background: getStatusColor(),
      borderRadius: '15px',
      padding: '1rem 2rem',
      marginBottom: '2rem',
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
      animation: 'fadeIn 0.5s ease-out'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '2rem',
      marginBottom: '2rem'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '20px',
      padding: '1.5rem',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1rem',
      color: '#fff'
    },
    cardIcon: {
      fontSize: '2rem'
    },
    cardTitle: {
      color: '#fff',
      margin: 0,
      fontSize: '1.5rem'
    },
    button: {
      background: '#ff6b35',
      color: '#fff',
      border: 'none',
      borderRadius: '10px',
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      margin: '0.25rem',
      fontSize: '1rem',
      transition: 'all 0.3s ease'
    },
    buttonGreen: {
      background: '#2ed573',
      color: '#fff',
      border: 'none',
      borderRadius: '10px',
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      margin: '0.25rem',
      fontSize: '1rem',
      transition: 'all 0.3s ease'
    },
    toggleButton: {
      border: '2px solid',
      borderRadius: '10px',
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      marginTop: '1rem',
      fontSize: '1rem',
      transition: 'all 0.3s ease'
    }
  };

  return (
    <div className='w-screen' style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          🚀 Astronaut Stress Relief System
        </h1>
        <p style={styles.subtitle}>
          Advanced physiological monitoring and immersive relaxation technology
        </p>
        
        <div style={styles.statusBanner}>
          {getStatusMessage()}
        </div>
      </div>

      <div style={styles.grid}>
        <div style={{...styles.card, borderTop: '3px solid #2ed573', animation: 'slideInLeft 0.5s ease-out'}}>
          <div style={styles.cardHeader}>
            <div style={{...styles.cardIcon, color: '#2ed573'}}>🧠</div>
            <h2 style={styles.cardTitle}>Stress Monitor</h2>
          </div>
          <div style={{ color: '#fff' }}>
            <p>Current Stress Level: <strong>{stressLevel}%</strong></p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setStressLevel(prev => Math.min(100, prev + 10))}
                style={styles.button}
                onMouseOver={(e) => e.target.style.background = '#e55a2b'}
                onMouseOut={(e) => e.target.style.background = '#ff6b35'}
              >
                Increase Stress
              </button>
              <button
                onClick={() => setStressLevel(prev => Math.max(0, prev - 10))}
                style={styles.buttonGreen}
                onMouseOver={(e) => e.target.style.background = '#27ae60'}
                onMouseOut={(e) => e.target.style.background = '#2ed573'}
              >
                Decrease Stress
              </button>
            </div>
          </div>
        </div>

        <div style={{...styles.card, borderTop: '3px solid #00d4ff', animation: 'slideInRight 0.5s ease-out'}}>
          <div style={styles.cardHeader}>
            <div style={{...styles.cardIcon, color: '#00d4ff'}}>👨‍👩‍👧‍👦</div>
            <h2 style={styles.cardTitle}>Family Hologram</h2>
          </div>
          <div style={{ color: '#fff' }}>
            <p>Status: {activeComponents.hologram ? 'Active' : 'Inactive'}</p>
            <button
              onClick={() => toggleComponent('hologram')}
              style={{
                ...styles.toggleButton,
                background: activeComponents.hologram ? '#00d4ff' : 'rgba(255, 255, 255, 0.1)',
                color: activeComponents.hologram ? '#000' : '#fff',
                borderColor: '#00d4ff'
              }}
              onMouseOver={(e) => {
                if (!activeComponents.hologram) {
                  e.target.style.background = '#00d4ff';
                  e.target.style.color = '#000';
                }
              }}
              onMouseOut={(e) => {
                if (!activeComponents.hologram) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.color = '#fff';
                }
              }}
            >
              {activeComponents.hologram ? 'Deactivate' : 'Activate'} Hologram
            </button>
          </div>
        </div>

        <div style={{...styles.card, borderTop: '3px solid #ff6b35', animation: 'slideInUp 0.5s ease-out'}}>
          <div style={styles.cardHeader}>
            <div style={{...styles.cardIcon, color: '#ff6b35'}}>🎯</div>
            <h2 style={styles.cardTitle}>Relief Activities</h2>
          </div>
          <div style={{ color: '#fff' }}>
            <p>Status: {activeComponents.novelty ? 'Active' : 'Inactive'}</p>
            <button
              onClick={() => toggleComponent('novelty')}
              style={{
                ...styles.toggleButton,
                background: activeComponents.novelty ? '#ff6b35' : 'rgba(255, 255, 255, 0.1)',
                color: activeComponents.novelty ? '#000' : '#fff',
                borderColor: '#ff6b35'
              }}
              onMouseOver={(e) => {
                if (!activeComponents.novelty) {
                  e.target.style.background = '#ff6b35';
                  e.target.style.color = '#000';
                }
              }}
              onMouseOut={(e) => {
                if (!activeComponents.novelty) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.color = '#fff';
                }
              }}
            >
              {activeComponents.novelty ? 'Deactivate' : 'Activate'} Activities
            </button>
          </div>
        </div>

        <div style={{...styles.card, borderTop: '3px solid #8b5cf6', animation: 'slideInUp 0.5s ease-out 0.2s both'}}>
          <div style={styles.cardHeader}>
            <div style={{...styles.cardIcon, color: '#8b5cf6'}}>🥽</div>
            <h2 style={styles.cardTitle}>VR Environment</h2>
          </div>
          <div style={{ color: '#fff' }}>
            <p>Status: {activeComponents.vr ? 'Active' : 'Inactive'}</p>
            <button
              onClick={() => toggleComponent('vr')}
              style={{
                ...styles.toggleButton,
                background: activeComponents.vr ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)',
                color: activeComponents.vr ? '#000' : '#fff',
                borderColor: '#8b5cf6'
              }}
              onMouseOver={(e) => {
                if (!activeComponents.vr) {
                  e.target.style.background = '#8b5cf6';
                  e.target.style.color = '#000';
                }
              }}
              onMouseOut={(e) => {
                if (!activeComponents.vr) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.color = '#fff';
                }
              }}
            >
              {activeComponents.vr ? 'Deactivate' : 'Activate'} VR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicDashboard;
