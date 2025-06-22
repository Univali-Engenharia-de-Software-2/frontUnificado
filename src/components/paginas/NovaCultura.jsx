import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./visualizarEditar.css";

export default function NovaCultura() {
  const navigate = useNavigate();

  const [novaCultura, setNovaCultura] = useState({
    nome: "",
    descricao: "",
    emailUsuarioOng: "",
    diretorioImagem: "",
  });

  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState([]);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [novaCategoria, setNovaCategoria] = useState("");

  // Carrega categorias únicas ao iniciar
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get("http://localhost:5017/api/categoria/get-all");
        const categoriasUnicas = Array.from(
          new Map(response.data.map(cat => [cat.nome.toLowerCase(), cat])).values()
        );
        setCategoriasDisponiveis(categoriasUnicas);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error.response?.data || error.message);
      }
    };

    fetchCategorias();
  }, []);

  // Busca email e imagem do usuário ONG com base no ID salvo no localStorage
  useEffect(() => {
    const fetchEmailUsuarioOng = async () => {
      const id = localStorage.getItem("id");
      if (!id) {
        console.warn("ID da ONG não encontrado no localStorage.");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5017/api/usuario-ong/${id}`);
        const usuario = response.data.usuario;

        setNovaCultura(prev => ({
          ...prev,
          emailUsuarioOng: usuario.email,
          diretorioImagem: usuario.diretorioImagem,
        }));

        const img = document.getElementById("previewImagem");
        if (img && usuario.diretorioImagem) img.src = usuario.diretorioImagem;
      } catch (error) {
        console.error("Erro ao buscar dados da ONG:", error.response?.data || error.message);
      }
    };

    fetchEmailUsuarioOng();
  }, []);

  const handleInputChange = (e) => {
    setNovaCultura({ ...novaCultura, [e.target.name]: e.target.value });
  };

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (ev) {
      setNovaCultura(prev => ({
        ...prev,
        diretorioImagem: ev.target.result
      }));

      const preview = document.getElementById("previewImagem");
      if (preview) preview.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleCategoriaToggle = (idCategoria) => {
    setCategoriasSelecionadas((prev) => {
      if (prev.includes(idCategoria)) {
        return prev.filter(id => id !== idCategoria);
      } else if (prev.length < 6) {
        return [...prev, idCategoria];
      } else {
        alert("Máximo de 6 categorias.");
        return prev;
      }
    });
  };

  const criarNovaCategoria = async () => {
    const nova = novaCategoria.trim().toLowerCase();

    if (!nova) {
      alert("Digite uma categoria.");
      return;
    }

    const jaExiste = categoriasDisponiveis.some(
      cat => cat.nome.toLowerCase() === nova
    );

    if (jaExiste) {
      alert("Categoria já existe.");
      return;
    }

    try {
      await axios.post("http://localhost:5017/api/categoria/create", { nome: nova });

      const response = await axios.get("http://localhost:5017/api/categoria/get-all");
      const categoriasUnicas = Array.from(
        new Map(response.data.map(cat => [cat.nome.toLowerCase(), cat])).values()
      );

      setCategoriasDisponiveis(categoriasUnicas);
      setNovaCategoria("");
      alert("Categoria criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar categoria:", error.response?.data || error.message);
      alert("Erro ao criar categoria.");
    }
  };

  const vincularCategoriasACultura = async (idCultura) => {
    try {
      for (const idCategoria of categoriasSelecionadas) {
        await axios.post("http://localhost:5017/api/cultura-atribuida-categoria/create", {
          idCultura,
          idCategoria
        });
      }
    } catch (error) {
      console.error("Erro ao vincular categorias:", error.response?.data || error.message);
    }
  };

  const criarCultura = async () => {
    if (!novaCultura.nome || !novaCultura.descricao) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      await axios.post("http://localhost:5017/api/cultura/create", novaCultura);

      const responseGet = await axios.get("http://localhost:5017/api/cultura/get-all");
      const culturaCriada = responseGet.data.find(
        cultura => cultura.nome.toLowerCase() === novaCultura.nome.toLowerCase()
      );

      if (!culturaCriada) throw new Error("Cultura criada não encontrada.");

      await vincularCategoriasACultura(culturaCriada.id);

      alert("Cultura criada com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro ao criar cultura:", error.response?.data || error.message);
      alert("Erro ao criar cultura.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="content">
        <h1 className="text-center mb-4">Criar Nova Cultura</h1>

        <input
          type="text"
          name="nome"
          value={novaCultura.nome}
          onChange={handleInputChange}
          placeholder="Nome da Cultura"
          className="form-control my-2"
        />
        <textarea
          name="descricao"
          value={novaCultura.descricao}
          onChange={handleInputChange}
          placeholder="Descrição da Cultura"
          className="form-control my-2"
          rows={4}
        />

        <div className="mt-3">
          <h5>Imagem da Cultura:</h5>
          <input
            type="file"
            accept="image/*"
            className="form-control my-2"
            onChange={handleImagemChange}
          />
          <img
            id="previewImagem"
            src=""
            alt="Pré-visualização"
            style={{ width: "100%", maxWidth: "300px", marginTop: "10px" }}
          />
        </div>

        <h5 className="mt-4">Selecione até 6 Categorias:</h5>
        <div className="d-flex flex-wrap">
          {categoriasDisponiveis.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`btn m-2 ${categoriasSelecionadas.includes(cat.id) ? "btn-success" : "btn-outline-primary"}`}
              onClick={() => handleCategoriaToggle(cat.id)}
            >
              {cat.nome}
            </button>
          ))}
        </div>

        <div className="mt-3">
          <h5>Nova Categoria:</h5>
          <input
            type="text"
            value={novaCategoria}
            onChange={(e) => setNovaCategoria(e.target.value)}
            placeholder="Digite nova categoria"
            className="form-control my-2"
          />
          <button className="btn btn-secondary" onClick={criarNovaCategoria}>
            Adicionar Categoria
          </button>
        </div>

        <div className="text-center mt-4">
          <button className="btn btn-primary" onClick={criarCultura}>
            Criar Cultura
          </button>
        </div>
      </div>
    </div>
  );
}
