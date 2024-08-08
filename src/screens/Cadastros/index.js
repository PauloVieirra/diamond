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
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [assuntos, setAssuntos] = useState([]);
  const [escolas, setEscolas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  useEffect(() => {
    // Verifica se todos os campos necessários estão preenchidos
    if (
      nomeEscola &&
      nomeProfessor &&
      emailProfessor &&
      nomeDisciplina &&
      nomeAssunto
    ) {
      setIsSaveDisabled(false);
    } else {
      setIsSaveDisabled(true);
    }
  }, [nomeEscola, nomeProfessor, emailProfessor, nomeDisciplina, nomeAssunto]);

  useEffect(() => {
    setMessage('');
    if (selectedTab === 'escola') fetchEscolas();
    if (selectedTab === 'professor') fetchProfessores();
    if (selectedTab === 'disciplina') fetchDisciplinas();
    if (selectedTab === 'assuntos') {
      fetchDisciplinas();
      fetchAssuntos();
    }
  }, [selectedTab]);

  const fetchEscolas = async () => {
    const { data, error } = await supabase.from('escola').select('id, nome, codigo');
    if (error) {
      setMessage(`Erro ao buscar escolas: ${error.message}`);
    } else {
      setEscolas(data);
      setSearchResults(data);
    }
  };

  const fetchProfessores = async () => {
    const { data, error } = await supabase.from('professores').select('id, nome, email');
    if (error) {
      setMessage(`Erro ao buscar professores: ${error.message}`);
    } else {
      setProfessores(data);
      setSearchResults(data);
    }
  };

  const fetchDisciplinas = async () => {
    const { data, error } = await supabase.from('disciplinas').select('id, nome');
    if (error) {
      setMessage(`Erro ao buscar disciplinas: ${error.message}`);
    } else {
      setDisciplinas(data);
      if (selectedTab === 'disciplina') setSearchResults(data);
    }
  };

  const fetchAssuntos = async () => {
    const { data, error } = await supabase.from('assuntos').select('id, nome');
    if (error) {
      setMessage(`Erro ao buscar assuntos: ${error.message}`);
    } else {
      setAssuntos(data);
      setSearchResults(data);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    let results = [];
    if (selectedTab === 'escola') {
      results = escolas.filter((escola) =>
        escola.nome.toLowerCase().includes(term.toLowerCase())
      );
    } else if (selectedTab === 'professor') {
      results = professores.filter((professor) =>
        professor.nome.toLowerCase().includes(term.toLowerCase())
      );
    } else if (selectedTab === 'disciplina') {
      results = disciplinas.filter((disciplina) =>
        disciplina.nome.toLowerCase().includes(term.toLowerCase())
      );
    } else if (selectedTab === 'assuntos') {
      results = assuntos.filter((assunto) =>
        assunto.nome.toLowerCase().includes(term.toLowerCase())
      );
    }
    setSearchResults(results);
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
  
        // Chamar a função add_column_to_relatorio_1 ao salvar os dados
        const columnName = nomeAssunto.replace(/\s+/g, '_'); // Substituir espaços por underscore
        const { error: functionError } = await supabase.rpc('add_column_to_relatorio_1', {
          column_name: columnName
        });
  
        if (functionError) throw new Error(functionError.message);
  
        setMessage('Assunto e coluna cadastrados com sucesso!');
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
    setSearchTerm('');
    setSearchResults([]);
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
            <input
              type="text"
              placeholder="Buscar escola..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e.target.value);
              }}
            />
            <ul>
              {searchResults.map((escola) => (
                <li key={escola.id}>{escola.nome} - {escola.codigo}</li>
              ))}
            </ul>
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
            <input
              type="text"
              placeholder="Buscar professor..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e.target.value);
              }}
            />
            <ul>
              {searchResults.map((professor) => (
                <li key={professor.id}>{professor.nome} - {professor.email}</li>
              ))}
            </ul>
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

            <input
              type="text"
              placeholder="Buscar disciplina..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e.target.value);
              }}
            />
            <ul>
              {searchResults.map((disciplina) => (
                <li key={disciplina.id}>{disciplina.nome}</li>
              ))}
            </ul>
          </div>
        );
      case 'assuntos':
        return (
          <div className="form-group">
            <select
              value={disciplinaSelecionada}
              onChange={(e) => setDisciplinaSelecionada(e.target.value)}
            >
              <option value="">Selecione uma disciplina</option>
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
            <input
              type="text"
              placeholder="Buscar assunto..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e.target.value);
              }}
            />
            <ul>
              {searchResults.map((assunto) => (
                <li key={assunto.id}>{assunto.nome}</li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="tabs">
        <button
          className={selectedTab === 'escola' ? 'active' : ''}
          onClick={() => setSelectedTab('escola')}
        >
          Escola
        </button>
        <button
          className={selectedTab === 'professor' ? 'active' : ''}
          onClick={() => setSelectedTab('professor')}
        >
          Professor
        </button>
        <button
          className={selectedTab === 'disciplina' ? 'active' : ''}
          onClick={() => setSelectedTab('disciplina')}
        >
          Disciplina
        </button>
        <button
          className={selectedTab === 'assuntos' ? 'active' : ''}
          onClick={() => setSelectedTab('assuntos')}
        >
          Assuntos
        </button>
      </div>
      <div className="form-container">
        {renderTabContent()}
        
        {message && <p className="message">{message}</p>}
      </div>
      <div className='topline'>
        <button className='btnsalvar' onClick={handleSave} disabled={isSaveDisabled}>
          Salvar
        </button>
      </div>
      
    </div>
  );
};

export default Cadastro;
