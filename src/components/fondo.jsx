import React from 'react';
import claro from '../assets/video/claro.mp4';
import oscuro from '../assets/video/oscuro.mp4';

const Fondo = ({ modoOscuro }) => {
  return (
    <div className="video-background">
      <video
        className={`video video-claro ${modoOscuro ? 'hidden' : 'visible'}`}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={claro} type="video/mp4" />
      </video>

      <video
        className={`video video-oscuro ${modoOscuro ? 'visible' : 'hidden'}`}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={oscuro} type="video/mp4" />
      </video>
    </div>
  );
};

export default Fondo;
