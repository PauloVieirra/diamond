import React, { useState, useEffect, useContext } from 'react';
import supabase from '../../servers/SupabaseConect';
import { StyleContext } from '../../context/StyleContext';
import './styles.css';

const Assuntos = () => {
  const { darkMode } = useContext(StyleContext);
  const [nomeAssunto, setNomeAssunto] = useState('');
  const [disciplinas, setDisciplinas] = useState([]);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState('');
  const [bimestreSelecionado, setBimestreSelecionado] = useState('');
  const [assuntos, setAssuntos] = useState([]);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAssuntos();
    fetchDisciplinas();
  }, []);

  const fetchAssuntos = async () => {
    const { data, error } = await supabase.from('assuntos').select('id, nome, disciplina_id, bimestre');
    if (error) {
      setMessage(`Erro ao buscar assuntos: ${error.message}`);
    } else {
      setAssuntos(data);
    }
  };

  const fetchDisciplinas = async () => {
    const { data, error } = await supabase.from('disciplinas').select('id, nome');
    if (error) {
      setMessage(`Erro ao buscar disciplinas: ${error.message}`);
    } else {
      setDisciplinas(data);
    }
  };

  const handleSave = async () => {
    if (await checkIfExists('assuntos', 'nome', nomeAssunto)) {
      setMessage('Assunto já cadastrado.');
      return;
    }

    if (!disciplinaSelecionada || !bimestreSelecionado) {
      setMessage('Por favor, selecione uma disciplina e um bimestre.');
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from('assuntos')
        .update({
          nome: nomeAssunto,
          disciplina_id: disciplinaSelecionada,
          bimestre: bimestreSelecionado,
        })
        .eq('id', editingId);

      if (error) {
        setMessage(`Erro ao atualizar assunto: ${error.message}`);
      } else {
        setMessage('Assunto atualizado com sucesso!');
        setEditingId(null);
      }
    } else {
      const { error } = await supabase.from('assuntos').insert([
        {
          nome: nomeAssunto,
          disciplina_id: disciplinaSelecionada,
          bimestre: bimestreSelecionado,
        },
      ]);
      if (error) {
        setMessage(`Erro ao salvar assunto: ${error.message}`);
      } else {
        setMessage('Assunto cadastrado com sucesso!');
      }
    }

    // Limpar os campos após o cadastro
    setNomeAssunto('');
    setDisciplinaSelecionada('');
    setBimestreSelecionado('');
    fetchAssuntos();
  };

  const handleEdit = (id) => {
    const assunto = assuntos.find((a) => a.id === id);
    setNomeAssunto(assunto.nome);
    setDisciplinaSelecionada(assunto.disciplina_id);
    setBimestreSelecionado(assunto.bimestre);
    setEditingId(id);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('assuntos').delete().eq('id', id);
    if (error) {
      setMessage(`Erro ao excluir assunto: ${error.message}`);
    } else {
      setMessage('Assunto excluído com sucesso!');
      fetchAssuntos();
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
    <div className={`assuntos-page ${darkMode ? 'dark-mode' : ''}`}>
      <div className='lineprof'><h2>Cadastro de Assuntos</h2> </div> 
     <div className='contescola'> 
        
        <div className='continputs'> 
     

      <select
        value={bimestreSelecionado}
        onChange={(e) => setBimestreSelecionado(e.target.value)}
        required
      >
        <option value="">Selecione o Bimestre</option>
        <option value="1">Bimestre 1</option>
        <option value="2">Bimestre 2</option>
        <option value="3">Bimestre 3</option>
        <option value="4">Bimestre 4</option>
      </select>
      <select
        value={disciplinaSelecionada}
        onChange={(e) => setDisciplinaSelecionada(e.target.value)}
        required
      >
        <option value="">Selecione a Disciplina</option>
        {disciplinas.map((disciplina) => (
          <option key={disciplina.id} value={disciplina.id}>
            {disciplina.nome}
          </option>
        ))}
      </select>
        </div>
        <div className='topinput'> 
      <input
        type="text"
        placeholder="Nome do Assunto"
        value={nomeAssunto}
        onChange={(e) => setNomeAssunto(e.target.value)}
      />
        </div>
        <div className='contbtnassunto'> 
      <button onClick={handleSave}
       style={{
        width: '100px',
        height: '42px',
        backgroundColor: editingId ? '#ce9f39' : '#335c81;', // Cor condicional
        color: 'white', // Cor do texto
        }} >
      {editingId ? 'Atualizar' : 'Cadastrar'}</button>
      {message && <p>{message}</p>}
      </div>
      </div>
      <h2>Lista de Assuntos</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Disciplina</th>
            <th>Bimestre</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {assuntos.map((assunto) => {
            const disciplina = disciplinas.find((d) => d.id === assunto.disciplina_id);
            return (
              <tr key={assunto.id}>
                <td>{assunto.nome}</td>
                <td>{disciplina ? disciplina.nome : 'Disciplina não encontrada'}</td>
                <td>{assunto.bimestre}</td>
                <td>
                <div className='contbtns'> 
                  <button className='btn_secondary' onClick={() => handleEdit(assunto.id)}>Editar</button>
                  <button className='btnDell' onClick={() => handleDelete(assunto.id)}>Excluir</button>
                </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Assuntos;
