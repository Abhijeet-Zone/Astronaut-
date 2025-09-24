import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import * as tf from '@tensorflow/tfjs';
import styled from 'styled-components';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MonitorContainer = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 2px solid ${props => props.stressLevel > 70 ? '#ff4757' : props.stressLevel > 40 ? '#ffa502' : '#2ed573'};
  transition: all 0.3s ease;
`;

const StressLevel = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: ${props => props.stressLevel > 70 ? '#ff4757' : props.stressLevel > 40 ? '#ffa502' : '#2ed573'};
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 0 0 20px currentColor;
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatusDot = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.active ? '#2ed573' : '#535c68'};
  box-shadow: 0 0 10px ${props => props.active ? '#2ed573' : 'transparent'};
  animation: ${props => props.active ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

const SensorData = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SensorCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  backdrop-filter: blur(10px);
`;

const SensorValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 0.5rem;
`;

const SensorLabel = styled.div`
  font-size: 0.9rem;
  color: #a4b0be;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ChartContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1rem;
  backdrop-filter: blur(10px);
`;

const StressMonitor = ({ onStressChange }) => {
  const [stressLevel, setStressLevel] = useState(25);
  const [sensorData, setSensorData] = useState({
    heartRate: 72,
    facialExpression: 0.3,
    eegAlpha: 0.4,
    eegBeta: 0.6,
    cortisol: 0.2,
    bloodPressure: 120
  });
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Stress Level',
      data: [],
      borderColor: '#2ed573',
      backgroundColor: 'rgba(46, 213, 115, 0.1)',
      tension: 0.4
    }]
  });
  const [model, setModel] = useState(null);
  const intervalRef = useRef(null);

  // Initialize TensorFlow.js model for stress prediction
  useEffect(() => {
    const initModel = async () => {
      try {
        // Create a simple neural network for stress prediction
        const model = tf.sequential({
          layers: [
            tf.layers.dense({ inputShape: [6], units: 64, activation: 'relu' }),
            tf.layers.dropout({ rate: 0.2 }),
            tf.layers.dense({ units: 32, activation: 'relu' }),
            tf.layers.dense({ units: 1, activation: 'sigmoid' })
          ]
        });
        
        model.compile({
          optimizer: 'adam',
          loss: 'binaryCrossentropy',
          metrics: ['accuracy']
        });
        
        setModel(model);
        console.log('AI Model initialized for stress prediction');
      } catch (error) {
        console.error('Error initializing AI model:', error);
      }
    };

    initModel();
  }, []);

  // Predict stress level using AI model
  const predictStress = async (sensorValues) => {
    if (!model) return Math.random() * 100; // Fallback to random if model not ready

    try {
      const input = tf.tensor2d([[
        sensorValues.heartRate / 200, // Normalize
        sensorValues.facialExpression,
        sensorValues.eegAlpha,
        sensorValues.eegBeta,
        sensorValues.cortisol,
        sensorValues.bloodPressure / 200
      ]]);
      
      const prediction = await model.predict(input).data();
      return prediction[0] * 100;
    } catch (error) {
      console.error('Error predicting stress:', error);
      return Math.random() * 100;
    }
  };

  // Simulate sensor data changes
  const updateSensorData = async () => {
    const newSensorData = {
      heartRate: Math.max(60, Math.min(120, sensorData.heartRate + (Math.random() - 0.5) * 10)),
      facialExpression: Math.max(0, Math.min(1, sensorData.facialExpression + (Math.random() - 0.5) * 0.1)),
      eegAlpha: Math.max(0, Math.min(1, sensorData.eegAlpha + (Math.random() - 0.5) * 0.1)),
      eegBeta: Math.max(0, Math.min(1, sensorData.eegBeta + (Math.random() - 0.5) * 0.1)),
      cortisol: Math.max(0, Math.min(1, sensorData.cortisol + (Math.random() - 0.5) * 0.05)),
      bloodPressure: Math.max(90, Math.min(160, sensorData.bloodPressure + (Math.random() - 0.5) * 10))
    };

    setSensorData(newSensorData);

    // Predict stress level
    const predictedStress = await predictStress(newSensorData);
    setStressLevel(Math.round(predictedStress));

    // Update chart data
    const now = new Date().toLocaleTimeString();
    setChartData(prev => {
      const newLabels = [...prev.labels, now].slice(-20); // Keep last 20 data points
      const newData = [...prev.datasets[0].data, predictedStress].slice(-20);
      
      return {
        labels: newLabels,
        datasets: [{
          ...prev.datasets[0],
          data: newData,
          borderColor: predictedStress > 70 ? '#ff4757' : predictedStress > 40 ? '#ffa502' : '#2ed573'
        }]
      };
    });

    // Notify parent component of stress change
    if (onStressChange) {
      onStressChange(Math.round(predictedStress));
    }
  };

  // Start/stop monitoring
  useEffect(() => {
    intervalRef.current = setInterval(updateSensorData, 2000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sensorData]);

  const getStressStatus = () => {
    if (stressLevel > 70) return { status: 'HIGH', color: '#ff4757', message: 'Critical Stress Detected' };
    if (stressLevel > 40) return { status: 'MODERATE', color: '#ffa502', message: 'Elevated Stress' };
    return { status: 'LOW', color: '#2ed573', message: 'Normal Range' };
  };

  const stressStatus = getStressStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <MonitorContainer stressLevel={stressLevel}>
        <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '2rem' }}>
          🧠 Physiological Stress Monitor
        </h2>
        
        <StressLevel stressLevel={stressLevel}>
          {stressLevel}%
        </StressLevel>
        
        <StatusIndicator>
          <StatusDot active={stressLevel < 40} />
          <span style={{ color: '#fff', fontSize: '1.2rem' }}>
            {stressStatus.message}
          </span>
          <StatusDot active={stressLevel >= 40 && stressLevel < 70} />
          <StatusDot active={stressLevel >= 70} />
        </StatusIndicator>

        <SensorData>
          <SensorCard>
            <SensorValue>{sensorData.heartRate} BPM</SensorValue>
            <SensorLabel>Heart Rate</SensorLabel>
          </SensorCard>
          <SensorCard>
            <SensorValue>{(sensorData.facialExpression * 100).toFixed(1)}%</SensorValue>
            <SensorLabel>Facial Stress</SensorLabel>
          </SensorCard>
          <SensorCard>
            <SensorValue>{(sensorData.eegAlpha * 100).toFixed(1)}%</SensorValue>
            <SensorLabel>EEG Alpha</SensorLabel>
          </SensorCard>
          <SensorCard>
            <SensorValue>{(sensorData.eegBeta * 100).toFixed(1)}%</SensorValue>
            <SensorLabel>EEG Beta</SensorLabel>
          </SensorCard>
          <SensorCard>
            <SensorValue>{(sensorData.cortisol * 100).toFixed(1)}%</SensorLabel>
            <SensorLabel>Cortisol</SensorLabel>
          </SensorCard>
          <SensorCard>
            <SensorValue>{sensorData.bloodPressure} mmHg</SensorValue>
            <SensorLabel>Blood Pressure</SensorLabel>
          </SensorCard>
        </SensorData>

        <ChartContainer>
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: { color: '#fff' }
                }
              },
              scales: {
                x: {
                  ticks: { color: '#a4b0be' },
                  grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                y: {
                  ticks: { color: '#a4b0be' },
                  grid: { color: 'rgba(255, 255, 255, 0.1)' },
                  min: 0,
                  max: 100
                }
              }
            }}
            height={200}
          />
        </ChartContainer>
      </MonitorContainer>
    </motion.div>
  );
};

export default StressMonitor;
