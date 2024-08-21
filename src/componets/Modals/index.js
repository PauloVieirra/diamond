import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./styles.css"; // Importe o CSS customizado, se necessário

const ModalComplit = () => {
  const { saveProfessorData, getListaEscolas, user } = useAuth();

  const [formData, setFormData] = useState({
    nome: "",
    email: user ? user.email : "", // Preenche o email com o email do usuário logado
    escola: "",
    uid: user ? user.id : "" // Usa o ID do usuário se disponível
  });

  const [escolas, setEscolas] = useState([]);
  const [filteredEscolas, setFilteredEscolas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(true);

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
    const filtered = escolas.filter((escola) =>
      escola.nome.toLowerCase().includes(term)
    );
    setFilteredEscolas(filtered);
  };

  const handleSelectEscola = (escola) => {
    setFormData((prevData) => ({
      ...prevData,
      escola: escola.nome,
    }));
    setSearchTerm(escola.nome);
    setOpen(false); // Fecha o modal após selecionar a escola
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.escola === "" || formData.nome === "") {
      return; // Não permite salvar se a escola não estiver selecionada
    }
    try {
      await saveProfessorData(formData);
      console.log("Dados do professor salvos com sucesso!");
      setOpen(false); // Fecha o modal após salvar
    } catch (error) {
      console.error("Erro ao salvar os dados do professor:", error);
    }
  };

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
                disabled // Desativa o campo para garantir que o email do usuário não seja alterado
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
            </div>

            <div className="modal-actions">
              <button type="button" onClick={() => setOpen(false)} className="btn-close">
                Fechar
              </button>
              <button type="submit" className="btn-save" disabled={formData.escola === ""}>
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
