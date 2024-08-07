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
  const [bimestres, setBimestres] = useState({});
  const [texts, setTexts] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCard, setSelectedCard] = useState({ title: "", text: "" });

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

        if (bimestreError) {
          console.error(bimestreError);
          return;
        }

        setBimestres(bimestreData);

      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchPubli();
  }, [id]);

  const handleCheckboxChange = async (disciplina, value) => {
    const label = getCheckboxLabel(value);
    setBimestres(prevBimestres => ({
      ...prevBimestres,
      [disciplina]: label
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
      [disciplina]: textsData
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

  const handleCardSelect = (title, text) => {
    setSelectedCard({ title, text });
  };

  const handleUpdate = async () => {
    const bimestreData = {
      aluno_id: id,
      aluno_name: name,
      ...bimestres,
      resumotitle: selectedCard.title,
      resumotext: selectedCard.text,
      percentual: calculateResponsePercentage(),
    };

    const { error } = await supabase
      .from("bimestre_1")
      .upsert(bimestreData);

    if (error) {
      console.error("Erro ao salvar bimestre_1", error);
      return;
    }

    alert("Dados atualizados com sucesso!");
  };

  if (!publi) return <div>Carregando...</div>;

  return (
    <div className="edit-container">
      <h2>Editar Publicação</h2>
      <div className="form-group">
        <label>Nome</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Série</label>
        <input
          type="text"
          value={serie}
          onChange={(e) => setSerie(e.target.value)}
        />
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
                <div className="form-group">
                  <label>{disciplina.nome}</label>
                  <div className="checkbox-group">
                    {[1, 2, 3].map((level) => (
                      <label key={level}>
                        <input
                          type="radio"
                          name={`disciplina-${index}`}
                          value={level}
                          checked={getCheckboxValue(bimestres[disciplina.nome]) === level.toString()}
                          onChange={(e) => handleCheckboxChange(disciplina.nome, e.target.value)}
                        />
                        {getCheckboxLabel(level.toString())}
                      </label>
                    ))}
                  </div>
                </div>
                {texts[disciplina.nome] && (
                  <div className="text-cards">
                    {texts[disciplina.nome].map((text, textIndex) => (
                      <div key={textIndex} className="text-card">
                        <div style={{display:'flex', flexDirection:'row-reverse', justifyContent:'flex-end', alignItems:'center', gap:'10px'}}>Selecionar
                        <input
                          type="radio"
                          name={`text-${disciplina.nome}`}
                          onChange={() => handleCardSelect(text.titulo, text.text)}
                        />
                        </div>
                        <h3>{text.titulo}</h3>
                        <p>{text.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </TabPanel>
            ))}
          </Tabs>
        </TabPanel>
      </Tabs>
      <button onClick={handleUpdate}>Salvar</button>
      <div className="percentage-display">
        Percentual: {calculateResponsePercentage().toFixed(2)}%
      </div>
    </div>
  );
}
