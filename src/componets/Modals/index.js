import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./styles.css"; // Importe o CSS customizado, se necessário

const ModalComplit = () => {
  const { saveProfessorData, getListaEscolas, user, complit, setComplit } = useAuth(); // Adiciona setComplit ao contexto

  const [formData, setFormData] = useState({
    nome: "",
    email: user ? user.email : "",
    escola: "",
    uid: user ? user.id : "",
    Curso: "",  // Adiciona o campo Curso
    Turma: ""   // Adiciona o campo Turma
  });
  
  const [escolas, setEscolas] = useState([]);
  const [filteredEscolas, setFilteredEscolas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(true);

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

  const turmaOptions = [
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
    { value: 'D', label: 'D' },
    { value: 'E', label: 'E' },
    { value: 'F', label: 'F' },
    { value: 'G', label: 'G' },
    { value: 'H', label: 'H' },
    { value: 'I', label: 'I' },
    { value: 'J', label: 'J' },
    { value: 'K', label: 'K' },
    { value: 'L', label: 'L' },
    { value: 'M', label: 'M' },
    { value: 'N', label: 'N' },
    { value: 'O', label: 'O' },
    { value: 'P', label: 'P' },
    { value: 'Q', label: 'Q' },
    { value: 'R', label: 'R' },
    { value: 'S', label: 'S' },
    { value: 'T', label: 'T' },
    { value: 'U', label: 'U' },
    { value: 'V', label: 'V' },
    { value: 'W', label: 'W' },
    { value: 'X', label: 'X' },
    { value: 'Y', label: 'Y' },
    { value: 'Z', label: 'Z' },
  ];

  useEffect(() => {
    const fetchEscolas = async () => {
      setLoading(true);
      try {
        const escolasData = await getListaEscolas();
        setEscolas(escolasData);
        setFilteredEscolas(escolasData);
      } catch (error) {
        console.error("Erro ao carregar as escolas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEscolas();
  }, [getListaEscolas]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term.length >= 5) {
      const filtered = escolas.filter((escola) =>
        escola.nome.toLowerCase().includes(term)
      );
      setFilteredEscolas(filtered);
    } else {
      setFilteredEscolas([]);
    }
  };

  const handleSelectEscola = (escola) => {
    setFormData((prevData) => ({
      ...prevData,
      escola: escola.nome,
    }));
    setSearchTerm(escola.nome);
    setFilteredEscolas([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.escola === "" ||
      formData.nome === "" ||
      formData.Curso === "" ||
      formData.Turma === ""
    ) {
      return;
    }
    try {
      await saveProfessorData(formData);
      console.log("Dados do professor salvos com sucesso!");
     
      setOpen(false);
    } catch (error) {
      console.error("Erro ao salvar os dados do professor:", error);
    }
  };

  const isFormValid = formData.escola !== "" && formData.nome !== "" && formData.Curso !== "" && formData.Turma !== "";

  return (
    open && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Complete seu cadastro</h2>
          <div className="mandatory-info">Dados obrigatórios</div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                type="text"
                name="nome"
                value={formData.nome}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    nome: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    email: e.target.value,
                  }))
                }
                required
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="escola">Escola</label>
              <input
                id="escola"
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Digite para buscar..."
                required
              />
              {searchTerm && filteredEscolas.length > 0 && (
                <div className="dropdown">
                  {loading ? (
                    <div className="loading">Carregando...</div>
                  ) : (
                    filteredEscolas.map((escola) => (
                      <div
                        key={escola.id}
                        className="dropdown-item"
                        onClick={() => handleSelectEscola(escola)}
                      >
                        {escola.nome}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
             <div style={{display:'flex', flexDirection:'row'}}> 
            <div className="form-group" >
              <label htmlFor="curso">Curso</label>
              <select
                id="curso"
                name="curso"
                value={formData.Curso}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    Curso: e.target.value,
                  }))
                }
                required
              >
                <option value="">Selecione um curso</option>
                {cursoOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="turma">Turma</label>
              <select
                id="turma"
                name="turma"
                value={formData.Turma}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    Turma: e.target.value,
                  }))
                }
                required
              >
                <option value="">Selecione uma turma</option>
                {turmaOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
            <div className="modal-actions">
              <button type="button" onClick={() => setOpen(false)} className="btn-close">
                Fechar
              </button>
              <button
                type="submit"
                className="btn-save"
                disabled={!isFormValid}>
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export { ModalComplit };
