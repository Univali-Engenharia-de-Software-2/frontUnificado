import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CategoriaContext } from "./home/categoriaContext"; // ajuste se necessário
import axios from "axios";
import logo from "../logo/Logo.png"; // ✅ Importando a logo

export default function Navbar() {
  const {
    setCategoriaSelecionada,
    busca,
    setBusca
  } = useContext(CategoriaContext);

  const [categoriasAPI, setCategoriasAPI] = useState([]);
  const [logado, setLogado] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const status = localStorage.getItem("statusLogin") === "logado";
      const tipo = localStorage.getItem("tipoUsuario");
      setLogado(status);
      setTipoUsuario(tipo);
    };

    checkLoginStatus();
    window.addEventListener("authChange", checkLoginStatus);
    return () => window.removeEventListener("authChange", checkLoginStatus);
  }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get("http://localhost:5017/api/categoria/get-all");
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
    setCategoriaSelecionada("Todas");
    navigate("/");
  };

  const handleCategoriaClick = (cat) => {
    setCategoriaSelecionada(cat);
    setBusca("");
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("authChange"));
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

      {/* Logo + Nome */}
      <Link className="navbar-brand d-flex align-items-center" to="/">
        <img
          src={logo}
          alt="Logo"
          style={{ height: "70px", marginRight: "10px" }}
        />
        Entre Tradições
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
                <button className="dropdown-item" onClick={() => handleCategoriaClick("Todas")}>
                  Todas
                </button>
              </li>
              {categoriasAPI.map((catNome, index) => (
                <li key={index}>
                  <button className="dropdown-item" onClick={() => handleCategoriaClick(catNome)}>
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

        {!logado ? (
          <Link className="login-icon ms-3 d-none d-lg-flex" to="/login" title="Login">
            <i className="fas fa-user"></i>
          </Link>
        ) : (
          <div className="dropdown ms-3">
            <button
              className="btn btn-outline-secondary dropdown-toggle"
              type="button"
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fas fa-user"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    if (tipoUsuario === "entidade") {
                      navigate("/atcontaentidade");
                    } else {
                      navigate("/atcontavisitante");
                    }
                  }}
                >
                  Editar Perfil
                </button>
              </li>
              {tipoUsuario === "entidade" && (
                <li>
                  <Link className="dropdown-item" to="/NovaCultura">
                    Criar Página
                  </Link>
                </li>
              )}
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  Sair
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
