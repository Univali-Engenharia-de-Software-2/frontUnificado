import React, { useContext } from "react";
import PageCard from "./pageCard";
import "./home.css";
import { CategoriaContext } from "./categoriaContext";
import cards from "./cardsData";

export default function PaginaPrincipal() {
  const { categoriaSelecionada, busca } = useContext(CategoriaContext);

  const cardsFiltrados = cards.filter((card) => {
    const pertenceCategoria =
      categoriaSelecionada === "Todas" || card.categorias.includes(categoriaSelecionada);

    const tituloCorresponde =
      card.title.toLowerCase().includes(busca.trim().toLowerCase());

    return pertenceCategoria && tituloCorresponde;
  });

  return (
    <div className="containerPaginas">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {cardsFiltrados.map((card, index) => (
          <PageCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
}
