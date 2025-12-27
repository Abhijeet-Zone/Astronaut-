import React from 'react';

function BackgroundVideo() {
  return (
    <video 
      id="bgVideo" 
      autoPlay 
      muted 
      loop 
      playsInline
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        minWidth: '100vw',
        minHeight: '100vh',
        width: '100vw',
        height: '100vh',
        objectFit: 'cover',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: 1,
        filter: 'brightness(0.45) contrast(1.1) saturate(1.1)'
      }}
    >
      <source src="/background.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

export default BackgroundVideo;