import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
  Select,
  CircularProgress,
} from "@mui/material";
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
    try {
      await saveProfessorData(formData);
      console.log("Dados do professor salvos com sucesso!");
      setOpen(false); // Fecha o modal após salvar
    } catch (error) {
      console.error("Erro ao salvar os dados do professor:", error);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Complete seu cadastro</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome"
            name="nome"
            value={formData.nome}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                nome: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                email: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
            required
            disabled // Desativa o campo para garantir que o email do usuário não seja alterado
          />
          <Select
            value={formData.escola}
            onChange={(e) => handleSelectEscola({ nome: e.target.value })}
            onClick={() => setOpen(true)}
            displayEmpty
            fullWidth
            renderValue={(selected) => (selected ? selected : "Selecione a escola")}
            margin="normal"
            required
          >
            {loading ? (
              <MenuItem disabled>
                <CircularProgress size={24} />
              </MenuItem>
            ) : (
              filteredEscolas.map((escola) => (
                <MenuItem key={escola.id} value={escola.nome}>
                  {escola.nome}
                </MenuItem>
              ))
            )}
          </Select>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="primary">
          Fechar
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { ModalComplit };
