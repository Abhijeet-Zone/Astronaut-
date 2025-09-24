import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { 
  VRButton as XRVRButton, 
  ARButton, 
  Controllers, 
  Hands, 
  useXR,
  Text,
  Box,
  Sphere,
  Plane,
  Environment,
  Sky,
  Stars
} from '@react-three/xr';
import { OrbitControls, useTexture, Cylinder } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import styled from 'styled-components';

const VRContainer = styled.div`
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  border: 2px solid #8b5cf6;
  position: relative;
  overflow: hidden;
`;

const VRFrame = styled.div`
  width: 100%;
  height: 500px;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
  background: radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
`;

const VRControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const VRButton = styled.button`
  background: ${props => props.active ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? '#fff' : '#8b5cf6'};
  border: 2px solid #8b5cf6;
  border-radius: 10px;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #8b5cf6;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(139, 92, 246, 0.3);
  }
`;

const SceneSelector = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const SceneButton = styled.button`
  background: ${props => props.active ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? '#fff' : '#a4b0be'};
  border: 1px solid #8b5cf6;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  
  &:hover {
    background: #8b5cf6;
    color: #fff;
  }
`;

// VR Scene Components
function FloatingParticles() {
  const pointsRef = useRef();
  
  useEffect(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(500 * 3);
    
    for (let i = 0; i < 500; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      color: '#8b5cf6',
      size: 0.05,
      transparent: true,
      opacity: 0.6
    });
    
    pointsRef.current = new THREE.Points(geometry, material);
  }, []);
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });
  
  return <primitive object={pointsRef.current} />;
}

function Earth() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });
  
  return (
    <Sphere ref={meshRef} args={[2]} position={[0, 0, -5]}>
      <meshStandardMaterial 
        color="#4a90e2"
        emissive="#1a365d"
        emissiveIntensity={0.2}
      />
    </Sphere>
  );
}

function MeditationRoom() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#8b5cf6" />
      
      {/* Floor */}
      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <meshStandardMaterial color="#2d1b69" />
      </Plane>
      
      {/* Walls */}
      <Box args={[20, 8, 0.5]} position={[0, 2, -10]}>
        <meshStandardMaterial color="#1a0b3d" />
      </Box>
      <Box args={[0.5, 8, 20]} position={[-10, 2, 0]}>
        <meshStandardMaterial color="#1a0b3d" />
      </Box>
      <Box args={[0.5, 8, 20]} position={[10, 2, 0]}>
        <meshStandardMaterial color="#1a0b3d" />
      </Box>
      
      {/* Floating meditation elements */}
      <FloatingParticles />
      
      {/* Meditation cushion */}
      <Cylinder args={[1, 1, 0.3]} position={[0, -1.7, 0]}>
        <meshStandardMaterial color="#8b5cf6" />
      </Cylinder>
    </>
  );
}

function SpaceEnvironment() {
  return (
    <>
      <Sky 
        distance={450000}
        sunPosition={[0, 1, 0]}
        inclination={0}
        azimuth={0.25}
      />
      <Stars 
        radius={300} 
        depth={60} 
        count={20000} 
        factor={7} 
        saturation={0} 
        fade 
      />
      <Earth />
      <FloatingParticles />
    </>
  );
}

function NatureScene() {
  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Ground */}
      <Plane args={[50, 50]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <meshStandardMaterial color="#2d5a27" />
      </Plane>
      
      {/* Trees */}
      {Array.from({ length: 20 }, (_, i) => (
        <group key={i} position={[
          (Math.random() - 0.5) * 40,
          -2,
          (Math.random() - 0.5) * 40
        ]}>
          <Cylinder args={[0.2, 0.3, 3]} position={[0, 0.5, 0]}>
            <meshStandardMaterial color="#8b4513" />
          </Cylinder>
          <Sphere args={[1]} position={[0, 2.5, 0]}>
            <meshStandardMaterial color="#228b22" />
          </Sphere>
        </group>
      ))}
    </>
  );
}

function VRSceneContent({ sceneType, isVRMode }) {
  const { isPresenting } = useXR();
  
  const renderScene = () => {
    switch (sceneType) {
      case 'meditation':
        return <MeditationRoom />;
      case 'space':
        return <SpaceEnvironment />;
      case 'nature':
        return <NatureScene />;
      default:
        return <MeditationRoom />;
    }
  };

  return (
    <>
      {renderScene()}
      
      {/* VR UI Elements */}
      {isPresenting && (
        <Text
          position={[0, 2, -3]}
          fontSize={0.3}
          color="#8b5cf6"
          anchorX="center"
          anchorY="middle"
        >
          {sceneType === 'meditation' && '🧘 Breathe deeply and relax...'}
          {sceneType === 'space' && '🌍 Enjoy the view of Earth from space'}
          {sceneType === 'nature' && '🌲 Feel the peace of nature'}
        </Text>
      )}
    </>
  );
}

const VRScene = ({ stressLevel, onVRStart }) => {
  const [isVRMode, setIsVRMode] = useState(false);
  const [currentScene, setCurrentScene] = useState('meditation');
  const [isPresenting, setIsPresenting] = useState(false);

  const scenes = [
    { id: 'meditation', name: 'Meditation Room', icon: '🧘' },
    { id: 'space', name: 'Space View', icon: '🌍' },
    { id: 'nature', name: 'Nature Scene', icon: '🌲' }
  ];

  // Auto-activate VR when stress is high
  useEffect(() => {
    if (stressLevel > 70 && !isPresenting) {
      setIsVRMode(true);
      if (onVRStart) {
        onVRStart('meditation');
      }
    }
  }, [stressLevel]);

  const handleVRToggle = () => {
    setIsVRMode(!isVRMode);
  };

  const handleSceneChange = (sceneId) => {
    setCurrentScene(sceneId);
  };

  const getVRRecommendation = () => {
    if (stressLevel > 80) return "🚨 Critical stress! VR meditation room recommended.";
    if (stressLevel > 60) return "⚠️ High stress. Try space view for perspective.";
    if (stressLevel > 40) return "💡 Moderate stress. Nature scene might help.";
    return "😌 Ready for any VR experience.";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <VRContainer>
        <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '2rem' }}>
          🥽 VR Relaxation Environment
        </h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: 'linear-gradient(90deg, #8b5cf6, #a855f7)',
            borderRadius: '15px',
            padding: '1rem',
            marginBottom: '2rem',
            textAlign: 'center',
            color: '#fff',
            fontWeight: 'bold'
          }}
        >
          {getVRRecommendation()}
        </motion.div>

        <VRControls>
          <VRButton
            active={isVRMode}
            onClick={handleVRToggle}
          >
            🥽 {isVRMode ? 'Exit VR' : 'Enter VR Mode'}
          </VRButton>
        </VRControls>

        <SceneSelector>
          {scenes.map((scene) => (
            <SceneButton
              key={scene.id}
              active={currentScene === scene.id}
              onClick={() => handleSceneChange(scene.id)}
            >
              {scene.icon} {scene.name}
            </SceneButton>
          ))}
        </SceneSelector>

        <VRFrame>
          {isVRMode ? (
            <Canvas
              camera={{ position: [0, 0, 5], fov: 75 }}
              style={{ background: 'transparent' }}
            >
              <VRSceneContent 
                sceneType={currentScene} 
                isVRMode={isVRMode}
              />
              
              {/* VR Controls */}
              <XRVRButton />
              <Controllers />
              <Hands />
              
              {!isPresenting && (
                <OrbitControls 
                  enablePan={true} 
                  enableZoom={true}
                  autoRotate={true}
                  autoRotateSpeed={0.5}
                />
              )}
            </Canvas>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#a4b0be',
              fontSize: '1.2rem',
              textAlign: 'center',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div>🥽</div>
              <div>VR Mode Disabled</div>
              <div style={{ fontSize: '0.9rem' }}>
                {stressLevel > 60 
                  ? 'High stress detected - VR mode will auto-activate' 
                  : 'Click "Enter VR Mode" to start immersive experience'
                }
              </div>
            </div>
          )}
        </VRFrame>

        {isVRMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: '1rem',
              textAlign: 'center',
              color: '#fff'
            }}
          >
            <h3 style={{ color: '#8b5cf6', marginBottom: '0.5rem' }}>
              🥽 VR Environment: {scenes.find(s => s.id === currentScene)?.name}
            </h3>
            <p style={{ color: '#a4b0be', fontSize: '0.9rem' }}>
              {currentScene === 'meditation' && 'Focus on your breathing in this peaceful meditation space'}
              {currentScene === 'space' && 'Take in the vastness of space and find perspective'}
              {currentScene === 'nature' && 'Connect with nature in this serene forest environment'}
            </p>
          </motion.div>
        )}
      </VRContainer>
    </motion.div>
  );
};

export default VRScene;
