import React,{useContext} from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Dashboard from '../screens/Controle';
import Cadastro from '../screens/Cadastros';
import Escola from '../screens/Escolas';
import Professor from '../screens/Professores';
import Alunos from '../screens/Alunos';
import Disciplina from '../screens/Disciplina';
import Assuntos from '../screens/Assuntos';
import Desempenho from '../screens/Desempenhos';
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
        <Route path="/Professores" element={<Professor/>}/>
        <Route path="/Escolas" element={<Escola/>}/>
        <Route path="/Disciplina" element={<Disciplina/>}/>
        <Route path="/Alunos" element={<Alunos/>}/>
        <Route path="/Assuntos" element={<Assuntos/>}/>
        <Route path="/Desempenhos" element={<Desempenho/>}/>
      </Routes> 
     
    </div>
  );
};

export default AppAdm;
