import React, { useState, useEffect, useContext } from 'react';
import supabase from '../../servers/SupabaseConect';
import { StyleContext } from '../../context/StyleContext';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import './styles.css';

const Assuntos = () => {
  const { darkMode } = useContext(StyleContext);
  const [nomeAssunto, setNomeAssunto] = useState('');
  const [disciplinas, setDisciplinas] = useState([]);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState('');
  const [bimestreSelecionado, setBimestreSelecionado] = useState('');
  const [assuntos, setAssuntos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [cursoSelecionado, setCursoSelecionado] = useState('');
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    fetchAssuntos();
    fetchDisciplinas();
  }, [searchQuery]);

  const fetchAssuntos = async () => {
    const { data, error } = await supabase.from('assuntos').select('id, nome, disciplina_id, bimestre');
    if (error) {
      showSnack(`Erro ao buscar assuntos: ${error.message}`, 'error');
    } else {
      const filteredAssuntos = data.filter(assunto =>
        assunto.nome.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setAssuntos(filteredAssuntos);
    }
  };
  

  const fetchDisciplinas = async () => {
    const { data, error } = await supabase.from('disciplinas').select('id, nome');
    if (error) {
      showSnack(`Erro ao buscar disciplinas: ${error.message}`, 'error');
    } else {
      setDisciplinas(data);
    }
  };

  const handleSave = async () => {
    if (await checkIfExists('assuntos', 'nome', nomeAssunto)) {
      showSnack('Assunto já cadastrado.', 'warning');
      return;
    }

    if (!disciplinaSelecionada || !bimestreSelecionado) {
      showSnack('Por favor, selecione uma disciplina e um bimestre.', 'warning');
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from('assuntos')
        .update({
          nome: nomeAssunto,
          disciplina_id: disciplinaSelecionada,
          bimestre: bimestreSelecionado,
          curso: cursoSelecionado,
        })
        .eq('id', editingId);

      if (error) {
        showSnack(`Erro ao atualizar assunto: ${error.message}`, 'error');
      } else {
        showSnack('Assunto atualizado com sucesso!', 'success');
        setEditingId(null);
      }
    } else {
      const { error } = await supabase.from('assuntos').insert([
        {
          nome: nomeAssunto,
          disciplina_id: disciplinaSelecionada,
          bimestre: bimestreSelecionado,
          curso: cursoSelecionado,
        },
      ]);
      if (error) {
        showSnack(`Erro ao salvar assunto: ${error.message}`, 'error');
      } else {
        showSnack('Assunto cadastrado com sucesso!', 'success');
      }
    }

    // Limpar os campos após o cadastro
    setNomeAssunto('');
    setDisciplinaSelecionada('');
    setBimestreSelecionado('');
    setCursoSelecionado('');
    fetchAssuntos();
  };

  const handleEdit = (id) => {
    const assunto = assuntos.find((a) => a.id === id);
    setNomeAssunto(assunto.nome);
    setDisciplinaSelecionada(assunto.disciplina_id);
    setBimestreSelecionado(assunto.bimestre);
    setCursoSelecionado(assunto.curso);
    setEditingId(id);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('assuntos').delete().eq('id', id);
    if (error) {
      showSnack(`Erro ao excluir assunto: ${error.message}`, 'error');
    } else {
      showSnack('Assunto excluído com sucesso!', 'success');
      fetchAssuntos();
    }
  };

  const checkIfExists = async (table, column, value) => {
    const { data, error } = await supabase.from(table).select(`${column}`).eq(column, value);
    if (error) {
      showSnack(`Erro ao verificar se existe: ${error.message}`, 'error');
      return false;
    }
    return data.length > 0;
  };

  const showSnack = (message, severity) => {
    setSnack({ open: true, message, severity });
  };

  const handleSnackClose = () => {
    setSnack({ ...snack, open: false });
  };

  const cursoOptions = [
    { value: '5° Ano', label: '5° Ano' },
    { value: '6° Ano', label: '6° Ano' },
    { value: '7° Ano', label: '7° Ano' },
    { value: '8° Ano', label: '8° Ano' },
    { value: '9° Ano', label: '9° Ano' },
    { value: '1° Ano', label: '1° Ano' },
    { value: '2° Ano', label: '2° Ano' },
    { value: '3° Ano', label: '3° Ano' },
  ];

  return (
    <main> 
    <div className={`assuntos-page ${darkMode ? 'dark-mode' : ''}`}>
      <div className='assuntos-container'> 
        <div className='lineprof'><h2>Cadastro de Assuntos</h2></div> 
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
            <select
              id="curso"
              name="curso"
              value={cursoSelecionado}
              onChange={(e) => setCursoSelecionado(e.target.value)}
              required
            >
              <option value="">Selecione uma série
              </option>
              {cursoOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
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
            <button
              onClick={handleSave}
              style={{
                width: '100px',
                height: '42px',
                backgroundColor: editingId ? '#ce9f39' : '#335c81', // Cor condicional
                color: 'white',
              }}
            >
              {editingId ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </div>
        <div><div>
        <input
          type="text"
          placeholder="Buscar por nome"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{width:'300px'}}
        />
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
      <Snackbar
        open={snack.open}
        autoHideDuration={5000}
        onClose={handleSnackClose}
      >
        <MuiAlert onClose={handleSnackClose} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </MuiAlert>
      </Snackbar>
    </div>
    </main>
  );
};

export default Assuntos;
