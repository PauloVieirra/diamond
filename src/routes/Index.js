import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import AuthRoutes from './Auth.Routes';
import AppRoutes from './App.Routes';
import { useAuth } from '../context/AuthContext';



const AppRoutesControl = () => {
  const { isLoggedIn } = useAuth();
  
  console.log(isLoggedIn);
   
  return (
   
    
      <Routes>
        <Route path="/*" element={ isLoggedIn ? <AppRoutes/> : <AuthRoutes />} />
      </Routes>
    
  );
};

export default AppRoutesControl;





