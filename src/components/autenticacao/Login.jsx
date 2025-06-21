import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";

export default function Login() {
  const navigate = useNavigate();
  const [tipoUsuario, setTipoUsuario] = useState("visitante");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const url =
      tipoUsuario === "entidade"
        ? "http://localhost:5017/api/usuario-ong/login"
        : "http://localhost:5017/api/usuario-visitante/login";

    try {
      const response = await axios.post(url, { email, senha });

      const dados = response.data;
      alert("Login realizado com sucesso!");

      // Salva dados do usuário, se necessário
      // localStorage.setItem("usuario", JSON.stringify(dados));

      // Redireciona
      navigate("/home");
    } catch (error) {
      console.error("Erro no login:", error.response?.data || error.message);
      alert("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Seleção de tipo de usuário */}
        <div className="form-group">
          <label>Tipo de Usuário</label>
          <select
            value={tipoUsuario}
            onChange={(e) => setTipoUsuario(e.target.value)}
            className="form-control"
          >
            <option value="visitante">Visitante</option>
            <option value="entidade">Entidade (ONG)</option>
          </select>
        </div>

        {/* Campos de login */}
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
