import React, { useState } from 'react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
  padding: 2rem;
  position: relative;
  overflow-x: hidden;
`;

const DashboardHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
`;

const Title = styled.h1`
  font-size: 3rem;
  background: linear-gradient(45deg, #00d4ff, #ff6b35, #8b5cf6);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 3s ease-in-out infinite;
  margin-bottom: 1rem;
  
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
`;

const Subtitle = styled.p`
  color: #a4b0be;
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ComponentCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.accentColor};
  }
`;

const ComponentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  color: #fff;
`;

const ComponentIcon = styled.div`
  font-size: 2rem;
  color: ${props => props.color};
`;

const ComponentTitle = styled.h2`
  color: #fff;
  margin: 0;
  font-size: 1.5rem;
`;

const SimpleDashboard = () => {
  const [stressLevel, setStressLevel] = useState(25);
  const [activeComponents, setActiveComponents] = useState({
    stressMonitor: true,
    hologram: false,
    novelty: false,
    vr: false
  });

  const handleStressChange = (newStressLevel) => {
    setStressLevel(newStressLevel);
  };

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

  return (
    <DashboardContainer>
      <DashboardHeader>
        <Title>
          🚀 Astronaut Stress Relief System
        </Title>
        <Subtitle>
          Advanced physiological monitoring and immersive relaxation technology
        </Subtitle>
        
        <div
          style={{
            background: stressLevel > 70 ? 'linear-gradient(90deg, #ff4757, #ff6b35)' :
                       stressLevel > 40 ? 'linear-gradient(90deg, #ffa502, #ff6b35)' :
                       'linear-gradient(90deg, #2ed573, #00d4ff)',
            borderRadius: '15px',
            padding: '1rem 2rem',
            marginBottom: '2rem',
            color: '#fff',
            fontWeight: 'bold',
            textAlign: 'center',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
            animation: 'fadeIn 0.5s ease-out'
          }}
        >
          {getStatusMessage()}
        </div>
      </DashboardHeader>

      <GridLayout>
        <ComponentCard
          accentColor="#2ed573"
          style={{ animation: 'slideInLeft 0.5s ease-out' }}
        >
          <ComponentHeader>
            <ComponentIcon color="#2ed573">🧠</ComponentIcon>
            <ComponentTitle>Stress Monitor</ComponentTitle>
          </ComponentHeader>
          <div style={{ color: '#fff' }}>
            <p>Current Stress Level: <strong>{stressLevel}%</strong></p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                onClick={() => setStressLevel(prev => Math.min(100, prev + 10))}
                style={{
                  background: '#ff6b35',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer'
                }}
              >
                Increase Stress
              </button>
              <button
                onClick={() => setStressLevel(prev => Math.max(0, prev - 10))}
                style={{
                  background: '#2ed573',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer'
                }}
              >
                Decrease Stress
              </button>
            </div>
          </div>
        </ComponentCard>

        <ComponentCard
          accentColor="#00d4ff"
          style={{ animation: 'slideInRight 0.5s ease-out' }}
        >
          <ComponentHeader>
            <ComponentIcon color="#00d4ff">👨‍👩‍👧‍👦</ComponentIcon>
            <ComponentTitle>Family Hologram</ComponentTitle>
          </ComponentHeader>
          <div style={{ color: '#fff' }}>
            <p>Status: {activeComponents.hologram ? 'Active' : 'Inactive'}</p>
            <button
              onClick={() => toggleComponent('hologram')}
              style={{
                background: activeComponents.hologram ? '#00d4ff' : 'rgba(255, 255, 255, 0.1)',
                color: activeComponents.hologram ? '#000' : '#fff',
                border: '2px solid #00d4ff',
                borderRadius: '10px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                marginTop: '1rem'
              }}
            >
              {activeComponents.hologram ? 'Deactivate' : 'Activate'} Hologram
            </button>
          </div>
        </ComponentCard>

        <ComponentCard
          accentColor="#ff6b35"
          style={{ animation: 'slideInUp 0.5s ease-out' }}
        >
          <ComponentHeader>
            <ComponentIcon color="#ff6b35">🎯</ComponentIcon>
            <ComponentTitle>Relief Activities</ComponentTitle>
          </ComponentHeader>
          <div style={{ color: '#fff' }}>
            <p>Status: {activeComponents.novelty ? 'Active' : 'Inactive'}</p>
            <button
              onClick={() => toggleComponent('novelty')}
              style={{
                background: activeComponents.novelty ? '#ff6b35' : 'rgba(255, 255, 255, 0.1)',
                color: activeComponents.novelty ? '#000' : '#fff',
                border: '2px solid #ff6b35',
                borderRadius: '10px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                marginTop: '1rem'
              }}
            >
              {activeComponents.novelty ? 'Deactivate' : 'Activate'} Activities
            </button>
          </div>
        </ComponentCard>

        <ComponentCard
          accentColor="#8b5cf6"
          style={{ animation: 'slideInUp 0.5s ease-out 0.2s both' }}
        >
          <ComponentHeader>
            <ComponentIcon color="#8b5cf6">🥽</ComponentIcon>
            <ComponentTitle>VR Environment</ComponentTitle>
          </ComponentHeader>
          <div style={{ color: '#fff' }}>
            <p>Status: {activeComponents.vr ? 'Active' : 'Inactive'}</p>
            <button
              onClick={() => toggleComponent('vr')}
              style={{
                background: activeComponents.vr ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)',
                color: activeComponents.vr ? '#000' : '#fff',
                border: '2px solid #8b5cf6',
                borderRadius: '10px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                marginTop: '1rem'
              }}
            >
              {activeComponents.vr ? 'Deactivate' : 'Activate'} VR
            </button>
          </div>
        </ComponentCard>
      </GridLayout>
    </DashboardContainer>
  );
};

export default SimpleDashboard;
