import React, { useContext }  from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { Preloader } from '../screens/Preloader';
import SignIn from '../screens/SingIn';
import SignUp from '../screens/SignUp';
import Terms from '../screens/Terms';
import PaymentPage from '../screens/Pay';
import {MenuTopAuth} from '../componets/Menus';
import { FooterWeb } from '../componets/Footer';
import { StyleContext } from '../context/StyleContext';
import { useAuth } from '../context/AuthContext';
import Loading from '../componets/Loading';





function AuthRoutes  () {
  const { isLoading} = useAuth();
  const { darkMode } = useContext(StyleContext);
  console.log(isLoading );
  return (
    <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      
      <div>
     <MenuTopAuth/>
      </div>
      
     <Loading/>
      
      <Routes>
        <Route path="/" element={<Preloader />} />
        <Route path="/SignIn" element={<SignIn/>} />
        <Route path="/SignUp" element={<SignUp/>}/>
        <Route path="/PaymentPage" element={<PaymentPage/>}/>
        <Route path="/Terms" element={<Terms/>}/>
      </Routes> 
     
       <FooterWeb/>
    </div>
  );
};

export default AuthRoutes;
