import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ContatoPopup from "./ContatoPopup";
import "./visualizarEditar.css";

export default function Visualizacao() {
  const [data, setData] = useState({
    titulo: "Título Padrão",
    descricao: "Descrição padrão.",
    logo: "",
    nomegrupo: "Grupo",
  });

  const [ongInfo, setOngInfo] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchCultura = async () => {
      const idCultura = localStorage.getItem("idCulturaSelecionada");

      if (!idCultura) {
        console.warn("Nenhum ID de cultura encontrado no localStorage.");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5017/api/cultura/${idCultura}`);
        const cultura = response.data.cultura;

        setData({
          titulo: cultura.nome,
          descricao: cultura.descricao,
          logo: cultura.diretorioImagem,
          nomegrupo: cultura.nome,
        });

        // Buscar info da ONG associada
        if (cultura.idUsuarioOng) {
          const ongResponse = await axios.get(`http://localhost:5017/api/usuario-ong/${cultura.idUsuarioOng}`);
          setOngInfo(ongResponse.data.usuario || null);
        } else {
          setOngInfo(null);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error.response?.data || error.message);
        setOngInfo(null);
      }
    };

    fetchCultura();
  }, []);

  return (
    <div className="container mt-4">
      <div className="contentvisu">
        <h1>{data.titulo}</h1>
        <p style={{ whiteSpace: "pre-wrap" }}>{data.descricao}</p>
      </div>

      <div className="sidebar-container">
        <aside className="grupo-sidebar">
          {data.logo && <img className="grupo-img" src={data.logo} alt="Logo do Grupo" />}
          <h2 className="text-center">{data.nomegrupo}</h2>
          <button className="grupo-btn">EVENTOS</button>
          <button className="grupo-btn" onClick={() => setShowPopup(true)}>CONTATO</button>
          <button className="grupo-btn">FOTOS</button>
          <div className="grupo-rodape">{ongInfo?.nomeOng || "ONG"}</div> {/* nome da ONG ou fallback */}
        </aside>

        <Link to="/editar" className="editar-btn-link">EDITAR</Link>
      </div>

      {showPopup && ongInfo && (
        <ContatoPopup ongInfo={ongInfo} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
}
