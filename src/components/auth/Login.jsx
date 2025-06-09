import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

export default function Login() {
  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form className="auth-form">
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="senha">Senha</label>
          <input type="password" id="senha" name="senha" required />
        </div>
        <button type="submit" className="btn btn-primary">Entrar</button>
      </form>

      <div className="text-center mt-4">
        <p>Não possui uma conta?</p>
        <Link to="/cadastro-usuario" className="btn btn-outline-primary btn-sm mx-1">
          Cadastrar Usuário
        </Link>
        <Link to="/cadastro-entidade" className="btn btn-outline-primary btn-sm mx-1">
          Cadastrar Entidade
        </Link>
      </div>
    </div>
  );
}
