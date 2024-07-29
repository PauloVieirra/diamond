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
  const [bimestres, setBimestres] = useState([
    { matematica: "", portugues: "" },
  ]);
  const [activeTab, setActiveTab] = useState(0);

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
  
        const { data: bimestreData, error: bimestreError } = await supabase
          .from("bimestre_1")
          .select("*")
          .eq("aluno_id", id)
          .single();
  
        if (bimestreError) {
          console.error(bimestreError);
          return;
        }
  
        setBimestres([
          {
            matematica: bimestreData.matematica || "",
            portugues: bimestreData.portugues || "",
          },
        ]);
  
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
  
    fetchPubli();
  }, [id]);

  const handleCheckboxChange = (materia, value) => {
    const newBimestres = [...bimestres];
    newBimestres[0][materia] = getCheckboxLabel(value);
    setBimestres(newBimestres);
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
    const totalDisciplinas = 2; // Número total de disciplinas
    const disciplinasRespondidas = (bimestres[0].matematica || bimestres[0].portugues) ? 1 : 0;
    return (disciplinasRespondidas / totalDisciplinas) * 100;
  };

  const handleUpdate = async () => {
    const bimestreData = {
      aluno_id: id,
      aluno_name: name,
      matematica: bimestres[activeTab].matematica,
      portugues: bimestres[activeTab].portugues,
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
      <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
        <TabList>
          <Tab>Bimestre 1</Tab>
        </TabList>

        {bimestres.map((bimestre, index) => (
          <TabPanel key={index}>
            <h3>Bimestre {index + 1}</h3>
            <div className="form-group">
              <label>Matemática</label>
              <div className="checkbox-group">
                {[1, 2, 3].map((level) => (
                  <label key={level}>
                    <input
                      type="radio"
                      name={`matematica-${index}`}
                      value={level}
                      checked={getCheckboxValue(bimestre.matematica) === level.toString()}
                      onChange={(e) => handleCheckboxChange("matematica", e.target.value)}
                    />
                    {getCheckboxLabel(level.toString())}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Português</label>
              <div className="checkbox-group">
                {[1, 2, 3].map((level) => (
                  <label key={level}>
                    <input
                      type="radio"
                      name={`portugues-${index}`}
                      value={level}
                      checked={getCheckboxValue(bimestre.portugues) === level.toString()}
                      onChange={(e) => handleCheckboxChange("portugues", e.target.value)}
                    />
                    {getCheckboxLabel(level.toString())}
                  </label>
                ))}
              </div>
            </div>
          </TabPanel>
        ))}
      </Tabs>
      <button onClick={handleUpdate}>Salvar</button>
      <div className="percentage-display">
        Percentual: {calculateResponsePercentage().toFixed(2)}%
      </div>
    </div>
  );
}
