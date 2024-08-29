import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import supabase from "../../servers/SupabaseConect";
import './style.css';

export default function Ravgerador() {
  const { id } = useParams();
  const [publi, setPubli] = useState(null);
  const [name, setName] = useState("");
  const [serie, setSerie] = useState("");
  const [disciplinas, setDisciplinas] = useState([]);
  const [assuntos, setAssuntos] = useState({});
  const [bimestres, setBimestres] = useState({});
  const [texts, setTexts] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCards, setSelectedCards] = useState({});
  const [annotations, setAnnotations] = useState({});
  const [istea, setIstea] = useState(false); 
  const [turno, setTurno] = useState("");
  const [turma, setTurma] = useState("");
  const [curso, setCurso] = useState(""); 
  const [faltas, setFaltas] = useState(""); 
  const [adequacao, setAdequacao] = useState(false); 
  const [temporalidade, setTemporalidade] = useState(false); 
  const [saladerecursos, setSaladerecursos ] = useState (false);
  const [superacao, setSuperacao ] = useState (false);
  const [superacaomodelo, setSuperacaomodelo ] = useState (" ");
  const [superacaodefinicao, setSuperacaodefinicao] = useState("");
  const [aplicacao, setAplicacao] = useState(false);
  const [options, setOptions] = useState([]); // Definindo o estado options
  const [selectedDisciplina, setSelectedDisciplina] = useState(null);
  const [selectedAssunto, setSelectedAssunto] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]); 
  const [selectedRendimento, setSelectedRendimento] = useState(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
const [selectedSubject, setSelectedSubject] = useState(null);
console.log(selectedSubject);
  
 // Fetch de dados
 useEffect(() => {
  const fetchPubli = async () => {
    try {
      const { data: alunoData, error: alunoError } = await supabase
        .from("alunos")
        .select("*")
        .eq("id", id)
        .single();

      if (alunoError) throw alunoError;

      setPubli(alunoData);
      setName(alunoData.name);
      setSerie(alunoData.serie);
      setIstea(alunoData.istea); 
      setFaltas(alunoData.faltas);
      setTurno(alunoData.Turno);
      setCurso(alunoData.Curso);
      setTurma(alunoData.Turma);
      setAplicacao(alunoData.aplicacao);
      setAdequacao(alunoData.adequacao);
      setTemporalidade(alunoData.temporalidade)
      setSaladerecursos(alunoData.saladerecursos);
      setSuperacao(alunoData.superacao);
      setSuperacaomodelo(alunoData.superacaomodelo);
      setSuperacaodefinicao(alunoData.superacaodefinicao);
      
      const { data: disciplinasData, error: disciplinasError } = await supabase
        .from("disciplinas")
        .select("*");

      if (disciplinasError) throw disciplinasError;

      setDisciplinas(disciplinasData);

      const { data: assuntosData, error: assuntosError } = await supabase
        .from("assuntos")
        .select("*");

      if (assuntosError) throw assuntosError;

      const assuntosMap = disciplinasData.reduce((acc, disciplina) => {
        acc[disciplina.id] = assuntosData.filter(
          assunto => assunto.disciplina_id === disciplina.id
        );
        return acc;
      }, {});

      setAssuntos(assuntosMap);

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  fetchPubli();
}, [id]);

useEffect(() => {
  if (selectedDisciplina && selectedAssunto) {
    const filtered = assuntos[selectedDisciplina]?.filter(
      (assunto) => assunto.id === selectedAssunto
    );
    setFilteredItems(filtered);
  } else {
    setFilteredItems([]);
  }
}, [selectedDisciplina, selectedAssunto]);



useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch Disciplinas
        const { data: disciplinasData, error: disciplinasError } = await supabase
          .from("disciplinas")
          .select("*");
        if (disciplinasError) throw disciplinasError;

        setDisciplinas(disciplinasData);

        // Fetch Assuntos
        const { data: assuntosData, error: assuntosError } = await supabase
          .from("assuntos")
          .select("*");
        if (assuntosError) throw assuntosError;

        const assuntosMap = disciplinasData.reduce((acc, disciplina) => {
          acc[disciplina.id] = assuntosData.filter(
            assunto => assunto.disciplina_id === disciplina.id
          );
          return acc;
        }, {});

        setAssuntos(assuntosMap);
      } catch (error) {
        console.error('Erro ao buscar dados iniciais:', error);
      }
    };

    fetchInitialData();
  }, [id, activeTab]);

   // Função para filtrar itens com base nas seleções de disciplina, assunto e rendimento
useEffect(() => {
  const fetchFilteredItems = async () => {
    if (selectedDisciplina && selectedAssunto && selectedRendimento) {
      try {
        const { data: filteredData, error } = await supabase
          .from("relatorio_1")
          .select("*")
          .eq("disciplina_id", selectedDisciplina) // Filtrando pelo id da disciplina
          .eq("assunto_id", selectedAssunto)      // Filtrando pelo id do assunto
          .eq("rendimento", selectedRendimento);  // Filtrando pelo rendimento selecionado

        if (error) {
          console.error("Erro ao buscar itens filtrados", error);
        } else {
          setFilteredItems(filteredData);
        }
      } catch (error) {
        console.error("Erro ao buscar itens filtrados", error);
      }
    } else {
      setFilteredItems([]); // Limpa a lista quando a condição de filtragem não é atendida
    }
  };

  fetchFilteredItems();
}, [selectedDisciplina, selectedAssunto, selectedRendimento]);



  const handleCheckboxChange = async (assunto, value) => {
    const label = getCheckboxLabel(value);
    setBimestres(prevBimestres => ({
      ...prevBimestres,
      [assunto]: label
    }));

    let tableName;
    switch (label) {
      case "Ruim":
        tableName = "retornonegativo";
        break;
      case "Mediano":
        tableName = "retornomoderado";
        break;
      case "Bom":
        tableName = "retornopositivo";
        break;
      default:
        return;
    }

    const { data: textsData, error } = await supabase
      .from(tableName)
      .select("*");

    if (error) {
      console.error(`Erro ao buscar textos de ${tableName}`, error);
      return;
    }

    setTexts(prevTexts => ({
      ...prevTexts,
      [assunto]: textsData
    }));

  };

  useEffect(() => {
    // Defina as opções para o campo de seleção
    setOptions([
      "Classe comum com atendimento personalizado.",
      "Turma SuperAção.",
      "Turma SuperAção Reduzida."
    ]);
  }, []);

  const iEducarArray = [
    "Classe comum com atendimento personalizado.",
    "Turma SuperAção.",
    "Turma SuperAção Reduzida."
  ];

  const handleTextChange = (e) => {
    setSuperacaomodelo(e.target.value);
  };
  
  const getCheckboxLabel = (value) => {
    switch (value) {
      case "1":
        return "Ruim";
      case "2":
        return "Mediano";
      case "3":
        return "Bom";
      default:
        return "";
    }
  };

  const getCheckboxValue = (label) => {
    switch (label) {
      case "Ruim":
        return "1";
      case "Mediano":
        return "2";
      case "Bom":
        return "3";
      default:
        return "";
    }
  };

  const calculateResponsePercentage = () => {
    const totalDisciplinas = disciplinas.length;
    const disciplinasRespondidas = disciplinas.filter(disciplina => bimestres[disciplina.nome]).length;
    return (disciplinasRespondidas / totalDisciplinas) * 100;
  };

  const handleCardSelect = (assunto, title, text) => {
    setSelectedCards(prevSelectedCards => ({
      ...prevSelectedCards,
      [assunto]: { title, text }
    }));
  };

  const handleAnnotationChange = (assunto, value) => {
    setAnnotations(prevAnnotations => ({
      ...prevAnnotations,
      [assunto]: value
    }));
  };

  const saveResumoData = async () => {
    for (const disciplina of disciplinas) {
      for (const assunto of assuntos[disciplina.id] || []) {
        const selectedCard = selectedCards[assunto.nome];
        const resumo = annotations[assunto.nome] || "";
        const rendimento = bimestres[assunto.nome]; // Valor do radio button
  
        if (!selectedCard && !resumo && !rendimento) continue; // Ignorar se todos os campos estiverem vazios
  
        // Verificar se já existe uma entrada para este aluno e assunto
        const { data: existingResumo, error: fetchResumoError } = await supabase
          .from("resumo_1")
          .select("*")
          .eq("aluno_id", id)
          .eq("assunto_id", assunto.id)
          .single();
  
        if (fetchResumoError && fetchResumoError.code !== "PGRST116") {
          console.error("Erro ao buscar dados existentes em resumo_1", fetchResumoError);
          return;
        }
  
        // Preparar os dados para inserção ou atualização
        const resumoData = {
          aluno_id: id,
          disciplina_id: disciplina.id,
          assunto_id: assunto.id,
          rendimento: rendimento || existingResumo?.rendimento || null, 
          avaliacao: resumo || existingResumo?.avaliacao || null,
          retorno: selectedCard?.text || existingResumo?.retorno || null // Adicionar o campo retorno
        };
  
        let resumoError;
        if (existingResumo) {
          // Atualizar a entrada existente
          const { error: updateResumoError } = await supabase
            .from("resumo_1")
            .update(resumoData)
            .eq("aluno_id", id)
            .eq("assunto_id", assunto.id);
          resumoError = updateResumoError;
        } else {
          // Inserir uma nova entrada
          const { error: insertResumoError } = await supabase
            .from("resumo_1")
            .insert([resumoData]);
          resumoError = insertResumoError;
        }
  
        if (resumoError) {
          console.error("Erro ao salvar na tabela resumo_1", resumoError);
        }
  
        // Inserir ou atualizar os dados na tabela relatorio_1
        const relatorioData = {
          aluno_id: id,
          disciplina_id: disciplina.id,
          resumo: resumo || existingResumo?.avaliacao || null, // Manter dados existentes se o campo for vazio
          [assunto.nome]: selectedCard?.text || existingResumo?.[assunto.nome] || null // Evitar sobreposição de dados se o campo estiver vazio
        };
  
        // Primeiro, buscar a linha existente para o aluno
        const { data: existingRelatorio, error: fetchRelatorioError } = await supabase
          .from("relatorio_1")
          .select("*")
          .eq("aluno_id", id)
          .single();
  
        if (fetchRelatorioError && fetchRelatorioError.code !== "PGRST116") {
          console.error("Erro ao buscar dados existentes em relatorio_1", fetchRelatorioError);
          return;
        }
  
        // Atualizar a linha existente ou criar uma nova
        const { error: relatorioError } = existingRelatorio
          ? await supabase
              .from("relatorio_1")
              .update(relatorioData)
              .eq("aluno_id", id)
          : await supabase
              .from("relatorio_1")
              .insert([relatorioData]);
  
        if (relatorioError) {
          console.error("Erro ao salvar relatorio_1", relatorioError);
        }
      }
    }
  };
  
  const handleUpdate = async () => {
    // Preparar dados para a tabela alunos
    const alunoData = {
      istea,
      faltas,
      name,
      serie,
      Turma: turma,
      Curso: curso,
      aplicacao,
      adequacao,
      temporalidade,
      saladerecursos,
      superacao,
      superacaomodelo,
      superacaodefinicao,
    
    };
  
    // Atualizar os dados do aluno na tabela alunos
    const { error: alunoError } = await supabase
      .from("alunos")
      .update(alunoData)
      .eq("id", id);
  
    if (alunoError) {
      console.error("Erro ao atualizar os dados do aluno", alunoError);
      return;
    }
  
    // Preparar dados para a tabela bimestre_1
    const bimestreData = {
      aluno_id: id,
      aluno_name: name,
      percentual: calculateResponsePercentage(),
      ...Object.fromEntries(
        disciplinas.map(disciplina => [
          disciplina.nome, // Nome da disciplina
          bimestres[disciplina.nome] || "" // Valor da avaliação (Ruim, Mediano, Bom) ou vazio
        ])
      )
    };
  
    // Salvar dados na tabela bimestre_1
    const { error: bimestreError } = await supabase
      .from("bimestre_1")
      .upsert(bimestreData);
  
    if (bimestreError) {
      console.error("Erro ao salvar bimestre_1", bimestreError);
      return;
    }
  
    // Salvar os dados dos cards selecionados na tabela relatorio_1
    await saveResumoData();
  
    alert("Dados atualizados com sucesso!");
  };
  
  if (!publi) return <div>Carregando...</div>;

  return (
    <main>
      <div className="containermain">
        <div className="containermain__header">
           <h2>Responder RAV</h2>
        </div>
      <div className="cont-name">
        <label>Nome</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
      <div className="form-update">
      <div className="form-pcd">
      <div style={{display:'flex', alignItems:'center',width:"auto", height:"48px"}}>Estudante PCD </div>
        <input
          type="checkbox"
          checked={istea}
          onChange={(e) => setIstea(e.target.checked)}
          style={{width:"100px", height:"28px"}}
        />
         <div style={{display:'flex', alignItems:'center',width:"auto", height:"48px"}}>Adequacao curricular </div>
        <input
          type="checkbox"
          checked={adequacao}
          onChange={(e) => setAdequacao(e.target.checked)}
          style={{width:"100px", height:"28px"}}
        />
         <div style={{display:'flex', alignItems:'center',width:"auto", height:"48px"}}>Indicado para temporalidade </div>
        <input
          type="checkbox"
          checked={temporalidade}
          onChange={(e) => setTemporalidade(e.target.checked)}
          style={{width:"100px", height:"28px"}}
        />
         <div style={{display:'flex', alignItems:'center',width:"auto", height:"48px"}}>Sala de recursos </div>
        <input
          type="checkbox"
          checked={saladerecursos}
          onChange={(e) => setSaladerecursos(e.target.checked)}
          style={{width:"100px", height:"28px"}}
        />
          <div style={{display:'flex', alignItems:'center',width:"auto", height:"48px"}}>Aplicação Curricular Programa SuperAção </div>
        <input
          type="checkbox"
          checked={aplicacao}
          onChange={(e) => setAplicacao(e.target.checked)}
          style={{width:"100px", height:"28px"}}
        />
         <div style={{display:'flex', alignItems:'center',width:"auto", height:"48px"}}>SuperAção - iEducar </div>
        <input
          type="checkbox"
          checked={superacao}
          onChange={(e) => setSuperacao(e.target.checked)}
          style={{width:"100px", height:"28px"}}
        />
        
        {superacao && (
          <div style={{ display: 'flex', alignItems: 'center', width: 'auto', height: '48px' }}>
            SuperAção/Modelo
            <select
              value={superacaomodelo}
              onChange={handleTextChange}
              style={{ width: '200px', height: '28px', marginLeft: '10px' }}
            >
              <option value="" disabled>Selecione uma frase</option>
              {options.map((frase, index) => (
                <option key={index} value={frase}>
                  {frase}
                </option>
              ))}
            </select>
          </div>
        )}

       
       
      </div>

      <div className="line">
      <div style={{display:'flex', alignItems:'center',width:"100px", height:"48px"}}>Turno</div>
        <input
          type="text"
          value={turno}
          onChange={(e) => setTurno(e.target.value)}
          style={{width:"100px", height:"28px"}}
        />
          <div style={{display:'flex', alignItems:'center',width:"100px", height:"48px"}}>Serie</div>
        <input
          type="text"
          value={curso}
          onChange={(e) => setCurso(e.target.value)}
          style={{width:"100px", height:"28px"}}
        />
        <div style={{display:'flex', alignItems:'center',width:"100px", height:"48px"}}>Turma</div>
        <input
          type="text"
          value={turma}
          onChange={(e) => setTurma(e.target.value)}
          style={{width:"100px", height:"28px"}}
        />
          <div style={{display:'flex', alignItems:'center',width:"100px", height:"48px"}}>Faltas</div>
        <input
          type="text"
          value={faltas}
          onChange={(e) => setFaltas(e.target.value)}
          style={{width:"100px", height:"28px"}}
        />
      </div>
      </div>
      </div>
      <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)} className="tab">
        <TabList>
          <Tab>Bimestre 1</Tab>
        </TabList>
        <TabPanel>
          <Tabs>
            <TabList>
              {disciplinas.map((disciplina, index) => (
                <Tab key={index}>{disciplina.nome}</Tab>
              ))}
            </TabList>

            {disciplinas.map((disciplina, index) => (
              <TabPanel key={index}>
                <Tabs>
                  <TabList>
                    {assuntos[disciplina.id]?.map((assunto, assuntoIndex) => (
                      <Tab key={assuntoIndex}>{assunto.nome}</Tab>
                    ))}
                  </TabList>

                  {assuntos[disciplina.id]?.map((assunto, assuntoIndex) => (
                    <TabPanel key={assuntoIndex}>
                      <div className="form-group">
                        <label>Avaliação </label>
                        <div className="checkbox-group">
                          {[1, 2, 3].map((level) => (
                            <label key={level}>
                              <input
                                type="radio"
                                name={`assunto-${assuntoIndex}`}
                                value={level}
                                checked={getCheckboxValue(bimestres[assunto.nome]) === level.toString()}
                                onChange={(e) => handleCheckboxChange(assunto.nome, e.target.value)}
                              />
                              {getCheckboxLabel(level.toString())}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      {texts[assunto.nome] && (
                        <div className="text-cards">
                          <div className="linetitle">Selecione uma opção abaixo</div>
                          {texts[assunto.nome].map((text, textIndex) => (
                            <div 
                              key={textIndex} 
                              className={`text-card ${selectedCards[assunto.nome]?.text === text.text ? 'selected' : ''}`} 
                              onClick={() => handleCardSelect(assunto.nome, text.title, text.text)}
                            >
                              <h3>{text.titulo}</h3>
                              <p>{text.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                        <div className="textarea-container">
                          <div className="linetitle">Anotação adicional</div>
                          <textarea className="textarea" placeholder="Digite aqui..." 
                          value={annotations[assunto.nome] || ""}
                          onChange={(e) => handleAnnotationChange(assunto.nome, e.target.value)} />
                        </div>
                        
                    </TabPanel>
                  ))}
                   {filteredItems?.map((item) => (
      <div key={item.id}>
        {/* Render the item details */}
      </div>
    ))}
                </Tabs>
              </TabPanel>
            ))}
           
          </Tabs>
        </TabPanel>
      </Tabs>
      <div className="form-group">
        <button onClick={handleUpdate}>Salvar</button>
      </div>
      </div>
      
    </main>
  );
}
