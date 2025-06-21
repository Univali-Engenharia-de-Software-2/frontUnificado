import React from "react";
import CategoriaCard from "./categoriaCard";
import { useNavigate } from "react-router-dom";
import "./home.css";

export default function PageCard({ id, title, image, categorias }) {
  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.setItem("idCulturaSelecionada", id);
    navigate("/visualizacao");
  };

  return (
    <div 
      className="col" 
      onClick={handleClick} 
      style={{ cursor: "pointer" }}
    >
      <div className="card cardPaginas">
        <div className="containerImagem">
          <img 
            src={image} 
            className="card-img-top imagem-com-fundo" 
            alt={title} 
          />
        </div>
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <div className="categoriasContainer">
            {categorias.map((cat, i) => (
              <CategoriaCard key={i} categoria={cat} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
