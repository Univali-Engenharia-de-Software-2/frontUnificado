import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./visualizarEditar.css";

export default function Editar() {
  const navigate = useNavigate();  // <-- crie a função de navegação

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [logo, setLogo] = useState("");
  const [idUsuarioOng, setIdUsuarioOng] = useState(0);

  useEffect(() => {
    const carregarDados = async () => {
      const idCultura = localStorage.getItem("idCulturaSelecionada");
      if (!idCultura) return;

      try {
        const response = await axios.get(`http://localhost:5017/api/cultura/${idCultura}`);
        const cultura = response.data.cultura;

        setTitulo(cultura.nome || "");
        setDescricao(cultura.descricao || "");
        setLogo(cultura.diretorioImagem || "");
        setIdUsuarioOng(cultura.idUsuarioOng || 0);

        const logoPreview = document.getElementById("logoPreview");
        if (logoPreview) logoPreview.src = cultura.diretorioImagem || "";
      } catch (error) {
        console.error("Erro ao carregar cultura:", error);
      }
    };

    carregarDados();
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (ev) {
      setLogo(ev.target.result);
      const logoPreview = document.getElementById("logoPreview");
      if (logoPreview) logoPreview.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const salvarEdicao = async () => {
    const idCultura = localStorage.getItem("idCulturaSelecionada");
    if (!idCultura) {
      alert("ID da cultura não encontrado!");
      return;
    }

    if (!titulo.trim() || !descricao.trim()) {
      alert("Preencha todos os campos antes de salvar.");
      return;
    }

    try {
      await axios.put(`http://localhost:5017/api/cultura/update/${idCultura}`, {
        idUsuarioOng,
        nome: titulo,
        descricao,
        diretorioImagem: logo,
      });
      alert("Edição salva com sucesso!");

      localStorage.setItem("titulo", titulo);
      localStorage.setItem("descricao", descricao);
      localStorage.setItem("logo", logo);

      navigate("/visualizacao"); // <-- redireciona após salvar
    } catch (error) {
      console.error("Erro ao salvar edição:", error.response?.data || error.message);
      alert("Erro ao salvar edição.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="content">
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Editar Grupo</h1>
        <input
          type="text"
          id="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="form-control my-2 editable"
          placeholder="Título"
        />
        <textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="form-control my-2 editable"
          style={{ resize: "none" }}
          placeholder="Descrição"
        ></textarea>
        <input
          type="file"
          id="logoInput"
          accept="image/*"
          className="form-control my-2"
          onChange={handleLogoChange}
        />
        <img id="logoPreview" className="grupo-img" src={logo} alt="Logo do Grupo" />
        <button onClick={salvarEdicao} className="btn btn-primary mt-3" style={{ width: "100%" }}>
          Salvar
        </button>
      </div>
    </div>
  );
}
