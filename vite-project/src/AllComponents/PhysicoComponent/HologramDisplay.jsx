import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Plane, Cylinder, useVideoTexture } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import styled from 'styled-components';

const HologramContainer = styled.div`
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 2px solid #00d4ff;
  position: relative;
  overflow: hidden;
`;

const HologramFrame = styled.div`
  width: 100%;
  height: 500px;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
  background: radial-gradient(circle at center, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const ControlButton = styled.button`
  background: ${props => props.active ? '#00d4ff' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? '#000' : '#fff'};
  border: 2px solid #00d4ff;
  border-radius: 10px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  
  &:hover {
    background: #00d4ff;
    color: #000;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 212, 255, 0.3);
  }
`;

const FamilyMember = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
`;

const MemberAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(45deg, #00d4ff, #ff6b6b);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.active ? '#00d4ff' : 'transparent'};
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
  }
`;

// 3D Hologram Components
function HologramAvatar({ position, scale = 1, color = '#00d4ff' }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Hologram body */}
      <Box ref={meshRef} args={[1, 2, 0.5]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={0.7}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </Box>
      
      {/* Hologram head */}
      <Sphere args={[0.4]} position={[0, 1.2, 0]}>
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={0.7}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </Sphere>
      
      {/* Hologram glow effect */}
      <Sphere args={[0.6]} position={[0, 1.2, 0]}>
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.1}
        />
      </Sphere>
    </group>
  );
}

function HologramText({ text, position, color = '#00d4ff' }) {
  return (
    <Text
      position={position}
      fontSize={0.3}
      color={color}
      anchorX="center"
      anchorY="middle"
      font="/fonts/helvetiker_regular.typeface.json"
    >
      {text}
    </Text>
  );
}

function HologramParticles() {
  const pointsRef = useRef();
  
  useEffect(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(1000 * 3);
    
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      color: '#00d4ff',
      size: 0.02,
      transparent: true,
      opacity: 0.6
    });
    
    pointsRef.current = new THREE.Points(geometry, material);
  }, []);
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });
  
  return <primitive object={pointsRef.current} />;
}

function HologramScene({ selectedMember, isVideoMode }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#00d4ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ff6b6b" />
      
      {/* Hologram particles background */}
      <HologramParticles />
      
      {/* Main hologram avatar */}
      <HologramAvatar 
        position={[0, 0, 0]} 
        scale={1.5}
        color={selectedMember?.color || '#00d4ff'}
      />
      
      {/* Family member name */}
      <HologramText 
        text={selectedMember?.name || 'Family Member'} 
        position={[0, -2, 0]}
        color={selectedMember?.color || '#00d4ff'}
      />
      
      {/* Hologram frame effect */}
      <Plane args={[8, 6]} position={[0, 0, -3]}>
        <meshBasicMaterial 
          color="#00d4ff" 
          transparent 
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </Plane>
    </>
  );
}

const HologramDisplay = ({ stressLevel, onMemberSelect }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const familyMembers = [
    { id: 1, name: 'Sarah', relation: 'Spouse', color: '#ff6b6b', emoji: '👩' },
    { id: 2, name: 'Emma', relation: 'Daughter', color: '#4ecdc4', emoji: '👧' },
    { id: 3, name: 'Mike', relation: 'Son', color: '#45b7d1', emoji: '👦' },
    { id: 4, name: 'Mom', relation: 'Mother', color: '#96ceb4', emoji: '👵' },
    { id: 5, name: 'Dad', relation: 'Father', color: '#feca57', emoji: '👴' }
  ];

  // Activate hologram when stress is high
  useEffect(() => {
    if (stressLevel > 60) {
      setIsActive(true);
      if (!selectedMember) {
        setSelectedMember(familyMembers[0]);
      }
    }
  }, [stressLevel]);

  const handleMemberSelect = (member) => {
    setSelectedMember(member);
    setIsActive(true);
    if (onMemberSelect) {
      onMemberSelect(member);
    }
  };

  const toggleVideoMode = () => {
    setIsVideoMode(!isVideoMode);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <HologramContainer>
        <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '2rem' }}>
          👨‍👩‍👧‍👦 Family Hologram Display
        </h2>
        
        <Controls>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {familyMembers.map((member) => (
              <FamilyMember key={member.id}>
                <MemberAvatar
                  active={selectedMember?.id === member.id}
                  onClick={() => handleMemberSelect(member)}
                >
                  {member.emoji}
                </MemberAvatar>
                <span style={{ fontSize: '0.8rem', textAlign: 'center' }}>
                  {member.name}
                </span>
              </FamilyMember>
            ))}
          </div>
          
          <ControlButton
            active={isVideoMode}
            onClick={toggleVideoMode}
          >
            {isVideoMode ? '📹 Video Mode' : '🎭 Avatar Mode'}
          </ControlButton>
        </Controls>

        <HologramFrame>
          {isActive ? (
            <Canvas
              camera={{ position: [0, 0, 5], fov: 75 }}
              style={{ background: 'transparent' }}
            >
              <HologramScene 
                selectedMember={selectedMember} 
                isVideoMode={isVideoMode}
              />
              <OrbitControls 
                enablePan={false} 
                enableZoom={false}
                autoRotate={true}
                autoRotateSpeed={0.5}
              />
            </Canvas>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#a4b0be',
              fontSize: '1.2rem'
            }}>
              {stressLevel > 60 
                ? 'Hologram will activate when stress is detected...' 
                : 'Select a family member to activate hologram'
              }
            </div>
          )}
        </HologramFrame>

        {selectedMember && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: '1rem',
              textAlign: 'center',
              color: '#fff'
            }}
          >
            <h3 style={{ color: selectedMember.color, marginBottom: '0.5rem' }}>
              {selectedMember.name} ({selectedMember.relation})
            </h3>
            <p style={{ color: '#a4b0be', fontSize: '0.9rem' }}>
              {isVideoMode 
                ? 'Video call mode - WebRTC integration ready' 
                : '3D Avatar mode - Holographic projection active'
              }
            </p>
          </motion.div>
        )}
      </HologramContainer>
    </motion.div>
  );
};

export default HologramDisplay;
