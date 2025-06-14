import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

export default function CadastroUsuario() {
  const handleSubmit = (event) => {
    event.preventDefault();
    let valid = true;

    const nome = document.getElementById("nome");
    const email = document.getElementById("email");
    const telefone = document.getElementById("telefone");
    const senha = document.getElementById("senha");

    const erroNome = document.getElementById("erroNome");
    const erroEmail = document.getElementById("erroEmail");
    const erroTelefone = document.getElementById("erroTelefone");
    const erroSenha = document.getElementById("erroSenha");

    erroNome.textContent = "";
    erroEmail.textContent = "";
    erroTelefone.textContent = "";
    erroSenha.textContent = "";

    if (nome.value.trim() === "") {
      erroNome.textContent = "Informe o nome.";
      valid = false;
    }

    if (!email.value.includes("@")) {
      erroEmail.textContent = "E-mail inválido.";
      valid = false;
    }

    if (telefone.value.trim() === "") {
      erroTelefone.textContent = "Informe o telefone.";
      valid = false;
    }

    if (senha.value.length < 6) {
      erroSenha.textContent = "Senha deve ter no mínimo 6 caracteres.";
      valid = false;
    }

    if (valid) {
      alert("Cadastro de usuário válido!");
    }
  };

  return (
    <div className="auth-container">
      <h2>Cadastro de Usuário</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">Nome</label>
          <input type="text" id="nome" name="nome" />
          <small id="erroNome" className="text-danger"></small>
        </div>

        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" name="email" />
          <small id="erroEmail" className="text-danger"></small>
        </div>

        <div className="form-group">
          <label htmlFor="telefone">Telefone</label>
          <input type="tel" id="telefone" name="telefone" />
          <small id="erroTelefone" className="text-danger"></small>
        </div>

        <div className="form-group">
          <label htmlFor="senha">Senha</label>
          <input type="password" id="senha" name="senha" />
          <small id="erroSenha" className="text-danger"></small>
        </div>

        <button type="submit" className="btn btn-primary">Cadastrar</button>
      </form>

      <div className="text-center mt-4">
        <p>Não possui uma conta?</p>
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
