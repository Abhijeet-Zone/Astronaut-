import React from 'react';

const HolographicEffect = ({ children, isActive = false, color = '#00d4ff' }) => {
  const styles = {
    container: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '20px',
      background: isActive 
        ? `linear-gradient(135deg, ${color}20, ${color}10)` 
        : 'rgba(255, 255, 255, 0.05)',
      border: isActive 
        ? `2px solid ${color}80` 
        : '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: isActive 
        ? `0 0 30px ${color}40, inset 0 0 30px ${color}20` 
        : '0 20px 40px rgba(0, 0, 0, 0.3)',
      animation: isActive ? 'hologram 2s ease-in-out infinite' : 'none',
      backdropFilter: 'blur(15px)'
    },
    scanline: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '2px',
      background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      animation: 'scanline 3s linear infinite',
      zIndex: 1
    },
    glitch: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        ${color}20 2px,
        ${color}20 4px
      )`,
      animation: 'glitch 0.3s ease-in-out infinite',
      opacity: isActive ? 0.3 : 0,
      zIndex: 2
    },
    content: {
      position: 'relative',
      zIndex: 3,
      padding: '2rem'
    }
  };

  return (
    <div style={styles.container}>
      {isActive && <div style={styles.scanline}></div>}
      {isActive && <div style={styles.glitch}></div>}
      <div style={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default HolographicEffect;
