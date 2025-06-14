import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

export default function CadastroEntidade() {
  const handleSubmit = (event) => {
    event.preventDefault();
    let valid = true;

    const nome = document.getElementById("nomeEntidade");
    const email = document.getElementById("email");
    const telefone = document.getElementById("telefone");
    const descricao = document.getElementById("descricao");
    const senha = document.getElementById("senha");
    const cpfCnpj = document.getElementById("cpfcnpj");

    const erroNome = document.getElementById("erroNome");
    const erroEmail = document.getElementById("erroEmail");
    const erroTelefone = document.getElementById("erroTelefone");
    const erroDescricao = document.getElementById("erroDescricao");
    const erroSenha = document.getElementById("erroSenha");
    const erroCpf = document.getElementById("erroCpf");

    erroNome.textContent = "";
    erroEmail.textContent = "";
    erroTelefone.textContent = "";
    erroDescricao.textContent = "";
    erroSenha.textContent = "";
    erroCpf.textContent = "";

    if (nome.value.trim() === "") {
      erroNome.textContent = "Informe o nome da entidade.";
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

    if (descricao.value.trim() === "") {
      erroDescricao.textContent = "Informe a descrição.";
      valid = false;
    }

    if (senha.value.length < 6) {
      erroSenha.textContent = "Senha deve ter no mínimo 6 caracteres.";
      valid = false;
    }

    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/;

    if (!cpfRegex.test(cpfCnpj.value) && !cnpjRegex.test(cpfCnpj.value)) {
      erroCpf.textContent = "CPF ou CNPJ inválido.";
      valid = false;
    }

    if (valid) {
      alert("Cadastro de entidade válido!");
    }
  };

  return (
    <div className="auth-container">
      <h2>Cadastro de Entidade</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nomeEntidade">Nome da Entidade</label>
          <input type="text" id="nomeEntidade" name="nomeEntidade" />
          <small id="erroNome" className="text-danger"></small>
        </div>

        <div className="form-group">
          <label htmlFor="cpfcnpj">CPF/CNPJ</label>
          <input type="text" id="cpfcnpj" name="cpfcnpj" placeholder="123.123.123-23 / 12.123.123/0001-23"/>
          <small id="erroCpf" className="text-danger"></small>
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
          <label htmlFor="descricao">Descrição</label>
          <textarea id="descricao" name="descricao"></textarea>
          <small id="erroDescricao" className="text-danger"></small>
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
        <Link to="/cadastro-usuario" className="btn btn-outline-primary btn-sm mx-1">
          Cadastrar Usuário
        </Link>
      </div>
    </div>
  );
}
