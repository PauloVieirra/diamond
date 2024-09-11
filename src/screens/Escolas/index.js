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
    if (!nomeEscola.trim()) {
      alert("Por favor, preencha o nome da escola.");
      return; // Interrompe a execução se o campo estiver vazio
    }
  
    if (await checkIfExists('escola', 'nome', nomeEscola)) {
      alert('Escola já cadastrada.');
      return;
    }
    
    if (editingId) {
      const { error } = await supabase
        .from('escola')
        .update({ nome: nomeEscola, codigo: codigoEscola })
        .eq('id', editingId);
  
      if (error) {
        alert(`Erro ao atualizar escola: ${error.message}`);
      } else {
        alert('Escola atualizada com sucesso!');
        setEditingId(null);
      }
    } else {
      const { error } = await supabase.from('escola').insert([{ nome: nomeEscola, codigo: codigoEscola }]);
      if (error) {
        alert(`Erro ao salvar escola: ${error.message}`);
      } else {
        alert('Escola cadastrada com sucesso!');
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
    try {
      // Passo 1: Buscar o nome da escola que está sendo excluída
      const { data: escola, error: escolaError } = await supabase
        .from('escola')
        .select('nome')
        .eq('id', id)
        .single();
  
      if (escolaError || !escola) {
        const errorMessage = `Erro ao encontrar a escola: ${escolaError ? escolaError.message : 'Escola não encontrada'}`;
        alert(errorMessage);
        return;
      }
  
      const nomeEscola = escola.nome;
  
      // Passo 2: Verificar se a escola está associada a algum professor
      const { data: professores, error: professoresError } = await supabase
        .from('professores')
        .select('id')
        .eq('escola', nomeEscola);
  
      if (professoresError) {
        alert(`Erro ao verificar professores da escola: ${professoresError.message}`);
        return;
      }
  
      // Se houver professores associados, impedir a exclusão
      if (professores.length > 0) {
        alert('Não é possível excluir a escola. Há professores associados a esta escola.');
        return;
      }
  
      // Passo 3: Buscar todos os alunos associados à escola
      const { data: alunos, error: alunosError } = await supabase
        .from('alunos')
        .select('id')
        .eq('Instituicao', nomeEscola);
  
      if (alunosError) {
        alert(`Erro ao verificar alunos da escola: ${alunosError.message}`);
        return;
      }
  
      // Se não houver alunos associados, permitir a exclusão
      if (alunos.length === 0) {
        const { error } = await supabase.from('escola').delete().eq('id', id);
        if (error) {
          alert(`Erro ao excluir escola: ${error.message}`);
        } else {
          alert('Escola excluída com sucesso!');
          fetchEscolas();
        }
        return;
      }
  
      // Passo 4: Verificar se algum aluno tem relatório na tabela resumo_1
      const alunoIds = alunos.map((aluno) => aluno.id);
      const { data: relatorios, error: relatoriosError } = await supabase
        .from('resumo_1')
        .select('id')
        .in('aluno_id', alunoIds);
  
      if (relatoriosError) {
        alert(`Erro ao verificar relatórios: ${relatoriosError.message}`);
        return;
      }
  
      // Se algum aluno tiver relatórios, impedir a exclusão
      if (relatorios.length > 0) {
        alert('Não é possível excluir a escola. Há alunos com relatórios vinculados a esta escola.');
        return;
      }
  
      // Passo 5: Excluir a escola se não houver relatórios
      const { error } = await supabase.from('escola').delete().eq('id', id);
      if (error) {
        alert(`Erro ao excluir escola: ${error.message}`);
      } else {
        alert('Escola excluída com sucesso!');
        fetchEscolas();
      }
    } catch (error) {
      console.error('Erro ao excluir a escola:', error);
      alert(`Erro inesperado: ${error.message}`);
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
        required
      />
      </div>
      <div className="form-group">
      <input
        type="text"
        placeholder="Código da Escola"
        value={codigoEscola}
        onChange={(e) => setCodigoEscola(e.target.value)}
        readOnly={!!editingId}
        required
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
