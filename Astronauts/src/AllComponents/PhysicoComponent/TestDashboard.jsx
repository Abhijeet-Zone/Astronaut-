import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const TestContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
  padding: 2rem;
  color: #fff;
`;

const TestCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  margin: 2rem 0;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const TestDashboard = () => {
  const [stressLevel, setStressLevel] = useState(25);

  return (
    <TestContainer>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          textAlign: 'center',
          fontSize: '3rem',
          background: 'linear-gradient(45deg, #00d4ff, #ff6b35, #8b5cf6)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '2rem'
        }}
      >
        🚀 Astronaut Stress Relief System
      </motion.h1>

      <TestCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ color: '#00d4ff', marginBottom: '1rem' }}>
          🧠 System Status
        </h2>
        <p>Stress Level: {stressLevel}%</p>
        <p>Status: {stressLevel > 70 ? 'High Stress' : stressLevel > 40 ? 'Moderate Stress' : 'Normal'}</p>
        
        <button
          onClick={() => setStressLevel(prev => Math.min(100, prev + 10))}
          style={{
            background: '#ff6b35',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '1rem 2rem',
            margin: '1rem',
            cursor: 'pointer',
            fontSize: '1rem'
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
            padding: '1rem 2rem',
            margin: '1rem',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Decrease Stress
        </button>
      </TestCard>

      <TestCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 style={{ color: '#ff6b35', marginBottom: '1rem' }}>
          🎯 Components Status
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(0, 212, 255, 0.1)', borderRadius: '10px' }}>
            <h3>🧠 Stress Monitor</h3>
            <p>✅ Ready</p>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(255, 107, 53, 0.1)', borderRadius: '10px' }}>
            <h3>👨‍👩‍👧‍👦 Hologram</h3>
            <p>✅ Ready</p>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '10px' }}>
            <h3>🥽 VR Scene</h3>
            <p>✅ Ready</p>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(46, 213, 115, 0.1)', borderRadius: '10px' }}>
            <h3>🎯 Activities</h3>
            <p>✅ Ready</p>
          </div>
        </div>
      </TestCard>

      <TestCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 style={{ color: '#8b5cf6', marginBottom: '1rem' }}>
          🚀 Next Steps
        </h2>
        <p>1. Test basic stress monitoring</p>
        <p>2. Enable hologram display</p>
        <p>3. Activate VR environment</p>
        <p>4. Start stress relief activities</p>
      </TestCard>
    </TestContainer>
  );
};

export default TestDashboard;
