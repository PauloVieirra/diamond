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
  const [editingId, setEditingId] = useState(null);
  const [cursoSelecionado, setCursoSelecionado] = useState('');
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [searchQuery, setSearchQuery] = useState('');
  console.log(bimestreSelecionado);

  useEffect(() => {
    fetchAssuntos();
    fetchDisciplinas();
  }, [searchQuery]);

  const fetchAssuntos = async () => {
    // Buscar todos os assuntos
    const { data, error } = await supabase.from('assuntos').select('id, nome, disciplina_id, bimestre, curso');
    
    if (error) {
      showSnack(`Erro ao buscar assuntos: ${error.message}`, 'error');
      return;
    }
  
    // Filtrar os dados com base na pesquisa
    const filteredAssuntos = data.filter(assunto => {
      const nomeMatch = assunto.nome?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      const bimestreMatch = assunto.bimestre?.toString().includes(searchQuery) || false;
      const cursoMatch = assunto.curso?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      const disciplinaMatch = disciplinas.find(d => d.id === assunto.disciplina_id)?.nome?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    
      return nomeMatch || bimestreMatch || cursoMatch || disciplinaMatch;
    });
    
  
    setAssuntos(filteredAssuntos);
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
    // Verificar se o nome do assunto já está cadastrado
    if (await checkIfExists('assuntos', 'nome', nomeAssunto)) {
        showSnack('Assunto já cadastrado.', 'warning');
        return;
    }

    // Verificar se cada campo está preenchido e fornecer mensagens específicas
    if (!nomeAssunto) {
        showSnack('Por favor, preencha o nome do assunto.', 'warning');
        return;
    }

    if (!disciplinaSelecionada) {
        showSnack('Por favor, selecione uma disciplina.', 'warning');
        return;
    }

    if (!bimestreSelecionado) {
        showSnack('Por favor, selecione um bimestre.', 'warning');
        return;
    }

    if (!cursoSelecionado) {
        showSnack('Favor selecionar uma série.', 'warning');
        return;
    }

    if (editingId) {
        // Atualizar o assunto existente
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
        // Inserir um novo assunto
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
            return;
        }

        // Adicionar uma nova coluna na tabela relatorio_1
        const { error: columnError } = await supabase.rpc('add_column_if_not_exists', {
            p_table_name: `relatorio_${bimestreSelecionado}`, // Nome da tabela
            p_column_name: nomeAssunto, // Nome da coluna com a formatação exata
            p_column_type: 'TEXT' // Tipo de dado da nova coluna
        });

        if (columnError) {
            showSnack(`Erro ao adicionar coluna: ${columnError.message}`, 'error');
            return;
        }

        showSnack('Assunto cadastrado com sucesso e coluna adicionada!', 'success');
    }

    // Limpar os campos após o cadastro
    setNomeAssunto('');
    setDisciplinaSelecionada('');
    setBimestreSelecionado('');
    setCursoSelecionado('');
    fetchAssuntos();
};


  
  
  const handleEdit = async (id) => {
    // Verificar se o id do assunto está presente na coluna assunto_id da tabela resumo_1
    const { data, error: checkError } = await supabase
      .from(`resumo_${bimestreSelecionado}`)
      .select('assunto_id')
      .eq('assunto_id', id);
  
    if (checkError) {
      alert(`Erro ao verificar assunto: ${checkError.message}`);
      return;
    }
  
    // Se o assunto estiver em uso, mostrar mensagem e não permitir a edição
    if (data.length > 0) {
      alert('Não é possível editar este assunto, pois ele está em uso.');
      return;
    }
  
    // Se o assunto não estiver em uso, permitir a edição
    const assunto = assuntos.find((a) => a.id === id);
    if (assunto) {
      setNomeAssunto(assunto.nome);
      setDisciplinaSelecionada(assunto.disciplina_id);
      setBimestreSelecionado(assunto.bimestre);
      setCursoSelecionado(assunto.curso);
      setEditingId(id);
    } else {
      alert('Assunto não encontrado.');
    }
  };
  

  const handleDelete = async (id) => {
    // Verificar se o id do assunto está presente na coluna assunto_id da tabela resumo_1
    const { data, error: checkError } = await supabase
      .from('resumo_1')
      .select('assunto_id')
      .eq('assunto_id', id);
  
    if (checkError) {
      alert(`Erro ao verificar assunto: ${checkError.message}`);
      return;
    }
  
    // Se o assunto estiver em uso, mostrar mensagem e não permitir a exclusão
    if (data.length > 0) {
      alert('Não é possível excluir este assunto, pois ele está em uso em um relatório.');
      return;
    }
  
    // Se o assunto não estiver em uso, proceder com a exclusão
    const { error } = await supabase.from('assuntos').delete().eq('id', id);
    if (error) {
      alert(`Erro ao excluir assunto: ${error.message}`);
    } else {
      alert('Assunto excluído com sucesso!');
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
          
        </div><div>{snack.message}</div>
        <div><div>
        <input
              type="text"
              placeholder="Buscar por nome, série, bimestre, disciplina ou curso"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                fetchAssuntos();  // Atualizar a pesquisa sempre que o valor mudar
              }}
              style={{ width: '300px' }}
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
      <th>Série</th>
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
          <td>{assunto.curso ? assunto.curso : 'Não disponível'}</td> {/* Exibir uma mensagem padrão se curso não estiver definido */}
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
     
    </div>
    </main>
  );
};

export default Assuntos;
