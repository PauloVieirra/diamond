import React, { useState, useEffect, useContext } from "react";
import supabase from "../../servers/SupabaseConect";
import { StyleContext } from "../../context/StyleContext";
import "./styles.css";

const Desempenho = () => {
  const { darkMode } = useContext(StyleContext);
  const [desempenho, setDesempenho] = useState("");
  const [titulo, setTitulo] = useState("");
  const [disciplinas, setDisciplinas] = useState([]);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState("");
  const [assuntos, setAssuntos] = useState([]);
  const [assuntosFiltrados, setAssuntosFiltrados] = useState([]);
  const [assuntoSelecionado, setAssuntoSelecionado] = useState("");
  const [tipoDesempenho, setTipoDesempenho] = useState("");
  const [message, setMessage] = useState("");
  const [desempenhosList, setDesempenhosList] = useState([]);
  const [editarDesempenho, setEditarDesempenho] = useState(null);

  useEffect(() => {
    fetchDisciplinas();
    fetchAssuntos();
  }, []);

  useEffect(() => {
    if (disciplinaSelecionada && assuntoSelecionado && tipoDesempenho) {
      fetchDesempenhos();
    } else {
      setDesempenhosList([]);
    }
  }, [disciplinaSelecionada, assuntoSelecionado, tipoDesempenho]);

  useEffect(() => {
    if (disciplinaSelecionada) {
      const filtrados = assuntos.filter(
        (assunto) =>
          assunto.disciplina_id === parseInt(disciplinaSelecionada, 10)
      );
      setAssuntosFiltrados(filtrados);
    } else {
      setAssuntosFiltrados([]);
    }
  }, [disciplinaSelecionada, assuntos]);

  const fetchDisciplinas = async () => {
    const { data, error } = await supabase
      .from("disciplinas")
      .select("id, nome");
    if (error) {
      setMessage(`Erro ao buscar disciplinas: ${error.message}`);
    } else {
      setDisciplinas(data);
    }
  };

  const fetchAssuntos = async () => {
    const { data, error } = await supabase
      .from("assuntos")
      .select("id, nome, disciplina_id");
    if (error) {
      setMessage(`Erro ao buscar assuntos: ${error.message}`);
    } else {
      setAssuntos(data);
    }
  };

  const fetchDesempenhos = async () => {
    let table;
    switch (tipoDesempenho) {
      case "ruim":
        table = "retornonegativo";
        break;
      case "mediano":
        table = "retornomoderado";
        break;
      case "bom":
        table = "retornopositivo";
        break;
      default:
        setMessage("Tipo de desempenho inválido.");
        return;
    }

    const { data, error } = await supabase
      .from(table)
      .select("id, titulo, text, id_disciplina, id_assunto")
      .eq("id_disciplina", disciplinaSelecionada)
      .eq("id_assunto", assuntoSelecionado);

    if (error) {
      setMessage(`Erro ao buscar desempenhos: ${error.message}`);
    } else {
      setDesempenhosList(data);
    }
  };

  const handleSave = async () => {
    if (
      !disciplinaSelecionada ||
      !assuntoSelecionado ||
      !desempenho ||
      !tipoDesempenho ||
      !titulo
    ) {
      setMessage("Preencha todos os campos.");
      return;
    }

    let table;
    switch (tipoDesempenho) {
      case "ruim":
        table = "retornonegativo";
        break;
      case "mediano":
        table = "retornomoderado";
        break;
      case "bom":
        table = "retornopositivo";
        break;
      default:
        setMessage("Tipo de desempenho inválido.");
        return;
    }

    if (editarDesempenho) {
      const { error } = await supabase
        .from(table)
        .update({
          titulo,
          text: desempenho,
          id_disciplina: disciplinaSelecionada,
          id_assunto: assuntoSelecionado,
        })
        .eq("id", editarDesempenho.id);

      if (error) {
        setMessage(`Erro ao atualizar desempenho: ${error.message}`);
      } else {
        setMessage("Desempenho atualizado com sucesso!");
        setEditarDesempenho(null);
      }
    } else {
      const { error } = await supabase.from(table).insert([
        {
          titulo,
          text: desempenho,
          id_disciplina: disciplinaSelecionada,
          id_assunto: assuntoSelecionado,
        },
      ]);

      if (error) {
        setMessage(`Erro ao salvar desempenho: ${error.message}`);
      } else {
        setMessage("Desempenho cadastrado com sucesso!");
      }
    }

    setDesempenho("");
    setTitulo("");
    setDisciplinaSelecionada("");
    setAssuntoSelecionado("");
    setTipoDesempenho("");
    fetchDesempenhos(); // Recarrega a lista de desempenhos
  };

  const handleEdit = (desempenho) => {
    setTitulo(desempenho.titulo);
    setDesempenho(desempenho.text);
    setEditarDesempenho(desempenho);
  };

  const handleDelete = async (id) => {
    let table;
    switch (tipoDesempenho) {
      case "ruim":
        table = "retornonegativo";
        break;
      case "mediano":
        table = "retornomoderado";
        break;
      case "bom":
        table = "retornopositivo";
        break;
      default:
        setMessage("Tipo de desempenho inválido.");
        return;
    }

    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) {
      setMessage(`Erro ao excluir desempenho: ${error.message}`);
    } else {
      setMessage("Desempenho excluído com sucesso!");
      fetchDesempenhos(); // Recarrega a lista de desempenhos
    }
  };

  return (
    <div className={`desempenho-page ${darkMode ? "dark-mode" : ""}`}>
      <div className="lineprof">
        <h2>Cadastro de Desempenho</h2>{" "}
      </div>

      <div className="conttoppro">
        <div className="contdesempenho">
          <div className="conttipo">
            <input
              type="radio"
              value="ruim"
              checked={tipoDesempenho === "ruim"}
              onChange={(e) => setTipoDesempenho(e.target.value)}
            />
            Ruim
          </div>
          <div className="conttipo">
            <input
              type="radio"
              value="mediano"
              checked={tipoDesempenho === "mediano"}
              onChange={(e) => setTipoDesempenho(e.target.value)}
            />
            Mediano
          </div>
          <div className="conttipo">
            <input
              type="radio"
              value="bom"
              checked={tipoDesempenho === "bom"}
              onChange={(e) => setTipoDesempenho(e.target.value)}
            />
            Bom
          </div>
        </div>
        <div className="conttopdesemepnho"> 
        <div>
          <label htmlFor="disciplina">Disciplina:</label>
          <select
            id="disciplina"
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
        </div>
        <div >
          <label htmlFor="assunto">Assunto:</label>
          <select
            id="assunto"
            value={assuntoSelecionado}
            onChange={(e) => setAssuntoSelecionado(e.target.value)}
          >
            <option value="">Selecione o Assunto</option>
            {assuntosFiltrados.map((assunto) => (
              <option key={assunto.id} value={assunto.id}>
                {assunto.nome}
              </option>
            ))}
          </select>
        </div>
       </div>
       <div className='btnin'>
      <button style={{width:'auto', height:'42px', margin:'8px'}} onClick={handleSave}>Salvar Desempenho</button>

      {message && <p>{message}</p>}
    </div>
      </div>
   <div className="contsecond" > 
      <div className="contline">
        <label htmlFor="titulo">Título:</label>
        <input
          id="titulo"
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
      </div>

      <div className="contline">
        <label htmlFor="desempenho">Desempenho:</label>
        <textarea
          id="desempenho"
          type="text"
          value={desempenho}
          onChange={(e) => setDesempenho(e.target.value)}
          style={{width:'80%', height:'300px', padding:'20px', fontSize:'16px'}}
        />
      </div>
      <div className="tabela"> 
      {desempenhosList.length > 0 ? (
       
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Desempenho</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {desempenhosList.map((item) => (
              <tr key={item.id}>
                <td>{item.titulo}</td>
                <td>{item.text}</td>
                <td>
                  <button onClick={() => handleEdit(item)}>Editar</button>
                  <button onClick={() => handleDelete(item.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div> 
        <p>
          
        </p>
        </div>
      )}
      </div>
      </div>   
    </div>
  );
};

export default Desempenho;
