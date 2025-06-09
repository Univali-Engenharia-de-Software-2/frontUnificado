// PageCard.jsx
import React from "react";
import CategoriaCard from "./categoriaCard";

export default function PageCard({ title, image, link }) {
  const categorias = [
    { categoria: "aasdasdas" },
    { categoria: "a" },
    { categoria: "a" },
    { categoria: "a" },
    { categoria: "a" },
    { categoria: "a" },
  ];

  return (
    <div className="col">
      <div className="card">
        <div className="containerImagem">
          <img
            src={image}
            className="card-img-top imagem-com-fundo"
            alt={title}
          />
        </div>
        <div className="categoriasContainer">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-1">
            {categorias.map((categoria, index) => (
              <CategoriaCard key={index} {...categoria} />
            ))}
          </div>
        </div>
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <a href={link} className="btn btn-primary">
            Leia mais...
          </a>
        </div>
      </div>
    </div>
  );
}
