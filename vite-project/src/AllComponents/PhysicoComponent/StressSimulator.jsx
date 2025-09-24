import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FaPlay, FaPause, FaStop, FaChartLine } from 'react-icons/fa';

const SimulatorContainer = styled.div`
  background: linear-gradient(135deg, #2c1810 0%, #3d2817 100%);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 2px solid #ff6b35;
  margin-bottom: 2rem;
`;

const SimulatorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  color: #fff;
`;

const SimulatorIcon = styled.div`
  font-size: 2rem;
  color: #ff6b35;
`;

const SimulatorTitle = styled.h2`
  color: #fff;
  margin: 0;
  font-size: 1.5rem;
`;

const SimulationControls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const ControlButton = styled.button`
  background: ${props => {
    if (props.variant === 'start') return '#2ed573';
    if (props.variant === 'pause') return '#ffa502';
    if (props.variant === 'stop') return '#ff4757';
    return 'rgba(255, 255, 255, 0.1)';
  }};
  color: ${props => props.variant ? '#000' : '#fff'};
  border: 2px solid ${props => {
    if (props.variant === 'start') return '#2ed573';
    if (props.variant === 'pause') return '#ffa502';
    if (props.variant === 'stop') return '#ff4757';
    return '#ff6b35';
  }};
  border-radius: 10px;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SimulationStatus = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #fff;
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StatusDot = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => {
    if (props.status === 'running') return '#2ed573';
    if (props.status === 'paused') return '#ffa502';
    return '#535c68';
  }};
  box-shadow: 0 0 10px ${props => {
    if (props.status === 'running') return '#2ed573';
    if (props.status === 'paused') return '#ffa502';
    return 'transparent';
  }};
  animation: ${props => props.status === 'running' ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

const SimulationScenarios = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ScenarioCard = styled(motion.div)`
  background: ${props => props.active ? 'linear-gradient(135deg, #ff6b35, #f7931e)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 15px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.active ? '#ff6b35' : 'transparent'};
  text-align: center;
  color: #fff;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 107, 53, 0.3);
  }
`;

const ScenarioTitle = styled.h3`
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;

const ScenarioDescription = styled.p`
  font-size: 0.9rem;
  color: #a4b0be;
  margin-bottom: 0.5rem;
`;

const ScenarioDuration = styled.div`
  font-size: 0.8rem;
  color: #ff6b35;
  font-weight: bold;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin: 1rem 0;
`;

const Progress = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #ff6b35, #f7931e);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const StressSimulator = ({ onStressChange, onScenarioComplete }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStress, setCurrentStress] = useState(25);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const scenarios = [
    {
      id: 'gradual',
      title: 'Gradual Stress Build',
      description: 'Slowly increases stress over time',
      duration: 60,
      pattern: 'linear',
      maxStress: 85
    },
    {
      id: 'sudden',
      title: 'Sudden Stress Spike',
      description: 'Rapid stress increase with peaks',
      duration: 45,
      pattern: 'spike',
      maxStress: 95
    },
    {
      id: 'cyclical',
      title: 'Cyclical Stress',
      description: 'Stress rises and falls in waves',
      duration: 90,
      pattern: 'cyclical',
      maxStress: 80
    },
    {
      id: 'emergency',
      title: 'Emergency Scenario',
      description: 'Critical stress situation',
      duration: 30,
      pattern: 'emergency',
      maxStress: 100
    }
  ];

  // Calculate stress based on scenario pattern
  const calculateStress = (scenario, elapsed, totalDuration) => {
    const progress = elapsed / totalDuration;
    
    switch (scenario.pattern) {
      case 'linear':
        return 25 + (scenario.maxStress - 25) * progress;
      case 'spike':
        return 25 + (scenario.maxStress - 25) * Math.sin(progress * Math.PI * 3) * 0.5 + progress * 0.5;
      case 'cyclical':
        return 25 + (scenario.maxStress - 25) * (Math.sin(progress * Math.PI * 4) * 0.3 + progress * 0.7);
      case 'emergency':
        return 25 + (scenario.maxStress - 25) * Math.pow(progress, 0.5);
      default:
        return 25;
    }
  };

  // Start simulation
  const startSimulation = (scenario) => {
    setCurrentScenario(scenario);
    setIsRunning(true);
    setIsPaused(false);
    setProgress(0);
    setCurrentStress(25);
    setTimeElapsed(0);
  };

  // Pause/Resume simulation
  const togglePause = () => {
    if (isRunning) {
      setIsPaused(!isPaused);
    }
  };

  // Stop simulation
  const stopSimulation = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentScenario(null);
    setProgress(0);
    setCurrentStress(25);
    setTimeElapsed(0);
  };

  // Simulation loop
  useEffect(() => {
    if (isRunning && !isPaused && currentScenario) {
      const interval = setInterval(() => {
        setTimeElapsed(prev => {
          const newElapsed = prev + 1;
          const newProgress = (newElapsed / (currentScenario.duration * 10)) * 100;
          const newStress = calculateStress(currentScenario, newElapsed, currentScenario.duration * 10);
          
          setProgress(newProgress);
          setCurrentStress(Math.round(newStress));
          
          // Notify parent component
          if (onStressChange) {
            onStressChange(Math.round(newStress));
          }
          
          // Check if simulation is complete
          if (newElapsed >= currentScenario.duration * 10) {
            setIsRunning(false);
            setIsPaused(false);
            if (onScenarioComplete) {
              onScenarioComplete(currentScenario);
            }
          }
          
          return newElapsed;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isRunning, isPaused, currentScenario, onStressChange, onScenarioComplete]);

  const getStatusText = () => {
    if (!isRunning) return 'Ready to start simulation';
    if (isPaused) return 'Simulation paused';
    return `Running: ${currentScenario?.title}`;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SimulatorContainer>
        <SimulatorHeader>
          <SimulatorIcon>
            <FaChartLine />
          </SimulatorIcon>
          <SimulatorTitle>Stress Simulation Laboratory</SimulatorTitle>
        </SimulatorHeader>

        <SimulationStatus>
          <StatusIndicator>
            <StatusDot status={isRunning ? (isPaused ? 'paused' : 'running') : 'stopped'} />
            <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
              {getStatusText()}
            </span>
          </StatusIndicator>
          
          {isRunning && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <div>Stress Level: {currentStress}%</div>
              <div>Time: {formatTime(Math.floor(timeElapsed / 10))}</div>
              <div>Progress: {Math.round(progress)}%</div>
            </div>
          )}
        </SimulationStatus>

        <SimulationControls>
          <ControlButton
            variant="start"
            onClick={() => startSimulation(scenarios[0])}
            disabled={isRunning}
          >
            <FaPlay /> Start Gradual
          </ControlButton>
          
          <ControlButton
            variant="start"
            onClick={() => startSimulation(scenarios[1])}
            disabled={isRunning}
          >
            <FaPlay /> Start Spike
          </ControlButton>
          
          <ControlButton
            variant="pause"
            onClick={togglePause}
            disabled={!isRunning}
          >
            {isPaused ? <FaPlay /> : <FaPause />} 
            {isPaused ? 'Resume' : 'Pause'}
          </ControlButton>
          
          <ControlButton
            variant="stop"
            onClick={stopSimulation}
            disabled={!isRunning}
          >
            <FaStop /> Stop
          </ControlButton>
        </SimulationControls>

        {isRunning && (
          <ProgressBar>
            <Progress progress={progress} />
          </ProgressBar>
        )}

        <SimulationScenarios>
          {scenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              active={currentScenario?.id === scenario.id}
              onClick={() => !isRunning && startSimulation(scenario)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ScenarioTitle>{scenario.title}</ScenarioTitle>
              <ScenarioDescription>{scenario.description}</ScenarioDescription>
              <ScenarioDuration>{scenario.duration}s duration</ScenarioDuration>
            </ScenarioCard>
          ))}
        </SimulationScenarios>

        <div style={{
          background: 'rgba(255, 107, 53, 0.1)',
          borderRadius: '15px',
          padding: '1rem',
          textAlign: 'center',
          color: '#fff'
        }}>
          <h3 style={{ color: '#ff6b35', marginBottom: '0.5rem' }}>
            🧪 Simulation Laboratory
          </h3>
          <p style={{ color: '#a4b0be', fontSize: '0.9rem' }}>
            Test stress relief systems with controlled stress scenarios. 
            Monitor how the system responds to different stress patterns.
          </p>
        </div>
      </SimulatorContainer>
    </motion.div>
  );
};

export default StressSimulator;
