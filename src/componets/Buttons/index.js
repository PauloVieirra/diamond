import React, { useState, useContext, useEffect } from 'react';
import { StyleContext } from '../../context/StyleContext';
import './style.css'; 

const SwitchButton = () => {
  const { darkMode, toggleDarkMode } = useContext(StyleContext);
  const [isActive, setIsActive] = useState(darkMode); // Inicializa com o valor de darkMode

  useEffect(() => {
    setIsActive(darkMode);
  }, [darkMode]);

  const toggleSwitch = () => {
    toggleDarkMode(); // Alterna o tema
    setIsActive(prev => !prev); // Alterna o estado de ativo
  };

  return (
    <div className="switch-container">
      <label className="switch">
        <input
          type="checkbox"
          checked={isActive}
          onChange={toggleSwitch}
        />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default SwitchButton;
