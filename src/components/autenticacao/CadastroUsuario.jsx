import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";

// Função para formatar CPF conforme o usuário digita
function formatCpf(value) {
  const onlyNumbers = value.replace(/\D/g, "");
  return onlyNumbers
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
    .slice(0, 14);
}

export default function CadastroUsuario() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    imagem: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cpf") {
      const formattedCpf = formatCpf(value);
      setFormData((prev) => ({ ...prev, cpf: formattedCpf }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFile = (e) => {
    setFormData((prev) => ({
      ...prev,
      imagem: e.target.files[0],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = "Informe o nome.";
    if (!formData.email.includes("@")) newErrors.email = "E-mail inválido.";
    if (formData.senha.length < 6)
      newErrors.senha = "Senha deve ter no mínimo 6 caracteres.";

    const cpfLimpo = formData.cpf.replace(/\D/g, "");
    if (cpfLimpo && cpfLimpo.length !== 11) {
      newErrors.cpf = "CPF deve ter 11 dígitos.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      let diretorioImagem = "";

      if (formData.imagem) {
        const imagemData = new FormData();
        imagemData.append("Imagem", formData.imagem);

        const response = await axios.post(
          "http://localhost:5017/api/imagem-perfil/upload-imagem",
          imagemData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        diretorioImagem =
          typeof response.data === "string" ? response.data : response.data.caminho;
      }

      const payload = {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        cpf: cpfLimpo || "00000000000",
        diretorioImagem: diretorioImagem,
      };

      await axios.post("http://localhost:5017/api/usuario-visitante/create", payload);

      // Login automático após cadastro
      try {
        const loginRes = await axios.post(
          "http://localhost:5017/api/usuario-visitante/login",
          {
            email: formData.email,
            senha: formData.senha,
          }
        );

        const loginDados = loginRes.data;

        if (loginDados && loginDados.usuario && loginDados.usuario.id) {
          localStorage.setItem("id", loginDados.usuario.id.toString());
          localStorage.setItem("tipoUsuario", "visitante");
          localStorage.setItem("statusLogin", "logado");

          window.dispatchEvent(new Event("authChange"));

          alert("Cadastro e login realizados com sucesso!");
          navigate("/");
        } else {
          alert("Cadastro feito, mas não foi possível logar automaticamente.");
        }
      } catch (loginError) {
        console.error("Erro ao fazer login automático:", loginError);
        alert("Cadastro feito, mas houve erro ao fazer login automático.");
      }
    } catch (error) {
      console.error("Erro ao cadastrar usuário visitante:", error.response?.data || error.message);
      alert("Erro ao cadastrar. Verifique os dados e tente novamente.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Cadastro de Usuário</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="imagem">Foto (opcional)</label>
          <input
            type="file"
            id="imagem"
            name="imagem"
            accept="image/*"
            className="form-control"
            onChange={handleFile}
          />
        </div>

        <div className="form-group">
          <label htmlFor="nome">Nome</label>
          <input
            type="text"
            id="nome"
            name="nome"
            className="form-control"
            value={formData.nome}
            onChange={handleChange}
          />
          {errors.nome && <small className="text-danger">{errors.nome}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="cpf">CPF</label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            className="form-control"
            value={formData.cpf}
            maxLength={14}
            placeholder="000.000.000-00"
            onChange={handleChange}
          />
          {errors.cpf && <small className="text-danger">{errors.cpf}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <small className="text-danger">{errors.email}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            name="senha"
            className="form-control"
            value={formData.senha}
            onChange={handleChange}
          />
          {errors.senha && <small className="text-danger">{errors.senha}</small>}
        </div>

        <button type="submit" className="btn btn-primary w-100 mt-3">
          Cadastrar
        </button>
      </form>

      <div className="text-center mt-4">
        <p>Já possui uma conta?</p>
        <Link to="/login" className="btn btn-outline-primary btn-sm mx-1">
          Login
        </Link>
        <Link to="/cadastro-entidade" className="btn btn-outline-primary btn-sm mx-1">
          Cadastrar Entidade
        </Link>
      </div>
    </div>
  );
}
