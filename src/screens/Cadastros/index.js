import React, { useState, useEffect } from 'react';
import supabase from '../../servers/SupabaseConect';
import './styles.css';

const Cadastro = () => {
  const [selectedOption, setSelectedOption] = useState('escola');
  const [nomeEscola, setNomeEscola] = useState('');
  const [codigoEscola, setCodigoEscola] = useState('');
  const [nomeProfessor, setNomeProfessor] = useState('');
  const [emailProfessor, setEmailProfessor] = useState('');
  const [nomeDisciplina, setNomeDisciplina] = useState('');
  const [assuntos, setAssuntos] = useState(['']);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMessage('');
  }, [selectedOption]);

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleAddAssunto = () => {
    setAssuntos([...assuntos, '']);
  };

  const handleAssuntoChange = (index, value) => {
    const newAssuntos = [...assuntos];
    newAssuntos[index] = value;
    setAssuntos(newAssuntos);
  };

  const handleSave = async () => {
    try {
      if (selectedOption === 'disciplina') {
        // Verificar se a disciplina já existe
        const { data: existingDisciplina, error: disciplinaError } = await supabase
          .from('disciplinas')
          .select('id')
          .eq('nome', nomeDisciplina);

        if (disciplinaError) throw new Error(disciplinaError.message);

        if (existingDisciplina.length > 0) {
          // Atualizar assuntos para disciplina existente
          await updateDisciplinaAssuntos(nomeDisciplina, assuntos);
        } else {
          // Adicionar nova disciplina
          await addNewDisciplina(nomeDisciplina, assuntos);
        }
        setMessage('Cadastro realizado com sucesso!');
        clearFields();
      } else if (selectedOption === 'escola') {
        const { data, error } = await supabase.from('escola').insert([
          { nome: nomeEscola, codigo: codigoEscola }
        ]);
        if (error) throw new Error(error.message);
        setMessage('Cadastro realizado com sucesso!');
        clearFields();
      } else if (selectedOption === 'professor') {
        const { data, error } = await supabase.from('professores').insert([
          { nome: nomeProfessor, email: emailProfessor }
        ]);
        if (error) throw new Error(error.message);
        setMessage('Cadastro realizado com sucesso!');
        clearFields();
      }
    } catch (error) {
      setMessage(`Erro ao realizar cadastro: ${error.message}`);
    }
  };

  const updateDisciplinaAssuntos = async (disciplinaNome, assuntos) => {
    // Verificar e adicionar novas colunas, se necessário
    await updateDisciplinaTable(assuntos.length);

    // Atualizar os assuntos na disciplina existente
    const disciplinaData = {};
    assuntos.forEach((assunto, index) => {
      disciplinaData[`assunto${index + 1}`] = assunto;
    });

    const { data, error } = await supabase
      .from('disciplinas')
      .update(disciplinaData)
      .eq('nome', disciplinaNome);

    if (error) throw new Error(error.message);
  };

  const addNewDisciplina = async (disciplinaNome, assuntos) => {
    // Atualizar a tabela para novas colunas
    await updateDisciplinaTable(assuntos.length);

    // Inserir nova disciplina com os assuntos
    const disciplinaData = { nome: disciplinaNome };
    assuntos.forEach((assunto, index) => {
      disciplinaData[`assunto${index + 1}`] = assunto;
    });

    const { data, error } = await supabase.from('disciplinas').insert([disciplinaData]);

    if (error) throw new Error(error.message);
  };

  const updateDisciplinaTable = async (numberOfAssuntos) => {
    const columns = Array.from({ length: numberOfAssuntos }, (_, i) => `assunto${i + 1}`);
    const { error } = await supabase.rpc('update_disciplina_table', { columns });

    if (error) {
      console.error('Erro ao atualizar tabela de disciplinas:', error.message);
      throw new Error(error.message);
    }
  };

  const clearFields = () => {
    setNomeEscola('');
    setCodigoEscola('');
    setNomeProfessor('');
    setEmailProfessor('');
    setNomeDisciplina('');
    setAssuntos(['']);
  };

  return (
    <div className="container">
      <h1>Cadastro</h1>
      <div className="box">
        <select onChange={handleSelectChange} value={selectedOption}>
          <option value="escola">Escola</option>
          <option value="professor">Professor</option>
          <option value="disciplina">Disciplina</option>
        </select>

        {selectedOption === 'escola' && (
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
        )}

        {selectedOption === 'professor' && (
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
        )}

        {selectedOption === 'disciplina' && (
          <div className="form-group">
            <input
              type="text"
              placeholder="Nome da Disciplina"
              value={nomeDisciplina}
              onChange={(e) => setNomeDisciplina(e.target.value)}
            />
            {assuntos.map((assunto, index) => (
              <div key={index} className="assunto-group">
                <input
                  type="text"
                  placeholder={`Assunto ${index + 1}`}
                  value={assunto}
                  onChange={(e) => handleAssuntoChange(index, e.target.value)}
                />
              </div>
            ))}
            <button onClick={handleAddAssunto} className="add-assunto-button">Adicionar Novo Assunto</button>
          </div>
        )}

        <button onClick={handleSave} className="save-button">Salvar</button>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Cadastro;
