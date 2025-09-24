import React, { useState, useEffect } from 'react';
const AdvancedDashboard = () => {
  const [stressLevel, setStressLevel] = useState(25);
  const [activeTab, setActiveTab] = useState('monitor');
  const [activeComponents, setActiveComponents] = useState({
    stressMonitor: true,
    hologram: false,
    novelty: false,
    vr: false,
    communication: false,
    navigation: false
  });
  const [selectedFamilyMember, setSelectedFamilyMember] = useState(null);
  const [hologramMode, setHologramMode] = useState('avatar');
  const [vrEnvironment, setVrEnvironment] = useState('meditation');
  const [activityType, setActivityType] = useState('meditation');

  const familyMembers = [
    { id: 1, name: 'Sarah', relation: 'Spouse', avatar: '👩', color: '#ff6b6b', status: 'online' },
    { id: 2, name: 'Emma', relation: 'Daughter', avatar: '👧', color: '#4ecdc4', status: 'online' },
    { id: 3, name: 'Mike', relation: 'Son', avatar: '👦', color: '#45b7d1', status: 'offline' },
    { id: 4, name: 'Mom', relation: 'Mother', avatar: '👵', color: '#96ceb4', status: 'online' },
    { id: 5, name: 'Dad', relation: 'Father', avatar: '👴', color: '#feca57', status: 'offline' }
  ];

  const vrEnvironments = [
    { id: 'meditation', name: 'Meditation Room', icon: '🧘', color: '#8b5cf6' },
    { id: 'space', name: 'Space View', icon: '🌍', color: '#00d4ff' },
    { id: 'nature', name: 'Nature Scene', icon: '🌲', color: '#2ed573' },
    { id: 'ocean', name: 'Ocean Depths', icon: '🌊', color: '#4ecdc4' }
  ];

  const activities = [
    { id: 'meditation', name: 'Guided Meditation', icon: '🧘', duration: '10 min', color: '#8b5cf6' },
    { id: 'music', name: 'Relaxing Music', icon: '🎵', duration: '15 min', color: '#ff6b35' },
    { id: 'breathing', name: 'Breathing Exercise', icon: '🫁', duration: '5 min', color: '#2ed573' },
    { id: 'visualization', name: 'VR Visualization', icon: '👁️', duration: '20 min', color: '#00d4ff' },
    { id: 'games', name: 'Mind Games', icon: '🎮', duration: '10 min', color: '#feca57' },
    { id: 'reading', name: 'Space Stories', icon: '📚', duration: '15 min', color: '#96ceb4' }
  ];

  // Simulate real-time stress monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setStressLevel(prev => {
        const change = (Math.random() - 0.5) * 5;
        return Math.max(0, Math.min(100, prev + change));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const layoutWrap = {
    maxWidth: '80rem', // ~1280px, matches Tailwind's max-w-7xl
    margin: '0 auto',
    padding: '2rem 1rem'
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

  const getStatusColor = () => {
    if (stressLevel > 70) return 'linear-gradient(90deg, #ff4757, #ff6b35)';
    if (stressLevel > 40) return 'linear-gradient(90deg, #ffa502, #ff6b35)';
    return 'linear-gradient(90deg, #2ed573, #00d4ff)';
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #1a1a2e 75%, #0a0a0a 100%)',
      padding: 0,
      color: '#e8e8e8',
      fontFamily: '"SF Pro Display", "Inter", system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      fontWeight: '300'
    },
    stars: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'radial-gradient(2px 2px at 20px 30px, #eee, transparent), radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent), radial-gradient(1px 1px at 90px 40px, #fff, transparent), radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent), radial-gradient(2px 2px at 160px 30px, #fff, transparent)',
      backgroundRepeat: 'repeat',
      backgroundSize: '200px 200px',
      animation: 'twinkle 20s linear infinite',
      pointerEvents: 'none'
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
      position: 'relative',
      zIndex: 2
    },
    title: {
      fontSize: '3.2rem',
      background: 'linear-gradient(90deg, #ffffff 0%, #b8b8b8 50%, #ffffff 100%)',
      backgroundSize: '200% 200%',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      animation: 'gradientShift 6s ease-in-out infinite',
      marginBottom: '1rem',
      fontWeight: '200',
      letterSpacing: '0.02em'
    },
    subtitle: {
      color: '#8a8a8a',
      fontSize: '1.1rem',
      marginBottom: '2rem',
      fontWeight: '300',
      letterSpacing: '0.01em',
      lineHeight: '1.6'
    },
    statusBanner: {
      background: stressLevel > 70 ? 'linear-gradient(90deg, #2a1a1a 0%, #3a2a2a 100%)' :
                 stressLevel > 40 ? 'linear-gradient(90deg, #2a2a1a 0%, #3a3a2a 100%)' :
                 'linear-gradient(90deg, #1a2a1a 0%, #2a3a2a 100%)',
      borderRadius: '8px',
      padding: '1.2rem 2rem',
      marginBottom: '2rem',
      color: stressLevel > 70 ? '#ff6b6b' : stressLevel > 40 ? '#ffa726' : '#66bb6a',
      fontWeight: '400',
      textAlign: 'center',
      border: `1px solid ${stressLevel > 70 ? '#ff6b6b' : stressLevel > 40 ? '#ffa726' : '#66bb6a'}20`,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      animation: 'fadeIn 0.5s ease-out'
    },
    tabContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '2rem',
      gap: '0.5rem',
      flexWrap: 'wrap'
    },
    tab: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '6px',
      padding: '0.8rem 1.5rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      color: '#b8b8b8',
      fontWeight: '400',
      fontSize: '0.9rem',
      letterSpacing: '0.01em'
    },
    activeTab: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: '#ffffff',
      fontWeight: '500'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '2rem',
      marginBottom: '2rem'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '12px',
      padding: '1.8rem',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.2s ease',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1.2rem',
      color: '#e8e8e8'
    },
    cardIcon: {
      fontSize: '1.8rem',
      opacity: '0.8'
    },
    cardTitle: {
      color: '#ffffff',
      margin: 0,
      fontSize: '1.4rem',
      fontWeight: '400',
      letterSpacing: '0.01em'
    },
    hologramContainer: {
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '8px',
      padding: '1.5rem',
      margin: '1rem 0',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'relative',
      overflow: 'hidden'
    },
    hologramFrame: {
      width: '100%',
      height: '250px',
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.05)'
    },
    hologramAvatar: {
      fontSize: '4rem',
      opacity: '0.8',
      animation: 'float 4s ease-in-out infinite'
    },
    familyGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '1rem',
      margin: '1rem 0'
    },
    familyMember: {
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '6px',
      padding: '0.8rem',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    selectedMember: {
      background: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
    },
    button: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: '#e8e8e8',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '6px',
      padding: '0.6rem 1.2rem',
      cursor: 'pointer',
      margin: '0.3rem',
      fontSize: '0.9rem',
      fontWeight: '400',
      transition: 'all 0.2s ease',
      letterSpacing: '0.01em'
    },
    buttonGreen: {
      background: 'rgba(46, 213, 115, 0.1)',
      color: '#66bb6a',
      border: '1px solid rgba(46, 213, 115, 0.3)',
      borderRadius: '6px',
      padding: '0.6rem 1.2rem',
      cursor: 'pointer',
      margin: '0.3rem',
      fontSize: '0.9rem',
      fontWeight: '400',
      transition: 'all 0.2s ease',
      letterSpacing: '0.01em'
    },
    toggleButton: {
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '6px',
      padding: '0.6rem 1.2rem',
      cursor: 'pointer',
      marginTop: '0.8rem',
      fontSize: '0.9rem',
      fontWeight: '400',
      transition: 'all 0.2s ease',
      background: 'rgba(255, 255, 255, 0.05)',
      color: '#b8b8b8',
      letterSpacing: '0.01em'
    },
    activityGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '1rem',
      margin: '1rem 0'
    },
    activityCard: {
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '6px',
      padding: '0.8rem',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    selectedActivity: {
      background: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
    },
    vrEnvironment: {
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '8px',
      padding: '1.5rem',
      margin: '1rem 0',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'relative',
      overflow: 'hidden'
    },
    vrFrame: {
      width: '100%',
      height: '200px',
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.05)'
    },
    progressBar: {
      width: '100%',
      height: '4px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '2px',
      overflow: 'hidden',
      margin: '1rem 0'
    },
    progress: {
      height: '100%',
      background: 'linear-gradient(90deg, #ffffff, #b8b8b8)',
      borderRadius: '2px',
      transition: 'width 0.3s ease'
    }
  };

  const renderStressMonitor = () => (
    <div className='w-full' style={{...styles.card, borderTop: '2px solid #66bb6a', animation: 'slideInLeft 0.5s ease-out'}}>
      <div style={styles.cardHeader}>
        <div style={{...styles.cardIcon, color: '#66bb6a'}}>🧠</div>
        <h2 style={styles.cardTitle}>AI Stress Monitor</h2>
      </div>
      <div style={{ color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '1.2rem' }}>Current Stress Level:</span>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: stressLevel > 70 ? '#ff4757' : stressLevel > 40 ? '#ffa502' : '#2ed573' }}>
            {stressLevel.toFixed(1)}%
          </span>
        </div>
        
        <div style={styles.progressBar}>
          <div style={{...styles.progress, width: `${stressLevel}%`}}></div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', margin: '1rem 0' }}>
          <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00d4ff' }}>72</div>
            <div style={{ fontSize: '0.8rem', color: '#a4b0be' }}>Heart Rate</div>
          </div>
          <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff6b35' }}>0.3</div>
            <div style={{ fontSize: '0.8rem', color: '#a4b0be' }}>Facial Stress</div>
          </div>
          <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>0.4</div>
            <div style={{ fontSize: '0.8rem', color: '#a4b0be' }}>EEG Alpha</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setStressLevel(prev => Math.min(100, prev + 10))}
            style={styles.button}
          >
            ⬆️ Increase Stress
          </button>
          <button
            onClick={() => setStressLevel(prev => Math.max(0, prev - 10))}
            style={styles.buttonGreen}
          >
            ⬇️ Decrease Stress
          </button>
          <button
            onClick={() => setStressLevel(25)}
            style={{...styles.button, background: 'linear-gradient(135deg, #8b5cf6, #a855f7)'}}
          >
            🔄 Reset
          </button>
        </div>
      </div>
    </div>
  );

  const renderHologramDisplay = () => (
    <div className='w-full' style={{...styles.card, borderTop: '2px solid #81c784', animation: 'slideInRight 0.5s ease-out'}}>
      <div style={styles.cardHeader}>
        <div style={{...styles.cardIcon, color: '#81c784'}}>👨‍👩‍👧‍👦</div>
        <h2 style={styles.cardTitle}>Family Hologram</h2>
      </div>
      
      <div style={styles.hologramContainer}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ color: '#fff', fontWeight: 'bold' }}>Hologram Status: {activeComponents.hologram ? 'Active' : 'Inactive'}</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setHologramMode('avatar')}
              style={{
                ...styles.toggleButton,
                background: hologramMode === 'avatar' ? '#00d4ff' : 'rgba(255, 255, 255, 0.1)',
                color: hologramMode === 'avatar' ? '#000' : '#fff',
                borderColor: '#00d4ff'
              }}
            >
              🎭 Avatar
            </button>
            <button
              onClick={() => setHologramMode('video')}
              style={{
                ...styles.toggleButton,
                background: hologramMode === 'video' ? '#00d4ff' : 'rgba(255, 255, 255, 0.1)',
                color: hologramMode === 'video' ? '#000' : '#fff',
                borderColor: '#00d4ff'
              }}
            >
              📹 Video
            </button>
          </div>
        </div>
        
        <div style={styles.hologramFrame}>
          {selectedFamilyMember ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{...styles.hologramAvatar, color: selectedFamilyMember.color}}>
                {selectedFamilyMember.avatar}
              </div>
              <div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold', marginTop: '1rem' }}>
                {selectedFamilyMember.name}
              </div>
              <div style={{ color: '#a4b0be', fontSize: '1rem' }}>
                {selectedFamilyMember.relation}
              </div>
            </div>
          ) : (
            <div style={{ color: '#a4b0be', fontSize: '1.2rem', textAlign: 'center' }}>
              Select a family member to activate hologram
            </div>
          )}
        </div>
        
        <div style={styles.familyGrid}>
          {familyMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => setSelectedFamilyMember(member)}
              style={{
                ...styles.familyMember,
                ...(selectedFamilyMember?.id === member.id ? styles.selectedMember : {}),
                borderColor: member.color
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{member.avatar}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#fff' }}>{member.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#a4b0be' }}>{member.relation}</div>
              <div style={{ fontSize: '0.7rem', color: member.status === 'online' ? '#2ed573' : '#ff4757' }}>
                {member.status === 'online' ? '🟢 Online' : '🔴 Offline'}
              </div>
            </div>
          ))}
        </div>
        
        <button
          onClick={() => toggleComponent('hologram')}
          style={{
            ...styles.toggleButton,
            background: activeComponents.hologram ? '#00d4ff' : 'rgba(255, 255, 255, 0.1)',
            color: activeComponents.hologram ? '#000' : '#fff',
            borderColor: '#00d4ff',
            width: '100%'
          }}
        >
          {activeComponents.hologram ? '🔴 Deactivate Hologram' : '🟢 Activate Hologram'}
        </button>
      </div>
    </div>
  );

  const renderReliefActivities = () => (
    <div className='w-full' style={{...styles.card, borderTop: '2px solid #ffa726', animation: 'slideInUp 0.5s ease-out'}}>
      <div style={styles.cardHeader}>
        <div style={{...styles.cardIcon, color: '#ffa726'}}>🎯</div>
        <h2 style={styles.cardTitle}>Stress Relief Activities</h2>
      </div>
      
      <div style={{ color: '#fff' }}>
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ color: '#fff', fontWeight: 'bold' }}>Activity Status: {activeComponents.novelty ? 'Active' : 'Inactive'}</span>
        </div>
        
        <div style={styles.activityGrid}>
          {activities.map((activity) => (
            <div
              key={activity.id}
              onClick={() => setActivityType(activity.id)}
              style={{
                ...styles.activityCard,
                ...(activityType === activity.id ? styles.selectedActivity : {}),
                borderColor: activity.color
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{activity.icon}</div>
              <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff' }}>{activity.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#a4b0be' }}>{activity.duration}</div>
            </div>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <button style={styles.button}>▶️ Start Activity</button>
          <button style={{...styles.button, background: 'linear-gradient(135deg, #8b5cf6, #a855f7)'}}>⏸️ Pause</button>
          <button style={{...styles.button, background: 'linear-gradient(135deg, #ff4757, #ff6b35)'}}>⏹️ Stop</button>
        </div>
        
        <button
          onClick={() => toggleComponent('novelty')}
          style={{
            ...styles.toggleButton,
            background: activeComponents.novelty ? '#ff6b35' : 'rgba(255, 255, 255, 0.1)',
            color: activeComponents.novelty ? '#000' : '#fff',
            borderColor: '#ff6b35',
            width: '100%',
            marginTop: '1rem'
          }}
        >
          {activeComponents.novelty ? '🔴 Deactivate Activities' : '🟢 Activate Activities'}
        </button>
      </div>
    </div>
  );

  const renderVREnvironment = () => (
    <div className='w-full' style={{...styles.card, borderTop: '2px solid #9575cd', animation: 'slideInUp 0.5s ease-out 0.2s both'}}>
      <div style={styles.cardHeader}>
        <div style={{...styles.cardIcon, color: '#9575cd'}}>🥽</div>
        <h2 style={styles.cardTitle}>VR Environment</h2>
      </div>
      
      <div style={styles.vrEnvironment}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ color: '#fff', fontWeight: 'bold' }}>VR Status: {activeComponents.vr ? 'Active' : 'Inactive'}</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {vrEnvironments.map((env) => (
              <button
                key={env.id}
                onClick={() => setVrEnvironment(env.id)}
                style={{
                  ...styles.toggleButton,
                  background: vrEnvironment === env.id ? env.color : 'rgba(255, 255, 255, 0.1)',
                  color: vrEnvironment === env.id ? '#000' : '#fff',
                  borderColor: env.color,
                  padding: '0.5rem 1rem'
                }}
              >
                {env.icon} {env.name}
              </button>
            ))}
          </div>
        </div>
        
        <div style={styles.vrFrame}>
          <div style={{ textAlign: 'center', color: '#fff' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
              {vrEnvironments.find(env => env.id === vrEnvironment)?.icon}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {vrEnvironments.find(env => env.id === vrEnvironment)?.name}
            </div>
            <div style={{ color: '#a4b0be', fontSize: '1rem', marginTop: '0.5rem' }}>
              {vrEnvironment === 'meditation' && 'Focus on your breathing in this peaceful space'}
              {vrEnvironment === 'space' && 'Take in the vastness of space and find perspective'}
              {vrEnvironment === 'nature' && 'Connect with nature in this serene forest'}
              {vrEnvironment === 'ocean' && 'Feel the calming rhythm of ocean waves'}
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <button style={styles.button}>🥽 Enter VR</button>
          <button style={{...styles.button, background: 'linear-gradient(135deg, #8b5cf6, #a855f7)'}}>🎮 Controllers</button>
          <button style={{...styles.button, background: 'linear-gradient(135deg, #2ed573, #27ae60)'}}>🔊 Audio</button>
        </div>
        
        <button
          onClick={() => toggleComponent('vr')}
          style={{
            ...styles.toggleButton,
            background: activeComponents.vr ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)',
            color: activeComponents.vr ? '#000' : '#fff',
            borderColor: '#8b5cf6',
            width: '100%',
            marginTop: '1rem'
          }}
        >
          {activeComponents.vr ? '🔴 Exit VR Mode' : '🟢 Enter VR Mode'}
        </button>
      </div>
    </div>
  );

  return (
    <div className='w-screen' style={styles.container}>
      <div style={styles.stars}></div>
      <div style={layoutWrap}>
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

        <div style={styles.tabContainer}>
          {[
            { id: 'monitor', name: '🧠 Stress Monitor', icon: '🧠' },
            { id: 'hologram', name: '👨‍👩‍👧‍👦 Family Hologram', icon: '👨‍👩‍👧‍👦' },
            { id: 'activities', name: '🎯 Relief Activities', icon: '🎯' },
            { id: 'vr', name: '🥽 VR Environment', icon: '🥽' }
          ].map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...styles.tab,
                ...(activeTab === tab.id ? styles.activeTab : {})
              }}
            >
              {tab.name}
            </div>
          ))}
        </div>

        <div style={styles.grid}>
          {activeTab === 'monitor' && renderStressMonitor()}
          {activeTab === 'hologram' && renderHologramDisplay()}
          {activeTab === 'activities' && renderReliefActivities()}
          {activeTab === 'vr' && renderVREnvironment()}
        </div>
      </div>
    </div>
  );
};

export default AdvancedDashboard;
