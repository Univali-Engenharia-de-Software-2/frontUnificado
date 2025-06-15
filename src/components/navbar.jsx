import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CategoriaContext } from "./home/categoriaContext";
import cards from "./home/cardsData";

export default function Navbar() {
  const {
    setCategoriaSelecionada,
    busca,
    setBusca
  } = useContext(CategoriaContext);

  // Extrai categorias únicas dos cards
  const categoriasUnicas = Array.from(
    new Set(cards.flatMap(card => card.categorias))
  );

  // Atualiza o campo de busca ao digitar
  const handleSearchChange = (e) => {
    setBusca(e.target.value);
  };

  // Opcional: evita recarregamento da página ao enviar o form
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Você pode adicionar lógica adicional aqui, como rolar para os resultados
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

      <Link className="navbar-brand" to="/">
        Entre Tradições
      </Link>

      <Link className="login-icon mx-2 d-lg-none" to="/login" title="Login">
        <i className="fas fa-user"></i>
      </Link>

      <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item active">
            <Link className="nav-link" to="/saiba-mais">
              Saiba mais
            </Link>
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
            <ul
              className="dropdown-menu"
              aria-labelledby="navbarDropdownMenuLink"
            >
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => setCategoriaSelecionada("Todas")}
                >
                  Todas
                </button>
              </li>
              {categoriasUnicas.map((cat, index) => (
                <li key={index}>
                  <button
                    className="dropdown-item"
                    onClick={() => setCategoriaSelecionada(cat)}
                  >
                    {cat}
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
