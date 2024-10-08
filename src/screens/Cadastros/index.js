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
  const [selectedAssuntoId, setSelectedAssuntoId] = useState(null);
  const [selectedAlunoId, setSelectedAlunoId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [idSelecionado, setIdSelecionado] = useState(null);
  const [novoNome, setNovoNome] = useState('');
  const [editStates, setEditStates] = useState({});
  const [desempenho, setDesempenho] = useState('');
  const [tituloDesempenho, setTituloDesempenho] = useState('');
  const [textoDesempenho, setTextoDesempenho] = useState('');

  const handleEditClick = (item) => {
    setEditStates((prevEditStates) => ({ ...prevEditStates, [item.id]: true }));
  };

  const handleTouch = () => {
    setIsEdit((prevIsEdit) => !prevIsEdit);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (selectedTab === 'escola') await fetchEscolas();
      if (selectedTab === 'professor') await fetchProfessores();
      if (selectedTab === 'disciplina') await fetchDisciplinas();
      if (selectedTab === 'assuntos') {
        await fetchDisciplinas();
        await fetchAssuntos();
      }
      if (selectedTab === 'desempenho') await fetchDesempenhos();
    };
    fetchData();
  }, [selectedTab]);

  useEffect(() => {
    setIsSaveDisabled(
      !(selectedTab === 'escola' && nomeEscola && codigoEscola) &&
      !(selectedTab === 'professor' && emailProfessor && senhaProfessor) &&
      !(selectedTab === 'disciplina' && nomeDisciplina) &&
      !(selectedTab === 'assuntos' && nomeAssunto && disciplinaSelecionada) &&
      !(selectedTab === 'desempenho' && desempenho)
    );
  }, [nomeEscola, codigoEscola, emailProfessor, senhaProfessor, nomeDisciplina, nomeAssunto, disciplinaSelecionada, selectedTab, desempenho]);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, selectedTab]);

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

  const fetchDesempenhos = async () => {
    const { data, error } = await supabase.from(desempenho).select('id, text');
    if (error) {
      setMessage(`Erro ao buscar desempenhos: ${error.message}`);
    } else {
      setDesempenho(data);
      setSearchResults(data);
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
        const { user, error: authError } = await supabase.auth.signUp({
          email: emailProfessor,
          password: senhaProfessor,
        });
  
        if (authError) {
          setMessage(`Erro ao criar usuário: ${authError.message}`);
          return;
        }
  
        if (!user) {
          setMessage('Cadastro realizado.');
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
  
        const columnName = nomeAssunto.replace(/\s+/g, '_');
        const { error: functionError } = await supabase.rpc('add_column_to_relatorio_1', { column_name: columnName });
        if (functionError) throw functionError;
  
        setMessage('Assunto e coluna cadastrados com sucesso!');
      } else if (selectedTab === 'desempenho') {
        const tableName = desempenho;
        if (!tableName) {
          setMessage('Tabela de desempenho não reconhecida.');
          return;
        }
  
        // Assumindo que as tabelas de desempenho têm os campos 'title' e 'text'
        const { error } = await supabase.from(tableName).insert([{ titulo: tituloDesempenho, text: textoDesempenho }]);
        if (error) throw error;
  
        setTextoDesempenho(''); // Limpa o campo após salvar
        setTituloDesempenho(''); // Limpa o campo de título após salvar
        setMessage('Título e texto cadastrados com sucesso!');
      }
    } catch (error) {
      setMessage(`Erro ao salvar: ${error.message}`);
    }
  };
  

  const updateNameInTable = async (table, id, newName) => {
    const { error } = await supabase.from(table).update({ nome: newName }).eq('id', id);
    if (error) {
      setMessage(`Erro ao atualizar o nome: ${error.message}`);
      return false;
    }
    return true;
  };
  

  const handleSaveEdit = async (item) => {
    try {
      let tableName;
  
      switch (selectedTab) {
        case 'escola':
          tableName = 'escola';
          break;
        case 'disciplina':
          tableName = 'disciplinas';
          break;
        case 'assuntos':
          tableName = 'assuntos';
          break;
        default:
          throw new Error('Tab não reconhecida');
      }
  
      const success = await updateNameInTable(tableName, item.id, novoNome);
      if (success) {
        setMessage('Nome atualizado com sucesso!');
      }
  
      setEditStates((prevEditStates) => ({ ...prevEditStates, [item.id]: false }));
      clearFields(); // Limpa os campos após a atualização
    } catch (error) {
      setMessage(`Erro ao atualizar: ${error.message}`);
    }
  };
  

  const handleClean = (item) => {
    setNovoNome(''); // Limpa o campo de novo nome
    setEditStates((prevEditStates) => ({ ...prevEditStates, [item.id]: false }));
  };

  useEffect(() => {
    const channel = supabase
      .channel('custom-all-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'escola' }, () => {
        fetchEscolas();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'professores' }, () => {
        fetchProfessores();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'disciplinas' }, () => {
        fetchDisciplinas();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assuntos' }, () => {
        fetchAssuntos();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  

  const handleDeleteClick = async (item) => {
    const confirmed = window.confirm(`Você realmente deseja excluir ${item.name}?`);
    if (!confirmed) {
      return; // Se o usuário cancelar, a exclusão não ocorre.
    }
  
    try {
      if (!item.id) {
        setMessage('Selecione um item para excluir!');
        return;
      }
  
      let tableName, listSetter, list;
  
      // Determine a tabela e o setter de estado com base na aba selecionada
      if (selectedTab === 'escola') {
        tableName = 'escola';
        listSetter = setEscolas;
        list = escolas;
      } else if (selectedTab === 'disciplina') {
        tableName = 'disciplinas';
        listSetter = setDisciplinas;
        list = disciplinas;
      } else if (selectedTab === 'assuntos') {
        tableName = 'assuntos';
        listSetter = setAssuntos;
        list = assuntos;
      }
  
      const { error } = await supabase.from(tableName).delete().eq('id', item.id);
      if (error) throw error;
  
      setMessage(`${selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} excluído(a) com sucesso!`);
  
      // Atualiza a lista removendo o item excluído
      const updatedList = list.filter((listItem) => listItem.id !== item.id);
      listSetter(updatedList);
  
      // Resetando estado após exclusão
      setIsEdit(false);
      setIdSelecionado(null);
  
    } catch (error) {
      setMessage(`Erro ao excluir: ${error.message}`);
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
             <button className='btnedit' onClick={handleSave} disabled={isSaveDisabled}>Salvar</button>
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
              placeholder="Senha do Professor"
              value={senhaProfessor}
              onChange={(e) => setSenhaProfessor(e.target.value)}
            />
             <button className='btnedit' onClick={handleSave} disabled={isSaveDisabled}>Salvar</button>
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
            <div className='lineTop'>
            <button className='btnedit' onClick={handleSave} disabled={isSaveDisabled}>Salvar</button>
            </div>
           
          </div>
        );
        case 'desempenho':
          return (
            <div className="form-group">
              <div style={{display:'flex'}}>
                <div style={{display:'flex',width:'100px', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                  <input
                    type="radio"
                    name="desempenho"
                    value="retornopositivo"
                    checked={desempenho === 'retornopositivo'}
                    onChange={(e) => setDesempenho(e.target.value)}
                    style={{width:'20px'}}
                  />
                  <label>Bom</label>
                </div>
                <div style={{display:'flex',width:'100px', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                  <input
                    type="radio"
                    name="desempenho"
                    value="retornomoderado"
                    checked={desempenho === 'retornomoderado'}
                    onChange={(e) => setDesempenho(e.target.value)}
                    style={{width:'20px'}}
                  />
                  <label>Mediano</label>
                </div>
                <div style={{display:'flex',width:'100px', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                  <input
                    type="radio"
                    name="desempenho"
                    value="retornonegativo"
                    checked={desempenho === 'retornonegativo'}
                    onChange={(e) => setDesempenho(e.target.value)}
                    style={{width:'20px'}}
                  />
                  <label>Ruim</label>
                </div>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Título"
                  value={tituloDesempenho}
                  onChange={(e) => setTituloDesempenho(e.target.value)}
                />
              </div>
              <textarea
                type="text"
                placeholder="Escreva o texto aqui"
                value={textoDesempenho}
                onChange={(e) => setTextoDesempenho(e.target.value)}
                style={{width:'420px', height:'200px'}}
              />
              <div className='lineTop'>
                <button className='btnedit' onClick={handleSave} disabled={isSaveDisabled}>Salvar</button>
              </div>
              <div>
        
      </div>
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
              {disciplinas.map(disciplina => (
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

           <button className='btnedit' onClick={handleSave} disabled={isSaveDisabled}>Salvar</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={darkMode ? 'dark-mode' : 'light-mode'}>
      <div className="tabs">
        <button onClick={() => setSelectedTab('escola')}>Escola</button>
        <button onClick={() => setSelectedTab('professor')}>Professor</button>
        <button onClick={() => setSelectedTab('disciplina')}>Disciplina</button>
        <button onClick={() => setSelectedTab('assuntos')}>Assuntos</button>
        <button onClick={() => setSelectedTab('desempenho')}>Desempenho</button>
      </div>

      <div className="search-container">
      {renderTabContent()}
        <input
          type="text"
          placeholder={`Pesquisar ${selectedTab}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="search-results">
      {Array.isArray(searchResults) && searchResults.map((item) => (
  <li className='card-item' key={item.id}>
    {item.nome || item.email || item.codigo}
    {editStates[item.id] ? (
      <div className='lin'>
        <div className='inputcont'>
        <input
          type="text"
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
          placeholder="Novo nome"
         style={{display:'flex',width:"80%", height:'42px'}}
        />
        </div>
        <div> 
        <button className='btnedit' style={{backgroundColor:"#FF6875"}} onClick={() => handleDeleteClick(item)}>Excluir</button>
        <button className='btnedit' style={{backgroundColor:"#FFA502"}} onClick={() => handleClean(item)}>Cancelar</button>
        <button className='btnedit' style={{backgroundColor:"#1ABC9C"}} onClick={() => handleSaveEdit(item)}>Salvar</button>
        </div>
      </div>
    ) : (
     <button className='btnedit' onClick={() => handleEditClick(item)}>
        Editar
      </button>
    )}
  </li>
))}
      </div>
    
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default Cadastro;
