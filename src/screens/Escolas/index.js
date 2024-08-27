import React, { useState, useEffect, useContext } from 'react';
import supabase from '../../servers/SupabaseConect';
import { StyleContext } from '../../context/StyleContext';
import './styles.css';

const Escola = () => {
  const { darkMode } = useContext(StyleContext);
  const [nomeEscola, setNomeEscola] = useState('');
  const [codigoEscola, setCodigoEscola] = useState('');
  const [escolas, setEscolas] = useState([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchEscolas();
  }, []);

  const fetchEscolas = async () => {
    const { data, error } = await supabase.from('escola').select('id, nome, codigo');
    if (error) {
      setMessage(`Erro ao buscar escolas: ${error.message}`);
    } else {
      setEscolas(data);
      setSearchResults(data);
    }
  };

  const handleSave = async () => {
    if (await checkIfExists('escola', 'nome', nomeEscola)) {
      setMessage('Escola já cadastrada.');
      return;
    }
    
    if (editingId) {
      const { error } = await supabase
        .from('escola')
        .update({ nome: nomeEscola, codigo: codigoEscola })
        .eq('id', editingId);

      if (error) {
        setMessage(`Erro ao atualizar escola: ${error.message}`);
      } else {
        setMessage('Escola atualizada com sucesso!');
        setEditingId(null);
      }
    } else {
      const { error } = await supabase.from('escola').insert([{ nome: nomeEscola, codigo: codigoEscola }]);
      if (error) {
        setMessage(`Erro ao salvar escola: ${error.message}`);
      } else {
        setMessage('Escola cadastrada com sucesso!');
      }
    }
    setNomeEscola('');
    setCodigoEscola('');
    fetchEscolas();
  };

  const handleEdit = (id) => {
    const escola = escolas.find((e) => e.id === id);
    setNomeEscola(escola.nome);
    setCodigoEscola(escola.codigo);
    setEditingId(id);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('escola').delete().eq('id', id);
    if (error) {
      setMessage(`Erro ao excluir escola: ${error.message}`);
    } else {
      setMessage('Escola excluída com sucesso!');
      fetchEscolas();
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

  const handleSearch = (term) => {
    setSearchTerm(term);
    const results = escolas.filter((escola) =>
      escola.nome.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <div className={`cont-escola ${darkMode ? 'dark-mode' : ''}`}>
       <div className='lineprof'><h2>Cadastro de Escolas</h2> </div> 
       <div className='contescola'>
       <div className='inpescola'>
       <div className="form-group"> 
      <input
        type="text"
        placeholder="Nome da Escola"
        value={nomeEscola}
        onChange={(e) => setNomeEscola(e.target.value)}
      />
      </div>
      <div className="form-group">
      <input
        type="text"
        placeholder="Código da Escola"
        value={codigoEscola}
        onChange={(e) => setCodigoEscola(e.target.value)}
      />
      </div>
        </div>
        <div className='btninp'> 
        <button onClick={handleSave}  
        style={{
        width: '100px',
        height: '42px',
        backgroundColor: editingId ? '#ce9f39' : '#335c81;', // Cor condicional
        color: 'white', // Cor do texto
        }} >
        {editingId ? 'Atualizar' : 'Cadastrar'}</button>
        </div>
      
      {message && <p>{message}</p>}

      </div>

      <h2>Pesquisar Escola</h2>
      <div className='linebusca'>
      <input
        type="text"
        placeholder="Buscar por nome"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />
      </div>
      

      <h2>Lista de Escolas</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Código</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((escola) => (
            <tr key={escola.id}>
              <td>{escola.nome}</td>
              <td>{escola.codigo}</td>
              <td>
                <div className='contbtns'> 
                <button className='btn_secondary' onClick={() => handleEdit(escola.id)}>Editar</button>
                <button className='btnDell' onClick={() => handleDelete(escola.id)}>Excluir</button>
                </div>
               
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Escola;
