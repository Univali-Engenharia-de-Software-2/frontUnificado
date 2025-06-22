import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import PageCard from "./pageCard";
import { CategoriaContext } from "./categoriaContext";
import { Link } from "react-router-dom"; // Importante para o botão de navegação
import "./home.css";

const PaginaPrincipal = () => {
  const [culturas, setCulturas] = useState([]);
  const { categoriaSelecionada, busca } = useContext(CategoriaContext);

  useEffect(() => {
    const fetchCulturas = async () => {
      try {
        const response = await axios.get("http://localhost:5017/api/cultura/get-all");
        const culturasComCategorias = await Promise.all(
          response.data.map(async (cultura) => {
            const categoriasResponse = await axios.get(
              `http://localhost:5017/api/cultura-atribuida-categoria/get-all-categorias-by-cultura/${cultura.id}`
            );
            return { ...cultura, categorias: categoriasResponse.data.categorias };
          })
        );
        setCulturas(culturasComCategorias);
      } catch (error) {
        console.error("Erro ao buscar culturas:", error.response?.data || error.message);
      }
    };

    fetchCulturas();
  }, []);

  // Filtragem: por categoria OU por texto digitado na busca
  const culturasFiltradas = culturas.filter((cultura) => {
    const tituloCorresponde = cultura.nome.toLowerCase().includes(busca.toLowerCase());
    const categoriaCorresponde =
      categoriaSelecionada === "Todas" ||
      cultura.categorias.includes(categoriaSelecionada);

    return tituloCorresponde && categoriaCorresponde;
  });

  return (
    <div className="containerPaginas">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {culturasFiltradas.map((cultura) => (
          <PageCard
            key={cultura.id}
            id={cultura.id}
            title={cultura.nome}
            image={cultura.diretorioImagem}
            link={`/visualizacao?id=${cultura.id}`}
            categorias={cultura.categorias}
          />
        ))}
      </div>
    </div>
  );
};

export default PaginaPrincipal;
