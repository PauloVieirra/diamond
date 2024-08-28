import React, { useState, useEffect, useContext } from 'react';
import supabase from '../../servers/SupabaseConect';
import { StyleContext } from '../../context/StyleContext';
import './styles.css';

const Disciplina = () => {
  const { darkMode } = useContext(StyleContext);
  const [nomeDisciplina, setNomeDisciplina] = useState('');
  const [disciplinas, setDisciplinas] = useState([]);
  const [filteredDisciplinas, setFilteredDisciplinas] = useState([]);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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
      setMessage(`Erro ao buscar disciplinas: ${error.message}`);
    } else {
      setDisciplinas(data);
    }
  };

  const handleSave = async () => {
    if (await checkIfExists('disciplinas', 'nome', nomeDisciplina)) {
      setMessage('Disciplina já cadastrada.');
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from('disciplinas')
        .update({ nome: nomeDisciplina })
        .eq('id', editingId);

      if (error) {
        setMessage(`Erro ao atualizar disciplina: ${error.message}`);
      } else {
        setMessage('Disciplina atualizada com sucesso!');
        setEditingId(null);
      }
    } else {
      const { error } = await supabase.from('disciplinas').insert([{ nome: nomeDisciplina }]);
      if (error) {
        setMessage(`Erro ao salvar disciplina: ${error.message}`);
      } else {
        setMessage('Disciplina cadastrada com sucesso!');
      }
    }

    setNomeDisciplina('');
    fetchDisciplinas();
  };

  const handleEdit = (id) => {
    const disciplina = disciplinas.find((d) => d.id === id);
    setNomeDisciplina(disciplina.nome);
    setEditingId(id);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('disciplinas').delete().eq('id', id);
    if (error) {
      setMessage(`Erro ao excluir disciplina: ${error.message}`);
    } else {
      setMessage('Disciplina excluída com sucesso!');
      fetchDisciplinas();
    }
  };

  const checkIfExists = async (table, column, value) => {
    const { data, error } = await supabase.from(table).select(`${column}`).eq(column, value);
    if (error) {
      setMessage(`Erro ao verificar se existe: ${error.message}`);
      return false;
    }
    return data.length > 0;
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
          <button style={{ width: '100px', height: '42px' }} onClick={handleSave}>
            {editingId ? 'Atualizar' : 'Cadastrar'}
          </button>
        </div>
        {message && <p>{message}</p>}
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
    </div>
  );
};

export default Disciplina;
