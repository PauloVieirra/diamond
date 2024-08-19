import React, { useState, useEffect, useContext } from 'react';
import supabase from '../../servers/SupabaseConect';
import { StyleContext } from '../../context/StyleContext';
import './styles.css';

const Cadastro = () => {
  const { darkMode } = useContext(StyleContext);
  const [selectedTab, setSelectedTab] = useState('escola');
  const [nomeEscola, setNomeEscola] = useState('');
  const [codigoEscola, setCodigoEscola] = useState('');
  const [emailProfessor, setEmailProfessor] = useState('');
  const [senhaProfessor, setSenhaProfessor] = useState('');
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

  // Variables for selected student and subject
  const [selectedAlunoId, setSelectedAlunoId] = useState('');
  const [selectedAssuntoId, setSelectedAssuntoId] = useState('');

  useEffect(() => {
    // Verifica se todos os campos necessários estão preenchidos
    setIsSaveDisabled(
      !(selectedTab === 'escola' && nomeEscola && codigoEscola) &&
      !(selectedTab === 'professor' && emailProfessor && senhaProfessor) &&
      !(selectedTab === 'disciplina' && nomeDisciplina) &&
      !(selectedTab === 'assuntos' && nomeAssunto && disciplinaSelecionada)
    );
  }, [nomeEscola, codigoEscola, emailProfessor, senhaProfessor, nomeDisciplina, nomeAssunto, disciplinaSelecionada, selectedTab]);

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
        professor.email.toLowerCase().includes(term.toLowerCase())
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
        const { error: insertError } = await supabase.from('disciplinas').insert([{ nome: nomeDisciplina }]);
        if (insertError) throw insertError;
        setMessage('Disciplina cadastrada com sucesso!');
      } else if (selectedTab === 'escola') {
        if (await checkIfExists('escola', 'nome', nomeEscola)) {
          setMessage('Escola já cadastrada.');
          return;
        }
        const { error } = await supabase.from('escola').insert([{ nome: nomeEscola, codigo: codigoEscola }]);
        if (error) throw error;
        setMessage('Escola cadastrada com sucesso!');
      } else if (selectedTab === 'professor') {
        // Criação de usuário com email e senha
        const { user, error: authError } = await supabase.auth.signUp({
          email: emailProfessor,
          password: senhaProfessor,
        });
        
        if (authError) {
          setMessage(`Erro ao criar usuário: ${authError.message}`);
          return;
        }
        
        if (!user) {
          setMessage('Erro ao criar usuário. O usuário não foi retornado.');
          return;
        }
        
        setMessage('Usuário cadastrado com sucesso!');
      } else if (selectedTab === 'assuntos') {
        if (await checkIfExists('assuntos', 'nome', nomeAssunto)) {
          setMessage('Assunto já cadastrado.');
          return;
        }
        const { error: insertError } = await supabase.from('assuntos').insert([{ nome: nomeAssunto, disciplina_id: disciplinaSelecionada }]);
        if (insertError) throw insertError;
  
        // Chamar a função add_column_to_relatorio_1 ao salvar os dados
        const columnName = nomeAssunto.replace(/\s+/g, '_'); // Substituir espaços por underscore
        const { error: functionError } = await supabase.rpc('add_column_to_relatorio_1', { column_name: columnName });
        if (functionError) throw functionError;
  
        setMessage('Assunto e coluna cadastrados com sucesso!');
      }
  
      // Atualizar texto na tabela resumo_1
      if (selectedAssuntoId && selectedAlunoId) {
        const { error: updateError } = await supabase.from('resumo_1').upsert({
          aluno_id: selectedAlunoId,
          assunto_id: selectedAssuntoId,
          retorno: nomeAssunto
        });
        if (updateError) throw updateError;
      }
  
      clearFields();
    } catch (error) {
      setMessage(`Erro ao realizar cadastro: ${error.message}`);
    }
  };
  
  

  const clearFields = () => {
    setNomeEscola('');
    setCodigoEscola('');
    setEmailProfessor('');
    setSenhaProfessor('');
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
          </div>
        );
      case 'professor':
        return (
          <div className="form-group">
            <input
              type="email"
              placeholder="Email do Professor"
              value={emailProfessor}
              onChange={(e) => setEmailProfessor(e.target.value)}
            />
            <input
              type="password"
              placeholder="Senha"
              value={senhaProfessor}
              onChange={(e) => setSenhaProfessor(e.target.value)}
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
              <option value="">Selecione a Disciplina</option>
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

    <div className={darkMode ? 'container dark' : 'container'}>
      <div className="tabs">
        <button onClick={() => setSelectedTab('escola')}>Escola</button>
        <button onClick={() => setSelectedTab('professor')}>Professor</button>
        <button onClick={() => setSelectedTab('disciplina')}>Disciplina</button>
        <button onClick={() => setSelectedTab('assuntos')}>Assuntos</button>
      </div>
      {renderTabContent()}
      <button onClick={handleSave} disabled={isSaveDisabled}>
        Salvar
      </button>
      {message && <p>{message}</p>}
    </div>
    
  );
};

export default Cadastro;
