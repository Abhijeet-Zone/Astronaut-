import React from 'react';

function BackgroundVideo() {
  return (
    <video id="bgVideo" autoPlay muted loop playsInline>
      <source src="/background.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

export default BackgroundVideo;