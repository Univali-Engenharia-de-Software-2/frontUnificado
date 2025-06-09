import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
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
                <Link className="dropdown-item" to="/categoria/1">
                  Categoria 1
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/categoria/2">
                  Categoria 2
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/categoria/3">
                  Categoria 3
                </Link>
              </li>
            </ul>
          </li>
        </ul>

        <form className="barraPesquisa d-flex">
          <input
            className="form-control me-2"
            type="search"
            placeholder="O que você procura?"
            aria-label="Search"
          />
          <button className="btn btn-outline-success" type="submit">
            <i className="fas fa-search"></i>
          </button>
        </form>

        <Link
          className="login-icon ml-3 d-none d-lg-flex"
          to="/login"
          title="Login"
        >
          <i className="fas fa-user"></i>
        </Link>
      </div>
    </nav>
  );
}
