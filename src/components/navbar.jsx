import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CategoriaContext } from "./home/categoriaContext";
import axios from "axios";

export default function Navbar() {
  const {
    setCategoriaSelecionada,
    busca,
    setBusca
  } = useContext(CategoriaContext);

  const [categoriasAPI, setCategoriasAPI] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get("http://localhost:5017/api/categoria/get-all");

        // Retirar nomes duplicados:
        const nomesUnicos = Array.from(new Set(response.data.map(cat => cat.nome)));

        setCategoriasAPI(nomesUnicos);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error.response?.data || error.message);
      }
    };

    fetchCategorias();
  }, []);

  const handleSearchChange = (e) => {
    setBusca(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCategoriaSelecionada("Todas"); // Reseta categoria ao buscar
    navigate("/");
  };

  const handleCategoriaClick = (cat) => {
    setCategoriaSelecionada(cat);
    setBusca(""); // Limpa busca ao filtrar por categoria
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarTogglerDemo01"
        aria-controls="navbarTogglerDemo01"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <Link className="navbar-brand" to="/">Entre Tradições</Link>

      <Link className="login-icon mx-2 d-lg-none" to="/login" title="Login">
        <i className="fas fa-user"></i>
      </Link>

      <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item active">
            <Link className="nav-link" to="/saiba-mais">Saiba mais</Link>
          </li>

          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdownMenuLink"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Categorias
            </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handleCategoriaClick("Todas")}
                >
                  Todas
                </button>
              </li>
              {categoriasAPI.map((catNome, index) => (
                <li key={index}>
                  <button
                    className="dropdown-item"
                    onClick={() => handleCategoriaClick(catNome)}
                  >
                    {catNome}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        </ul>

        <form className="barraPesquisa d-flex" onSubmit={handleSearchSubmit}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="O que você procura?"
            aria-label="Search"
            value={busca}
            onChange={handleSearchChange}
          />
          <button className="btn btn-outline-success" type="submit">
            <i className="fas fa-search"></i>
          </button>
        </form>

        <Link className="login-icon ml-3 d-none d-lg-flex" to="/login" title="Login">
          <i className="fas fa-user"></i>
        </Link>
      </div>
    </nav>
  );
}
