import React, { useState, useEffect, useContext } from 'react';
import supabase from '../../servers/SupabaseConect';
import { StyleContext } from '../../context/StyleContext';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import './styles.css';

const Disciplina = () => {
  const { darkMode } = useContext(StyleContext);
  const [nomeDisciplina, setNomeDisciplina] = useState('');
  const [disciplinas, setDisciplinas] = useState([]);
  const [filteredDisciplinas, setFilteredDisciplinas] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchDisciplinas();
  }, []);

  useEffect(() => {
    setFilteredDisciplinas(
      disciplinas.filter(disciplina =>
        disciplina.nome.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, disciplinas]);

  const fetchDisciplinas = async () => {
    const { data, error } = await supabase.from('disciplinas').select('id, nome');
    if (error) {
      setSnackbarMessage(`Erro ao buscar disciplinas: ${error.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } else {
      setDisciplinas(data);
    }
  };

  const handleSave = async () => {
    if (!nomeDisciplina.trim()) {
      setSnackbarMessage('O nome da disciplina é obrigatório.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    if (await checkIfExists('disciplinas', 'nome', nomeDisciplina)) {
      setSnackbarMessage('Disciplina já cadastrada.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from('disciplinas')
        .update({ nome: nomeDisciplina })
        .eq('id', editingId);

      if (error) {
        setSnackbarMessage(`Erro ao atualizar disciplina: ${error.message}`);
        setSnackbarSeverity('error');
      } else {
        setSnackbarMessage('Disciplina atualizada com sucesso!');
        setSnackbarSeverity('success');
        setEditingId(null);
      }
    } else {
      const { error: insertError } = await supabase.from('disciplinas').insert([{ nome: nomeDisciplina }]);
      if (insertError) {
        setSnackbarMessage(`Erro ao salvar disciplina: ${insertError.message}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }

      const { error: alterError } = await supabase.rpc('add_column_to_bimestre_1', {
        column_name: nomeDisciplina
      });

      if (alterError) {
        setSnackbarMessage(`Erro ao adicionar disciplina: ${alterError.message}`);
        setSnackbarSeverity('error');
      } else {
        setSnackbarMessage('Disciplina cadastrada com sucesso!');
        setSnackbarSeverity('success');
      }
    }

    setNomeDisciplina('');
    fetchDisciplinas();
    setSnackbarOpen(true);
  };

  const handleEdit = (id) => {
    const disciplina = disciplinas.find((d) => d.id === id);
    setNomeDisciplina(disciplina.nome);
    setEditingId(id);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('disciplinas').delete().eq('id', id);
    if (error) {
      setSnackbarMessage(`Erro ao excluir disciplina: ${error.message}`);
      setSnackbarSeverity('error');
    } else {
      setSnackbarMessage('Disciplina excluída com sucesso!');
      setSnackbarSeverity('success');
      fetchDisciplinas();
    }
    setSnackbarOpen(true);
  };

  const checkIfExists = async (table, column, value) => {
    const { data, error } = await supabase.from(table).select(`${column}`).eq(column, value);
    if (error) {
      setSnackbarMessage(`Erro ao verificar se existe: ${error.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return false;
    }
    return data.length > 0;
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className={`disciplina-page ${darkMode ? 'dark-mode' : ''}`}>
      <div className='lineprof'><h2>Cadastro de Disciplina</h2></div>
      <div className='conttoppro'>
        <div className="form-group">
          <input
            type="text"
            placeholder="Nome da Disciplina"
            value={nomeDisciplina}
            onChange={(e) => setNomeDisciplina(e.target.value)}
          />
        </div>
        <div className='btninp'>
          <button
            style={{ width: '100px', height: '42px' }}
            onClick={handleSave}
            disabled={!nomeDisciplina.trim()} // Desativa o botão se o campo estiver vazio
          >
            {editingId ? 'Atualizar' : 'Cadastrar'}
          </button>
        </div>
      </div>

      <div className='search-container'>
        <input
          type="text"
          placeholder="Buscar Disciplina"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <h2>Lista de Disciplinas</h2>
      <div className='professor-list'>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredDisciplinas.map((disciplina) => (
              <tr key={disciplina.id}>
                <td>{disciplina.nome}</td>
                <td>
                  <div className='contbtns'>
                    <button className='btn_secondary' onClick={() => handleEdit(disciplina.id)}>Editar</button>
                    <button className='btnDell' onClick={() => handleDelete(disciplina.id)}>Excluir</button>
                  </div>
                </td>
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

export default Disciplina;
