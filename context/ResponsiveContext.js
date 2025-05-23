// ResponsiveContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const ResponsiveContext = createContext();

export const ResponsiveProvider = ({ children }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768); // Definir el umbral para considerar pantallas pequeñas
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Llamar a la función una vez al inicio para inicializar el estado

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <ResponsiveContext.Provider value={{ isSmallScreen }}>
      {children}
    </ResponsiveContext.Provider>
  );
};

export const useResponsive = () => useContext(ResponsiveContext);
