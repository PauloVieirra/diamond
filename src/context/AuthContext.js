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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [complit, setComplit] = useState(null);
  const [professor, setProfessor] = useState(null);
  const [userType, setUserType] = useState('Tipo de usuário não disponível');
  const [isfisc, setIsFisic] = useState(false);
  const [auxiliar, setAuxiliar] = useState(false);
  const [nomeaux, setNomeAux] = useState('Informe o nome do auxiliar');

  

  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      checkIfProfessor(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (professor) {
      setUserType(professor.use_type || 'Tipo de usuário não disponível');
    }
  }, [professor]);

  // Função para buscar o usuário localmente ou na sessão do Supabase
  const fetchUser = async () => {
    try {
      const storedUser = await localforage.getItem('user');
      if (storedUser) {
        setIsLoggedIn(true);
        setUser(storedUser);
      } else {
        const { data: session, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (session && session.user) {
          setIsLoggedIn(true);
          setUser(session.user);
          await saveUserLocally(session.user);
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
    setLoading(true);
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
      sendEmailVerification: false
    });

    if (error) throw new Error(error.message);

    await saveUserLocally(user);

    return { user }; // Apenas retornar o usuário após o cadastro
  } catch (error) {
    console.error('Erro ao fazer cadastro:', error.message);
    throw error;
  } finally {
    setLoading(false);
  }
};


  // Função de login
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw new Error(error.message);

      setIsLoggedIn(true);
      setUser(user);
      await saveUserLocally(user);
      navigate('/'); // Redirecionar para a tela inicial

      return { user };
    } catch (error) {
      console.error('Erro ao fazer login:', error.message);
      throw error;
    } finally {
      setLoading(false);
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

  // Função para verificar se o usuário está cadastrado como professor
  const checkIfProfessor = async (email) => {
    try {
      const { data: professor, error } = await supabase
        .from('professores')
        .select('id, use_type')
        .eq('email', email)
        .maybeSingle();
  
      if (error) {
        throw error;
      }
  
      if (professor) {
        setComplit(true);
        setProfessor(professor);
        console.log('Usuário é um professor cadastrado:', professor);
      } else {
        setComplit(false);
        console.log('Usuário precisa concluir o cadastro.');
      }
    } catch (error) {
      console.error('Erro ao verificar cadastro de professor:', error.message);
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

  // Função para salvar ou atualizar os dados do professor
  const saveProfessorData = async (professorData) => {
    try {
      const professorDataWithUID = {
        ...professorData,
        uid: user.id, // Associa o ID do usuário logado ao campo uid
      };

      const { data, error } = await supabase
        .from('professores')
        .upsert(professorDataWithUID, {
          onConflict: ['email'],
          returning: 'representation',
        });

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.length > 0) {
        const updatedProfessor = data[0];
        setProfessor(updatedProfessor);
        

        setUser((prevUser) => ({
          ...prevUser,
          professor: updatedProfessor,
        }));

        await saveUserLocally({
          ...user,
          professor: updatedProfessor,
        });
      }

      console.log('Dados do professor salvos com sucesso!');
      setComplit(true);
    } catch (error) {
      console.error('Erro ao salvar os dados do professor:', error.message);
      throw error;
    }
  };

  // Função para lidar com o estado de loading
  const handleLoading = () => {
    setLoading((prevLoading) => !prevLoading);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, isLoading,  isfisc, setIsFisic, auxiliar, setAuxiliar, nomeaux, setNomeAux, login, logout, signUp, getUserData, getListaEscolas, handleLoading, fetchUser, complit, saveProfessorData, professor, userType }}>
      {children}
    </AuthContext.Provider>
  );
};
