import React, { useState, useEffect, useContext } from 'react';
import supabase from '../../servers/SupabaseConect';
import { StyleContext } from '../../context/StyleContext';
import './styles.css';

const Cadastro = () => {
  const { darkMode } = useContext(StyleContext);
  const [selectedTab, setSelectedTab] = useState('escola');
  const [nomeEscola, setNomeEscola] = useState('');
  const [codigoEscola, setCodigoEscola] = useState('');
  const [nomeProfessor, setNomeProfessor] = useState('');
  const [emailProfessor, setEmailProfessor] = useState('');
  const [nomeDisciplina, setNomeDisciplina] = useState('');
  const [nomeAssunto, setNomeAssunto] = useState('');
  const [disciplinas, setDisciplinas] = useState([]);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMessage('');
  }, [selectedTab]);

  useEffect(() => {
    if (selectedTab === 'assuntos') {
      fetchDisciplinas();
    }
  }, [selectedTab]);

  const fetchDisciplinas = async () => {
    const { data, error } = await supabase.from('disciplinas').select('id, nome');
    if (error) {
      setMessage(`Erro ao buscar disciplinas: ${error.message}`);
    } else {
      setDisciplinas(data);
    }
  };

  const checkIfExists = async (table, field, value) => {
    const { data, error } = await supabase.from(table).select('id').eq(field, value);
    if (error) {
      setMessage(`Erro ao verificar existência: ${error.message}`);
      return false;
    }
    return data.length > 0;
  };

  const handleSave = async () => {
    try {
      if (selectedTab === 'disciplina') {
        if (await checkIfExists('disciplinas', 'nome', nomeDisciplina)) {
          setMessage('Disciplina já cadastrada.');
          return;
        }
        await addNewDisciplina(nomeDisciplina);
        setMessage('Disciplina cadastrada com sucesso!');
        clearFields();
      } else if (selectedTab === 'escola') {
        if (await checkIfExists('escola', 'nome', nomeEscola)) {
          setMessage('Escola já cadastrada.');
          return;
        }
        const { data, error } = await supabase.from('escola').insert([
          { nome: nomeEscola, codigo: codigoEscola }
        ]);
        if (error) throw new Error(error.message);
        setMessage('Escola cadastrada com sucesso!');
        clearFields();
      } else if (selectedTab === 'professor') {
        if (await checkIfExists('professores', 'email', emailProfessor)) {
          setMessage('Professor já cadastrado.');
          return;
        }
        const { data, error } = await supabase.from('professores').insert([
          { nome: nomeProfessor, email: emailProfessor }
        ]);
        if (error) throw new Error(error.message);
        setMessage('Professor cadastrado com sucesso!');
        clearFields();
      } else if (selectedTab === 'assuntos') {
        if (await checkIfExists('assuntos', 'nome', nomeAssunto)) {
          setMessage('Assunto já cadastrado.');
          return;
        }
        const { data, error } = await supabase.from('assuntos').insert([
          { nome: nomeAssunto, disciplina_id: disciplinaSelecionada }
        ]);
        if (error) throw new Error(error.message);
        setMessage('Assunto cadastrado com sucesso!');
        clearFields();
      }
    } catch (error) {
      setMessage(`Erro ao realizar cadastro: ${error.message}`);
    }
  };

  const addNewDisciplina = async (disciplinaNome) => {
    const { data, error } = await supabase.from('disciplinas').insert([{ nome: disciplinaNome }]);
    if (error) throw new Error(error.message);
  };

  const clearFields = () => {
    setNomeEscola('');
    setCodigoEscola('');
    setNomeProfessor('');
    setEmailProfessor('');
    setNomeDisciplina('');
    setNomeAssunto('');
    setDisciplinaSelecionada('');
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'escola':
        return (
          <div className="form-group">
            <input
              type="text"
              placeholder="Nome da Escola"
              value={nomeEscola}
              onChange={(e) => setNomeEscola(e.target.value)}
            />
            <input
              type="text"
              placeholder="Código da Escola"
              value={codigoEscola}
              onChange={(e) => setCodigoEscola(e.target.value)}
            />
          </div>
        );
      case 'professor':
        return (
          <div className="form-group">
            <input
              type="text"
              placeholder="Nome do Professor"
              value={nomeProfessor}
              onChange={(e) => setNomeProfessor(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email do Professor"
              value={emailProfessor}
              onChange={(e) => setEmailProfessor(e.target.value)}
            />
          </div>
        );
      case 'disciplina':
        return (
          <div className="form-group">
            <input
              type="text"
              placeholder="Nome da Disciplina"
              value={nomeDisciplina}
              onChange={(e) => setNomeDisciplina(e.target.value)}
            />
          </div>
        );
      case 'assuntos':
        return (
          <div className="form-group">
            <select
              value={disciplinaSelecionada}
              onChange={(e) => setDisciplinaSelecionada(e.target.value)}
            >
              <option value="">Selecione uma Disciplina</option>
              {disciplinas.map((disciplina) => (
                <option key={disciplina.id} value={disciplina.id}>
                  {disciplina.nome}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Nome do Assunto"
              value={nomeAssunto}
              onChange={(e) => setNomeAssunto(e.target.value)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className='topline'>Cadastro</div>
      <div className="container">
        <div className="tabs">
          <button onClick={() => setSelectedTab('escola')} className={selectedTab === 'escola' ? 'active' : ''}>
            Escola
          </button>
          <button onClick={() => setSelectedTab('professor')} className={selectedTab === 'professor' ? 'active' : ''}>
            Professor
          </button>
          <button onClick={() => setSelectedTab('disciplina')} className={selectedTab === 'disciplina' ? 'active' : ''}>
            Disciplina
          </button>
          <button onClick={() => setSelectedTab('assuntos')} className={selectedTab === 'assuntos' ? 'active' : ''}>
            Assuntos
          </button>
        </div>
        <div className="tab-content">
          {renderTabContent()}
        </div>
        {message && <p className="message">{message}</p>}
      </div>
      <div className='conttbnsalvar'>
        <button onClick={handleSave} className="save-button">Salvar</button>
      </div>
    </main>
  );
};

export default Cadastro;
