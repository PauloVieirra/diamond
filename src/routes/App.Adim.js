import React,{useContext} from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Dashboard from '../screens/Controle';
import Cadastro from '../screens/Cadastros';
import { MenuTopApp } from '../componets/Menus';
import { FooterWeb } from '../componets/Footer';
import { StyleContext } from '../context/StyleContext';



function AppAdm  () {
  const {darkMode } = useContext(StyleContext);
  
  return (
    <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div>
       <MenuTopApp/>
      </div>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/Cadastros" element={<Cadastro/>} />
      </Routes> 
      <FooterWeb/>
    </div>
  );
};

export default AppAdm;
