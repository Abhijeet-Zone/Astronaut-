import React from 'react';

function GalleryTab() {
  const galleryItems = [
    {
      imgSrc: '/image1.jpeg',
      alt: 'Orion Nebula',
      title: 'DEATH OF THE STAR',
      description: 'its an image taken from james web satallite . A stellar nursery located 1,344 light-years from Earth.its shows the death of the star. One of the most studied objects in the night sky.'
    },
    {
      imgSrc: '/image2.jpeg',
      alt: 'Crab Nebula',
      title: 'BIRTH OF THE STAR ',
      description: 'Its image of birth snf death of the stars. the crab nebula is a supernova remnant and pulsar wind nebula in the constellation of the taurus.'
    },
     
    {
      imgSrc: '/image3.jpeg',
      alt: 'Leopard Spot on Mars',
      title: 'FOSSILE ON MARS',
      description: 'A feature on Mars being investigated by the Perseverance Rover. its shows the fossile on the mars and proof of the life .The image highlights olivine and leopard spot targets.'
    },
    {
      imgSrc: '/image4.jpeg',
      alt: 'Andromeda Galaxy',
      title: 'LETTUCE TO VITAMINS',
      description: 'Astronauts Sunita Williams and Butch Wilmore, whose eight-day mission turned into nine months on the International Space Station, are finally heading back to Earth aboard the SpaceX Dragon spacecraft. They have undocked from the ISS and are on their way. '
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