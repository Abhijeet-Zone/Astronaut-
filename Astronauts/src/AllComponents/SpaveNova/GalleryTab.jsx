import React from 'react';

function GalleryTab() {
  const galleryItems = [
    {
      imgSrc: '/image1.jpeg',
      alt: 'Orion Nebula',
      title: 'Orion Nebula',
      description: 'A stellar nursery located 1,344 light-years from Earth. One of the most studied objects in the night sky.'
    },
    {
      imgSrc: '/image2.jpeg',
      alt: 'Crab Nebula',
      title: 'Crab Nebula',
      description: 'The remnant of a supernova observed in 1054 AD. Contains a pulsar spinning 30 times per second.'
    },
    {
      imgSrc: '/image3.jpeg',
      alt: 'Leopard Spot on Mars',
      title: 'Leopard Spot on Mars',
      description: 'A feature on Mars being investigated by the Perseverance Rover. The image highlights olivine and leopard spot targets.'
    },
    {
      imgSrc: '/image4.jpeg',
      alt: 'Andromeda Galaxy',
      title: 'Andromeda Galaxy',
      description: 'Our nearest major galactic neighbor, containing over 1 trillion stars and approaching the Milky Way.'
    },
  ];

  return (
    <div id="gallery" className="tab-content active">
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>🌌 Deep Space Gallery</h2>
        <div className="gallery-grid">
            {galleryItems.map((item, index) => (
                <div className="image-card" key={index}>
                    <img src={item.imgSrc} alt={item.alt} className="image-placeholder" />
                    <div className="card-content">
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}

export default GalleryTab;