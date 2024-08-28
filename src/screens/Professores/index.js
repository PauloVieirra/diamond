import React, { useState, useEffect, useContext } from 'react';
import supabase from '../../servers/SupabaseConect';
import { StyleContext } from '../../context/StyleContext';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import './styles.css';

const Professor = () => {
  const { darkMode } = useContext(StyleContext);
  const [emailProfessor, setEmailProfessor] = useState('');
  const [senhaProfessor, setSenhaProfessor] = useState('');
  const [professores, setProfessores] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Adicionado
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchProfessores = async () => {
      const { data, error } = await supabase.from('professores').select('id, nome, email');
      if (error) {
        setSnackbarMessage(`Erro ao buscar professores: ${error.message}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } else {
        setProfessores(data);
      }
    };
    fetchProfessores();
  }, []);

  const handleSave = async () => {
    const { user, error: authError } = await supabase.auth.signUp({
      email: emailProfessor,
      password: senhaProfessor,
    });

    if (authError) {
      setSnackbarMessage(`Erro ao criar usuário: ${authError.message}`);
      setSnackbarSeverity('error');
    } else {
      setSnackbarMessage('Usuário cadastrado com sucesso!');
      setSnackbarSeverity('success');
      setEmailProfessor('');
      setSenhaProfessor('');

      // Após cadastrar, recarregar a lista de professores
      const { data: newProfessores, error } = await supabase.from('professores').select('id, nome, email');
      if (!error) {
        setProfessores(newProfessores);
      }
    }

    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Função para filtrar professores
  const filteredProfessores = professores.filter((professor) =>
    professor.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`professor-page ${darkMode ? 'dark-mode' : ''}`}>
      
      <div className='lineprof'><h2>Cadastro de Professor</h2> </div> 

      <div className='conttoppro'>
        <div className='inp'>
          <div className="form-group">
            <div>Email:</div>
            <input
              type="email"
              value={emailProfessor}
              onChange={(e) => setEmailProfessor(e.target.value)}
            />
          </div>
          <div className="form-group">
            <div>Senha:</div>
            <input
              type="password"
              value={senhaProfessor}
              onChange={(e) => setSenhaProfessor(e.target.value)}
            />
          </div>
        </div>
        <div className='btninp'> 
          <button onClick={handleSave} style={{width:'100px', height:'42px'}}>Cadastrar</button> 
        </div>
      </div>

      <div className='search-container'>
        <input
          type="text"
          placeholder="Buscar por nome"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '300px' }}
        />
      </div>

      <div> 
        <h2>Lista de Professores</h2>  
        <div> 
          <table className="professor-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfessores.map((professor) => (
                <tr key={professor.id}>
                  <td>{professor.id}</td>
                  <td>{professor.nome}</td>
                  <td>{professor.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

export default Professor;
