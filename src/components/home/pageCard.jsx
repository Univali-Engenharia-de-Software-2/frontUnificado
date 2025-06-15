import React from "react";
import CategoriaCard from "./categoriaCard";
import { Link } from "react-router-dom";

export default function PageCard({ title, image, link, categorias }) {
  return (
    <div className="col">
      <Link to={link} className="categoriaCardLink">
        <div className="card">
          <div className="containerImagem">
            <img src={image} className="card-img-top imagem-com-fundo" alt={title} />
          </div>
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
          </div>
          <div className="categoriasContainer">
            {categorias.map((cat, i) => (
              <CategoriaCard key={i} categoria={cat} />
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}
