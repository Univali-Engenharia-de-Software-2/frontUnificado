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
    >
      <div className="card cardPaginas" onClick={handleClick} style={{ cursor: "pointer" }}>
        <div className="containerImagem">
          {image ? (
            <img 
              src={image} 
              className="card-img-top imagem-com-fundo" 
              alt={title} 
            />
          ) : (
            <div 
              style={{
                width: "100%",
                height: "120px",
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999"
              }}
            >
              Sem imagem
            </div>
          )}
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
