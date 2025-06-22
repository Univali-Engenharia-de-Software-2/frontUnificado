import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ContatoPopup from "./ContatoPopup";
import "./visualizarEditar.css";

export default function Visualizacao() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    titulo: "Título Padrão",
    descricao: "Descrição padrão.",
    logo: "",
    nomegrupo: "Grupo",
  });

  const [ongInfo, setOngInfo] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [mostrarBotaoEditar, setMostrarBotaoEditar] = useState(false);

  useEffect(() => {
    const fetchCultura = async () => {
      const idCultura = localStorage.getItem("idCulturaSelecionada");
      const idUsuarioLogado = localStorage.getItem("id");
      const tipoUsuario = localStorage.getItem("tipoUsuario");
      

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

        if (cultura.idUsuarioOng) {
          const ongResponse = await axios.get(`http://localhost:5017/api/usuario-ong/${cultura.idUsuarioOng}`);
          setOngInfo(ongResponse.data.usuario || null);

          // Verifica se é a entidade dona da página
          if (tipoUsuario === "entidade" && cultura.idUsuarioOng == idUsuarioLogado) {
            setMostrarBotaoEditar(true);
          }
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

  const irParaCalendario = () => {
    navigate("/calendario");
  };

  const irParaFotos = () => {
    navigate("/fotos");
  };

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
          <button className="grupo-btn" onClick={irParaCalendario}>EVENTOS</button>
          <button className="grupo-btn" onClick={() => setShowPopup(true)}>CONTATO</button>
          <button className="grupo-btn" onClick={irParaFotos}>FOTOS</button>
          <div className="grupo-rodape">{ongInfo?.nomeOng || "ONG"}</div>
        </aside>

        {mostrarBotaoEditar && (
          <Link to="/editar" className="editar-btn-link">EDITAR</Link>
        )}
      </div>

      {showPopup && ongInfo && (
        <ContatoPopup ongInfo={ongInfo} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
}
