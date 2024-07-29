import React, { createContext, useState, useContext, useEffect } from 'react';
import localforage from 'localforage'; // Importe localforage
import supabase from '../servers/SupabaseConect';
import { useNavigate } from 'react-router-dom';

// Criando o contexto de autenticação
const AuthContext = createContext();

// Hook para acessar o contexto de autenticação
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provedor de contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [isLoading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Inicialize como falso até verificar o usuário
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  // Função para buscar o usuário localmente ou na sessão do Supabase
  const fetchUser = async () => {
    try {
      const storedUser = await localforage.getItem('user');
      if (storedUser) {
        setIsLoggedIn(true);
        setUser(storedUser);
        console.log('Usuário logado:', storedUser);
      } else {
        const { data: session, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        if (session && session.user) {
          setIsLoggedIn(true);
          setUser(session.user);
          await saveUserLocally(session.user);
          console.log('Usuário logado:', session.user);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error.message);
    }
  };
  
 
  // Salvar o usuário localmente
  const saveUserLocally = async (user) => {
    await localforage.setItem('user', user);
  };

  // Função de login
  const login = async (email, password) => {
    try {
      setLoading(true); // Ativa o loading antes do login

      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        throw new Error("Ocorreu um erro ao fazer login. Por favor, tente novamente mais tarde.");
      }

      console.log('Login bem-sucedido:', user);
      setIsLoggedIn(true);
      setUser(user);

      await saveUserLocally(user); // Salvar o usuário localmente com localforage
      navigate('/'); // Redirecionar para a tela inicial

      return user;
    } catch (error) {
      console.error('Erro ao fazer login:', error.message);
      throw error;
    } finally {
      setLoading(false); // Desativa o loading após o login
    }
  };

  // Função para obter os dados do usuário atual
  const getUserData = async () => {
    if (!user) {
      throw new Error("Nenhum usuário logado.");
    }
    return user;
  };

  // Função de cadastro
  const signUp = async (email, password) => {
    try {
      setLoading(true); // Ativa o loading antes do cadastro

      const { user, error } = await supabase.auth.signUp({
        email,
        password,
        sendEmailVerification: false
      });
  
      if (error) {
        throw new Error(error.message);
      }
  
      console.log('Cadastro bem-sucedido:', user);
  
      await saveUserLocally(user); // Salvar o usuário localmente com localforage
  
     
  
      navigate('/SignIn'); // Redireciona para a tela inicial após o cadastro
  
      return user;
    } catch (error) {
      console.error('Erro ao fazer cadastro:', error.message);
      throw error;
    } finally {
      setLoading(false); // Desativa o loading após o cadastro
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      // Fazer logout do usuário do Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new Error(error.message);
      }

      // Limpar o estado do usuário
      setUser(null);
      setIsLoggedIn(false);
      await localforage.removeItem('user'); // Remover o usuário localmente com localforage
    } catch (error) {
      console.error('Erro ao fazer logout:', error.message);
      throw error;
    }
  };

  // Função para retornar a lista de itens na tabela "escola"
  const getListaEscolas = async () => {
    try {
      // Consulte a tabela "escola" no Supabase para obter os itens
      const { data: escolas, error } = await supabase.from('escola').select('*');

      if (error) {
        throw new Error(error.message);
      }

      // Retorne a lista de escolas
      return escolas;
    } catch (error) {
      console.error('Erro ao obter a lista de escolas:', error.message);
      throw error;
    }
  };

  // Função para lidar com o estado de loading
  const handleLoading = () => {
    setLoading((prevLoading) => !prevLoading);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, isLoading, login, logout, signUp, getUserData, getListaEscolas, handleLoading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};
