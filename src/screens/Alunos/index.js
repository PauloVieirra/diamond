import React, { useState, useEffect, useContext } from 'react';
import supabase from '../../servers/SupabaseConect';
import { StyleContext } from '../../context/StyleContext';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import './styles.css';

const Alunos = () => {
  const { darkMode } = useContext(StyleContext);
  const [alunos, setAlunos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchAlunos = async () => {
      const { data, error } = await supabase.from('alunos').select('id, name');
      if (error) {
        setSnackbarMessage(`Erro ao buscar alunos: ${error.message}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } else {
        setAlunos(data);
      }
    };
    fetchAlunos();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Executa a busca somente após 3 letras
    if (value.length >= 3) {
      const fetchAlunos = async () => {
        const { data, error } = await supabase
          .from('alunos')
          .select('id, name')
          .ilike('name', `%${value}%`); // Filtra pelo nome com base no valor inserido

        if (error) {
          setSnackbarMessage(`Erro ao buscar alunos: ${error.message}`);
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        } else {
          setAlunos(data);
        }
      };
      fetchAlunos();
    } else if (value.length === 0) {
      // Se o campo de busca estiver vazio, exibe todos os alunos novamente
      const fetchAlunos = async () => {
        const { data, error } = await supabase.from('alunos').select('id, name');
        if (error) {
          setSnackbarMessage(`Erro ao buscar alunos: ${error.message}`);
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        } else {
          setAlunos(data);
        }
      };
      fetchAlunos();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className={`alunos-page ${darkMode ? 'dark-mode' : ''}`}>
      <div className="lineprof">
        <h2>Lista de Alunos</h2>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className='alunos-container'>
        <table className="alunos-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
             
            </tr>
          </thead>
          <tbody>
            {alunos.map((aluno) => (
              <tr key={aluno.id}>
                <td>{aluno.id}</td>
                <td>{aluno.name}</td>
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Alunos;
