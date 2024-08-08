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
  const [istea, setIstea] = useState(false); // Campo booleano
const [faltas, setFaltas] = useState(""); // Campo texto


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
      setIstea(alunoData.istea); // Define o valor inicial de istea
      setFaltas(alunoData.faltas); // Define o valor inicial de faltas

      const { data: disciplinasData, error: disciplinasError } = await supabase
        .from("disciplinas")
        .select("*");

      if (disciplinasError) throw disciplinasError;

      setDisciplinas(disciplinasData);

      const { data: bimestreData, error: bimestreError } = await supabase
        .from("bimestre_1")
        .select("*")
        .eq("aluno_id", id)
        .single();

      if (bimestreError && bimestreError.code !== 'PGRST116') {
        console.error(bimestreError);
        return;
      }

      setBimestres(bimestreData || {});

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
        const rendimento = bimestres[assunto.nome]; // Adicionado essa linha para capturar o valor do radio button
  
        if (!selectedCard) continue;
  
        // Inserir ou atualizar os dados na tabela relatorio_1
        const relatorioData = {
          aluno_id: id,
          disciplina_id: disciplina.id,
          resumo: resumo,
          rendimento: rendimento, // Adicionado essa linha para incluir o valor do radio button na coluna 'rendimento'
          [assunto.nome]: selectedCard.text // Nome da coluna dinamicamente como nome do assunto
        };
  
        // Primeiro, buscar a linha existente para o aluno
        const { data: existingData, error: fetchError } = await supabase
          .from("relatorio_1")
          .select("*")
          .eq("aluno_id", id)
          .single();
  
        if (fetchError && fetchError.code !== "PGRST116") {
          console.error("Erro ao buscar dados existentes em relatorio_1", fetchError);
          return;
        }
  
        // Atualizar a linha existente ou criar uma nova
        const { error: relatorioError } = existingData
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
    <main >
      <h2>Responder RAV</h2>
      <div className="form-group">
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
        <label>Estudante PCD</label>
        <input
          type="checkbox"
          checked={istea}
          onChange={(e) => setIstea(e.target.checked)}
          style={{width:"100px", height:"28px"}}
        />
      </div>
      <div className="form-faltas">
      <label>Faltas</label>
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
                </Tabs>
              </TabPanel>
            ))}
          </Tabs>
        </TabPanel>
      </Tabs>
      <div className="form-group">
        <button onClick={handleUpdate}>Salvar</button>
      </div>
    </main>
  );
}
