import React, { useState } from 'react';
import AppNavbar from '../navbars/Navbar';
import Fondo from '../fondo';

const Content = ({ children }) => {
  const [modoOscuro, setModoOscuro] = useState(false);

  return (
    <div className={`app-container ${modoOscuro ? 'modo-oscuro' : 'modo-claro'}`}>
      <Fondo modoOscuro={modoOscuro} />
      <AppNavbar modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} />
      <main>
        {children}
      </main>
    </div>
  );
};

export default Content;
