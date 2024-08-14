import React,{useContext} from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Home from '../screens/Home';
import Ravform from '../screens/Ravform';
import RavGerador from '../screens/RavGerador';
import { MenuTopApp } from '../componets/Menus';
import { FooterWeb } from '../componets/Footer';
import { StyleContext } from '../context/StyleContext';



function AppRoutes  () {
  const {darkMode } = useContext(StyleContext);
  
  return (
    <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div>
       <MenuTopApp/>
      </div>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path='/Ravform/:id' element={<Ravform/>}/>
        <Route path='/RavGerador/:id' element={<RavGerador/>}/>
      </Routes> 
    </div>
  );
};

export default AppRoutes;
