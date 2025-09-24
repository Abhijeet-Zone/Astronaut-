import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { 
  FaMusic, 
  FaMeditation, 
  FaEye, 
  FaGamepad, 
  FaBook, 
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute
} from 'react-icons/fa';

const PipelineContainer = styled.div`
  background: linear-gradient(135deg, #2c1810 0%, #3d2817 100%);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 2px solid #ff6b35;
  position: relative;
  overflow: hidden;
`;

const ActivityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ActivityCard = styled(motion.div)`
  background: ${props => props.active ? 'linear-gradient(135deg, #ff6b35, #f7931e)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 15px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.active ? '#ff6b35' : 'transparent'};
  backdrop-filter: blur(10px);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(255, 107, 53, 0.3);
  }
`;

const ActivityIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${props => props.active ? '#fff' : '#ff6b35'};
  text-align: center;
`;

const ActivityTitle = styled.h3`
  color: #fff;
  margin-bottom: 0.5rem;
  text-align: center;
  font-size: 1.2rem;
`;

const ActivityDescription = styled.p`
  color: #a4b0be;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const ActivityControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const ControlButton = styled.button`
  background: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.active ? '#ff6b35' : '#fff'};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  
  &:hover {
    background: #fff;
    color: #ff6b35;
    transform: scale(1.1);
  }
`;

const RecommendationBanner = styled(motion.div)`
  background: linear-gradient(90deg, #ff6b35, #f7931e);
  border-radius: 15px;
  padding: 1rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #fff;
  font-weight: bold;
  box-shadow: 0 5px 15px rgba(255, 107, 53, 0.4);
`;

const MusicPlayer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1rem;
  margin-top: 1rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin: 0.5rem 0;
`;

const Progress = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #ff6b35, #f7931e);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const NoveltyPipeline = ({ stressLevel, onActivityStart }) => {
  const [activeActivity, setActiveActivity] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(0);

  const activities = [
    {
      id: 'meditation',
      title: 'Guided Meditation',
      description: 'Calm your mind with space-themed meditation',
      icon: <FaMeditation />,
      type: 'meditation',
      duration: 10,
      tracks: [
        { name: 'Deep Space Breathing', duration: '5:00' },
        { name: 'Zero Gravity Relaxation', duration: '8:00' },
        { name: 'Earth View Meditation', duration: '10:00' }
      ]
    },
    {
      id: 'music',
      title: 'Relaxing Music',
      description: 'Ambient space sounds and calming melodies',
      icon: <FaMusic />,
      type: 'music',
      duration: 15,
      tracks: [
        { name: 'Cosmic Waves', duration: '12:00' },
        { name: 'Stellar Symphony', duration: '15:00' },
        { name: 'Nebula Dreams', duration: '20:00' }
      ]
    },
    {
      id: 'visualization',
      title: 'VR Visualization',
      description: 'Immersive space relaxation environments',
      icon: <FaEye />,
      type: 'vr',
      duration: 20,
      tracks: [
        { name: 'Earth from Space', duration: '15:00' },
        { name: 'Aurora Borealis', duration: '20:00' },
        { name: 'Deep Space Journey', duration: '25:00' }
      ]
    },
    {
      id: 'games',
      title: 'Mind Games',
      description: 'Cognitive exercises to reduce stress',
      icon: <FaGamepad />,
      type: 'games',
      duration: 10,
      tracks: [
        { name: 'Memory Constellation', duration: '5:00' },
        { name: 'Pattern Recognition', duration: '8:00' },
        { name: 'Spatial Puzzles', duration: '10:00' }
      ]
    },
    {
      id: 'reading',
      title: 'Space Stories',
      description: 'Read inspiring space exploration stories',
      icon: <FaBook />,
      type: 'reading',
      duration: 15,
      tracks: [
        { name: 'Apollo 11 Journey', duration: '12:00' },
        { name: 'Mars Mission Tales', duration: '15:00' },
        { name: 'Future of Space', duration: '18:00' }
      ]
    }
  ];

  // Auto-suggest activities based on stress level
  useEffect(() => {
    if (stressLevel > 70) {
      const highStressActivities = ['meditation', 'music', 'visualization'];
      const randomActivity = highStressActivities[Math.floor(Math.random() * highStressActivities.length)];
      const activity = activities.find(a => a.id === randomActivity);
      if (activity && !activeActivity) {
        setActiveActivity(activity);
        if (onActivityStart) {
          onActivityStart(activity);
        }
      }
    }
  }, [stressLevel]);

  // Simulate progress for active activity
  useEffect(() => {
    if (activeActivity && isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            setProgress(0);
            return 0;
          }
          return prev + 1;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [activeActivity, isPlaying]);

  const handleActivitySelect = (activity) => {
    setActiveActivity(activity);
    setIsPlaying(false);
    setProgress(0);
    if (onActivityStart) {
      onActivityStart(activity);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (activeActivity) {
      setCurrentTrack((prev) => (prev + 1) % activeActivity.tracks.length);
      setProgress(0);
    }
  };

  const getRecommendation = () => {
    if (stressLevel > 80) return "🚨 Critical stress detected! Starting emergency relaxation protocol.";
    if (stressLevel > 60) return "⚠️ High stress levels. Recommended: Meditation or VR visualization.";
    if (stressLevel > 40) return "💡 Moderate stress. Try music or mind games for relief.";
    return "😌 Stress levels normal. Enjoy any activity for wellness.";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PipelineContainer>
        <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '2rem' }}>
          🎯 Novelty Pipeline - Stress Relief Activities
        </h2>

        <RecommendationBanner
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {getRecommendation()}
        </RecommendationBanner>

        <ActivityGrid>
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              active={activeActivity?.id === activity.id}
              onClick={() => handleActivitySelect(activity)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ActivityIcon active={activeActivity?.id === activity.id}>
                {activity.icon}
              </ActivityIcon>
              <ActivityTitle>{activity.title}</ActivityTitle>
              <ActivityDescription>{activity.description}</ActivityDescription>
              
              {activeActivity?.id === activity.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <MusicPlayer>
                    <div style={{ color: '#fff', marginBottom: '0.5rem' }}>
                      {activity.tracks[currentTrack]?.name}
                    </div>
                    <ProgressBar>
                      <Progress progress={progress} />
                    </ProgressBar>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      color: '#a4b0be', 
                      fontSize: '0.8rem',
                      marginTop: '0.5rem'
                    }}>
                      <span>{Math.floor(progress * activity.duration / 100)}:00</span>
                      <span>{activity.tracks[currentTrack]?.duration}</span>
                    </div>
                  </MusicPlayer>
                  
                  <ActivityControls>
                    <ControlButton onClick={togglePlayPause} active={isPlaying}>
                      {isPlaying ? <FaPause /> : <FaPlay />}
                    </ControlButton>
                    <ControlButton onClick={nextTrack}>
                      ⏭️
                    </ControlButton>
                    <ControlButton>
                      {volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
                    </ControlButton>
                  </ActivityControls>
                </motion.div>
              )}
            </ActivityCard>
          ))}
        </ActivityGrid>

        {activeActivity && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(255, 107, 53, 0.1)',
              borderRadius: '15px',
              padding: '1rem',
              textAlign: 'center',
              color: '#fff'
            }}
          >
            <h3 style={{ color: '#ff6b35', marginBottom: '0.5rem' }}>
              🎯 Active: {activeActivity.title}
            </h3>
            <p style={{ color: '#a4b0be', fontSize: '0.9rem' }}>
              {isPlaying 
                ? `Playing: ${activeActivity.tracks[currentTrack]?.name}` 
                : 'Ready to start - Click play to begin'
              }
            </p>
          </motion.div>
        )}
      </PipelineContainer>
    </motion.div>
  );
};

export default NoveltyPipeline;
