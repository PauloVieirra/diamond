import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthRoutes from './Auth.Routes';
import AppRoutes from './App.Routes';
import AppAdm from './App.Adim';
import { useAuth } from '../context/AuthContext';

const AppRoutesControl = () => {
  const { isLoggedIn, user, userType } = useAuth();
  
  // Determine o redirecionamento com base no userType
  if (!isLoggedIn) {
    return <AuthRoutes />;
  }

  if (userType === 'ADM') {
    return (
      <Routes>
        <Route path="/*" element={<AppAdm />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/*" element={<AppRoutes />} />
    </Routes>
  );
};

export default AppRoutesControl;
