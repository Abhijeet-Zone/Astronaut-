import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import StressMonitor from './StressMonitor';
import HologramDisplay from './HologramDisplay';
import NoveltyPipeline from './NoveltyPipeline';
import VRScene from './VRScene';
import StressSimulator from './StressSimulator';
import { 
  FaHeartbeat, 
  FaUsers, 
  FaGamepad, 
  FaVrCardboard,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle
} from 'react-icons/fa';

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

const Title = styled(motion.h1)`
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

const StatusBanner = styled(motion.div)`
  background: ${props => {
    if (props.stressLevel > 70) return 'linear-gradient(90deg, #ff4757, #ff6b35)';
    if (props.stressLevel > 40) return 'linear-gradient(90deg, #ffa502, #ff6b35)';
    return 'linear-gradient(90deg, #2ed573, #00d4ff)';
  }};
  border-radius: 15px;
  padding: 1rem 2rem;
  margin-bottom: 2rem;
  color: #fff;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ComponentCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  
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

const AlertSystem = styled(motion.div)`
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 1000;
  max-width: 400px;
`;

const AlertCard = styled(motion.div)`
  background: ${props => {
    if (props.type === 'critical') return 'linear-gradient(135deg, #ff4757, #ff6b35)';
    if (props.type === 'warning') return 'linear-gradient(135deg, #ffa502, #ff6b35)';
    return 'linear-gradient(135deg, #2ed573, #00d4ff)';
  }};
  border-radius: 15px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border-left: 4px solid #fff;
`;

const AlertIcon = styled.div`
  font-size: 1.5rem;
  margin-right: 0.5rem;
`;

const AlertContent = styled.div`
  display: flex;
  align-items: center;
`;

const AlertText = styled.div`
  flex: 1;
`;

const AlertTitle = styled.div`
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const AlertMessage = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const ControlsPanel = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ControlButton = styled.button`
  background: ${props => props.active ? props.color : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? '#000' : '#fff'};
  border: 2px solid ${props => props.color};
  border-radius: 10px;
  padding: 1rem 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  margin: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.color};
    color: #000;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

const Dashboard = () => {
  const [stressLevel, setStressLevel] = useState(25);
  const [alerts, setAlerts] = useState([]);
  const [activeComponents, setActiveComponents] = useState({
    stressMonitor: true,
    hologram: false,
    novelty: false,
    vr: false
  });
  const [simulationMode, setSimulationMode] = useState(false);

  // Handle stress level changes
  const handleStressChange = (newStressLevel) => {
    setStressLevel(newStressLevel);
    
    // Generate alerts based on stress level
    if (newStressLevel > 80 && !alerts.find(a => a.type === 'critical')) {
      addAlert({
        type: 'critical',
        title: 'Critical Stress Detected!',
        message: 'Emergency protocols activated. Hologram and VR systems engaged.',
        icon: <FaExclamationTriangle />
      });
    } else if (newStressLevel > 60 && !alerts.find(a => a.type === 'warning')) {
      addAlert({
        type: 'warning',
        title: 'High Stress Alert',
        message: 'Stress relief systems recommended. Consider family hologram or VR relaxation.',
        icon: <FaInfoCircle />
      });
    } else if (newStressLevel < 30 && alerts.length > 0) {
      addAlert({
        type: 'success',
        title: 'Stress Levels Normal',
        message: 'All systems functioning optimally. Great job managing stress!',
        icon: <FaCheckCircle />
      });
    }
  };

  // Add alert to the system
  const addAlert = (alert) => {
    const newAlert = {
      id: Date.now(),
      ...alert,
      timestamp: new Date()
    };
    
    setAlerts(prev => [newAlert, ...prev.slice(0, 4)]); // Keep only 5 alerts max
    
    // Auto-remove success alerts after 5 seconds
    if (alert.type === 'success') {
      setTimeout(() => {
        setAlerts(prev => prev.filter(a => a.id !== newAlert.id));
      }, 5000);
    }
  };

  // Remove alert
  const removeAlert = (alertId) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  // Toggle component visibility
  const toggleComponent = (component) => {
    setActiveComponents(prev => ({
      ...prev,
      [component]: !prev[component]
    }));
  };

  // Start stress simulation
  const startSimulation = () => {
    setSimulationMode(true);
    setStressLevel(25);
    
    // Gradually increase stress over time
    const interval = setInterval(() => {
      setStressLevel(prev => {
        const newLevel = Math.min(100, prev + Math.random() * 15);
        if (newLevel >= 100) {
          clearInterval(interval);
          setSimulationMode(false);
        }
        return newLevel;
      });
    }, 3000);
  };

  // Handle activity triggers
  const handleActivityStart = (activity) => {
    console.log('Activity started:', activity);
    // In a real implementation, this would trigger the actual activity
  };

  const handleVRStart = (scene) => {
    console.log('VR scene started:', scene);
    // In a real implementation, this would start the VR experience
  };

  const handleMemberSelect = (member) => {
    console.log('Family member selected:', member);
    // In a real implementation, this would activate the hologram
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
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          🚀 Astronaut Stress Relief System
        </Title>
        <Subtitle>
          Advanced physiological monitoring and immersive relaxation technology
        </Subtitle>
        
        <StatusBanner
          stressLevel={stressLevel}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {getStatusMessage()}
        </StatusBanner>
      </DashboardHeader>

      <ControlsPanel>
        <h3 style={{ color: '#fff', marginBottom: '1rem', textAlign: 'center' }}>
          System Controls
        </h3>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <ControlButton
            active={activeComponents.stressMonitor}
            onClick={() => toggleComponent('stressMonitor')}
            color="#2ed573"
          >
            <FaHeartbeat /> Stress Monitor
          </ControlButton>
          <ControlButton
            active={activeComponents.hologram}
            onClick={() => toggleComponent('hologram')}
            color="#00d4ff"
          >
            <FaUsers /> Family Hologram
          </ControlButton>
          <ControlButton
            active={activeComponents.novelty}
            onClick={() => toggleComponent('novelty')}
            color="#ff6b35"
          >
            <FaGamepad /> Activities
          </ControlButton>
          <ControlButton
            active={activeComponents.vr}
            onClick={() => toggleComponent('vr')}
            color="#8b5cf6"
          >
            <FaVrCardboard /> VR Environment
          </ControlButton>
          <ControlButton
            active={simulationMode}
            onClick={startSimulation}
            color="#ff4757"
          >
            🧪 Start Stress Simulation
          </ControlButton>
        </div>
      </ControlsPanel>

      <GridLayout>
        <AnimatePresence>
          {activeComponents.stressMonitor && (
            <ComponentCard
              key="stress-monitor"
              accentColor="#2ed573"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <ComponentHeader>
                <ComponentIcon color="#2ed573">
                  <FaHeartbeat />
                </ComponentIcon>
                <ComponentTitle>Physiological Monitor</ComponentTitle>
              </ComponentHeader>
              <StressMonitor onStressChange={handleStressChange} />
            </ComponentCard>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeComponents.hologram && (
            <ComponentCard
              key="hologram"
              accentColor="#00d4ff"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <ComponentHeader>
                <ComponentIcon color="#00d4ff">
                  <FaUsers />
                </ComponentIcon>
                <ComponentTitle>Family Hologram</ComponentTitle>
              </ComponentHeader>
              <HologramDisplay 
                stressLevel={stressLevel} 
                onMemberSelect={handleMemberSelect}
              />
            </ComponentCard>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeComponents.novelty && (
            <ComponentCard
              key="novelty"
              accentColor="#ff6b35"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
            >
              <ComponentHeader>
                <ComponentIcon color="#ff6b35">
                  <FaGamepad />
                </ComponentIcon>
                <ComponentTitle>Relief Activities</ComponentTitle>
              </ComponentHeader>
              <NoveltyPipeline 
                stressLevel={stressLevel} 
                onActivityStart={handleActivityStart}
              />
            </ComponentCard>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeComponents.vr && (
            <ComponentCard
              key="vr"
              accentColor="#8b5cf6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
            >
              <ComponentHeader>
                <ComponentIcon color="#8b5cf6">
                  <FaVrCardboard />
                </ComponentIcon>
                <ComponentTitle>VR Environment</ComponentTitle>
              </ComponentHeader>
              <VRScene 
                stressLevel={stressLevel} 
                onVRStart={handleVRStart}
              />
            </ComponentCard>
          )}
        </AnimatePresence>
      </GridLayout>

      <AlertSystem>
        <AnimatePresence>
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              type={alert.type}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ duration: 0.3 }}
              onClick={() => removeAlert(alert.id)}
              style={{ cursor: 'pointer' }}
            >
              <AlertContent>
                <AlertIcon>{alert.icon}</AlertIcon>
                <AlertText>
                  <AlertTitle>{alert.title}</AlertTitle>
                  <AlertMessage>{alert.message}</AlertMessage>
                </AlertText>
              </AlertContent>
            </AlertCard>
          ))}
        </AnimatePresence>
      </AlertSystem>
    </DashboardContainer>
  );
};

export default Dashboard;
