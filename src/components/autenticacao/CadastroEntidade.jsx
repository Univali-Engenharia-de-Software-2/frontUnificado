import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./styles.css";

// Função para formatar CPF ou CNPJ conforme o usuário digita
function formatCpfCnpj(value) {
  const onlyNumbers = value.replace(/\D/g, "");

  if (onlyNumbers.length <= 11) {
    // Formatar CPF: 000.000.000-00
    return onlyNumbers
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
      .slice(0, 14);
  } else {
    // Formatar CNPJ: 00.000.000/0000-00
    return onlyNumbers
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5")
      .slice(0, 18);
  }
}

export default function CadastroEntidade() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cnpj: "",  // pode conter CPF ou CNPJ formatado
    imagem: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cnpj") {
      const formatted = formatCpfCnpj(value);
      setFormData((prev) => ({
        ...prev,
        cnpj: formatted,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
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
    if (!formData.nome.trim()) newErrors.nome = "Informe o nome da ONG.";
    if (!formData.email.includes("@")) newErrors.email = "E-mail inválido.";
    if (formData.senha.length < 6)
      newErrors.senha = "Senha deve ter no mínimo 6 caracteres.";

    const cnpjCpfLimpo = formData.cnpj.replace(/\D/g, "");

    const cpfRegex = /^\d{11}$/;
    const cnpjRegex = /^\d{14}$/;

    if (!(cpfRegex.test(cnpjCpfLimpo) || cnpjRegex.test(cnpjCpfLimpo))) {
      newErrors.cnpj = "Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.";
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

        console.log("Caminho da imagem recebido:", diretorioImagem);
      }

      const usuarioOng = {
        nomeOng: formData.nome,
        email: formData.email,
        senha: formData.senha,
        cnpj: cnpjCpfLimpo,
        diretorioImagem: diretorioImagem,
      };

      const res = await axios.post(
        "http://localhost:5017/api/usuario-ong/create",
        usuarioOng
      );

      alert("Cadastro realizado com sucesso!");
      console.log("Usuário ONG criado:", res.data);
    } catch (error) {
      console.error(
        "Erro ao criar usuário ONG:",
        error.response?.data || error.message
      );
      alert("Erro ao cadastrar. Verifique os dados e tente novamente.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Cadastro de Entidade</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="imagem">Foto da ONG (opcional)</label>
        <input
          id="imagem"
          type="file"
          accept="image/*"
          onChange={handleFile}
        />

        <label htmlFor="nome">Nome da Entidade</label>
        <input
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
        />
        {errors.nome && <small className="text-danger">{errors.nome}</small>}

        <label htmlFor="cnpj">CPF ou CNPJ</label>
        <input
          id="cnpj"
          name="cnpj"
          value={formData.cnpj}
          placeholder="Digite CPF ou CNPJ"
          maxLength={18}
          onChange={handleChange}
        />
        {errors.cnpj && <small className="text-danger">{errors.cnpj}</small>}

        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <small className="text-danger">{errors.email}</small>}
        
        <label htmlFor="senha">Senha</label>
        <div className="form-group">
        <input 
          id="senha"
          name="senha"
          type="password"
          value={formData.senha}
          onChange={handleChange}
        />
        {errors.senha && <small className="text-danger">{errors.senha}</small>}
        </div>
        <button type="submit" className="btn btn-primary" >
          Cadastrar
        </button>
      </form>

      <div className="text-center mt-4">
        <p>Não possui uma conta?</p>
        <Link to="/login" className="btn btn-outline-primary btn-sm mx-1">
          Login
        </Link>
        <Link
          to="/cadastro-usuario"
          className="btn btn-outline-primary btn-sm mx-1"
        >
          Cadastrar Usuário
        </Link>
      </div>
    </div>
  );
}
