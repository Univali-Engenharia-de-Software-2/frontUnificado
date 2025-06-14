import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./visualizarEditar.css";

export default function Visualizacao() {
  const [data, setData] = useState({
    titulo: "Título Padrão",
    descricao: "Descrição padrão.",
    logo: "",
    nomegrupo: "Grupo",
    tipogrupo: "ONG",
  });

  useEffect(() => {
    setData({
      titulo: localStorage.getItem("titulo") || "Título Padrão",
      descricao: localStorage.getItem("descricao") || "Descrição padrão.",
      logo: localStorage.getItem("logo") || "",
      nomegrupo: localStorage.getItem("nomegrupo") || "Grupo",
      tipogrupo: localStorage.getItem("tipogrupo") || "ONG",
    });
  }, []);

  return (
    <div className="container mt-4">
      <div className="contentvisu">
        <h1>{data.titulo || "Título padrão"}</h1>
        <p style={{ whiteSpace: "pre-wrap" }}>
          {data.descricao || "Descrição padrão"}
        </p>
      </div>

      <div className="sidebar-container">
        <aside className="grupo-sidebar">
          {data.logo && (
            <img className="grupo-img" src={data.logo} alt="Logo do Grupo" />
          )}
          <h2>{data.nomegrupo || "Grupo"}</h2>
          <button className="grupo-btn">EVENTOS</button>
          <button className="grupo-btn">CONTATO</button>
          <button className="grupo-btn">FOTOS</button>
          <div className="grupo-rodape">{data.tipogrupo || "ONG"}</div>
        </aside>

        <Link to="/editar" className="editar-btn-link">
          EDITAR
        </Link>
      </div>
    </div>
  );
}
