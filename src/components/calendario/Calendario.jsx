import React, { useState, useEffect } from "react";
import axios from "axios";
import "./calendario.css";

export default function DiasComemorativos() {
  const [diasComemorativos, setDiasComemorativos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [showDiaPopup, setShowDiaPopup] = useState(false);
  const [showEventoPopup, setShowEventoPopup] = useState(false);

  const [novoDia, setNovoDia] = useState({
    titulo: "",
    dataComemorativa: ""
  });

  const [novoEvento, setNovoEvento] = useState({
    titulo: "",
    descricao: "",
    data: "",
    local: ""
  });

  const [abaAtiva, setAbaAtiva] = useState("dias"); // "dias" ou "eventos"
  const [mostrarBotoesAdicionar, setMostrarBotoesAdicionar] = useState(false);

  const idCultura = localStorage.getItem("idCulturaSelecionada");

  // Verifica se o usuário logado é dono da cultura
  useEffect(() => {
    const verificarPermissao = async () => {
      const idUsuarioLogado = localStorage.getItem("id");
      const tipoUsuario = localStorage.getItem("tipoUsuario");

      if (!idCultura) return;

      try {
        const res = await axios.get(`http://localhost:5017/api/cultura/${idCultura}`);
        const cultura = res.data.cultura;

        if (tipoUsuario === "entidade" && cultura.idUsuarioOng == idUsuarioLogado) {
          setMostrarBotoesAdicionar(true);
        } else {
          setMostrarBotoesAdicionar(false);
        }
      } catch (error) {
        console.error("Erro ao verificar permissões:", error.response?.data || error.message);
      }
    };

    verificarPermissao();
  }, [idCultura]);

  useEffect(() => {
    const fetchDias = async () => {
      if (!idCultura) return;

      try {
        const res = await axios.get(`http://localhost:5017/api/dia-comemorativo/get-all-days-by-cultura/${idCultura}`);
        setDiasComemorativos(res.data.diasComemorativos);
      } catch (err) {
        console.error("Erro ao carregar dias comemorativos:", err.response?.data || err.message);
      }
    };
    fetchDias();
  }, [idCultura]);

  useEffect(() => {
    const fetchEventos = async () => {
      if (!idCultura) return;

      try {
        const res = await axios.get(`http://localhost:5017/api/evento/get-all-eventos-by-cultura/${idCultura}`);
        setEventos(res.data.eventos || []);
      } catch (err) {
        console.error("Erro ao carregar eventos:", err.response?.data || err.message);
      }
    };
    fetchEventos();
  }, [idCultura]);

  const handleDiaChange = (e) => {
    setNovoDia({ ...novoDia, [e.target.name]: e.target.value });
  };

  const handleEventoChange = (e) => {
    setNovoEvento({ ...novoEvento, [e.target.name]: e.target.value });
  };

  const adicionarDia = async () => {
    if (!novoDia.titulo || !novoDia.dataComemorativa) {
      alert("Preencha todos os campos do dia comemorativo.");
      return;
    }

    try {
      await axios.post("http://localhost:5017/api/dia-comemorativo/create", {
        titulo: novoDia.titulo,
        dataComemorativa: novoDia.dataComemorativa,
        idCultura
      });

      const res = await axios.get(`http://localhost:5017/api/dia-comemorativo/get-all-days-by-cultura/${idCultura}`);
      setDiasComemorativos(res.data.diasComemorativos);
      setNovoDia({ titulo: "", dataComemorativa: "" });
      setShowDiaPopup(false);
      alert("Dia comemorativo adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar dia comemorativo:", error.response?.data || error.message);
      alert("Erro ao adicionar dia comemorativo.");
    }
  };

  const adicionarEvento = async () => {
    const { titulo, descricao, data, local } = novoEvento;
    if (!titulo || !descricao || !data || !local) {
      alert("Preencha todos os campos do evento.");
      return;
    }

    try {
      await axios.post("http://localhost:5017/api/evento/create", {
        titulo,
        descricao,
        data,
        local,
        idCultura
      });

      const res = await axios.get(`http://localhost:5017/api/evento/get-all-eventos-by-cultura/${idCultura}`);
      setEventos(res.data.eventos || []);
      setNovoEvento({ titulo: "", descricao: "", data: "", local: "" });
      setShowEventoPopup(false);
      alert("Evento adicionado com sucesso!");
    } catch (err) {
      console.error("Erro ao adicionar evento:", err.response?.data || err.message);
      alert("Erro ao adicionar evento.");
    }
  };

  return (
    <div className="containerDatas">
      {/* Seletor visível só em mobile */}
      <div className="d-block d-md-none text-center mb-3">
        <div className="btn-group" role="group">
          <button
            className={`btn btn-outline-primary ${abaAtiva === "dias" ? "active" : ""}`}
            onClick={() => setAbaAtiva("dias")}
          >
            Dias Comemorativos
          </button>
          <button
            className={`btn btn-outline-primary ${abaAtiva === "eventos" ? "active" : ""}`}
            onClick={() => setAbaAtiva("eventos")}
          >
            Eventos
          </button>
        </div>
      </div>

      <div className="row">
        {/* Dias Comemorativos */}
        <div className={`col-md-6 ${abaAtiva === "eventos" ? "d-none d-md-block" : ""}`}>
          <h2 className="text-center mb-3 titulo">Dias Comemorativos</h2>
          <div className="area-scroll">
            {diasComemorativos.length === 0 ? (
              <div className="alert alert-info text-center">
                Nenhum dia comemorativo cadastrado para esta cultura.
              </div>
            ) : (
              <div className="d-flex flex-column align-items-center">
                {diasComemorativos.map((dia, index) => (
                  <div key={index} className="card shadow-sm mb-3" style={{ width: "100%" }}>
                    <div className="card-body text-center">
                      <h5 className="card-title">{dia.titulo}</h5>
                      <p className="card-text">
                        {new Date(dia.dataComemorativa).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {mostrarBotoesAdicionar && (
            <div className="text-center mt-3">
              <button className="btn btn-primary" onClick={() => setShowDiaPopup(true)}>
                Adicionar Novo Dia Comemorativo
              </button>
            </div>
          )}
        </div>

        {/* Eventos */}
        <div className={`col-md-6 ${abaAtiva === "dias" ? "d-none d-md-block" : ""}`}>
          <h2 className="text-center mb-3 titulo">Eventos</h2>
          <div className="area-scroll">
            {eventos.length === 0 ? (
              <div className="alert alert-warning text-center">
                Nenhum evento cadastrado para esta cultura.
              </div>
            ) : (
              <div className="d-flex flex-column align-items-center">
                {eventos.map((evento, index) => (
                  <div key={index} className="card shadow-sm mb-3" style={{ width: "100%" }}>
                    <div className="card-body">
                      <h5 className="card-title">{evento.titulo}</h5>
                      <p className="card-text">
                        <strong>Data:</strong> {new Date(evento.data).toLocaleDateString("pt-BR")} <br />
                        <strong>Local:</strong> {evento.local} <br />
                        <strong>Descrição:</strong> {evento.descricao}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {mostrarBotoesAdicionar && (
            <div className="text-center mt-3">
              <button className="btn btn-primary" onClick={() => setShowEventoPopup(true)}>
                Adicionar Novo Evento
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Popup Dia Comemorativo */}
      {showDiaPopup && (
        <div className="modal show fade d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Novo Dia Comemorativo</h5>
                <button type="button" className="btn-close" onClick={() => setShowDiaPopup(false)}></button>
              </div>
              <div className="modal-body">
                <input type="text" name="titulo" placeholder="Título" className="form-control mb-2" value={novoDia.titulo} onChange={handleDiaChange} />
                <input type="date" name="dataComemorativa" className="form-control mb-2" value={novoDia.dataComemorativa} onChange={handleDiaChange} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={adicionarDia}>Salvar</button>
                <button className="btn btn-secondary" onClick={() => setShowDiaPopup(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup Evento */}
      {showEventoPopup && (
        <div className="modal show fade d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Novo Evento</h5>
                <button type="button" className="btn-close" onClick={() => setShowEventoPopup(false)}></button>
              </div>
              <div className="modal-body">
                <input type="text" name="titulo" placeholder="Título" className="form-control mb-2" value={novoEvento.titulo} onChange={handleEventoChange} />
                <input type="text" name="descricao" placeholder="Descrição" className="form-control mb-2" value={novoEvento.descricao} onChange={handleEventoChange} />
                <input type="datetime-local" name="data" className="form-control mb-2" value={novoEvento.data} onChange={handleEventoChange} />
                <input type="text" name="local" placeholder="Local" className="form-control mb-2" value={novoEvento.local} onChange={handleEventoChange} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={adicionarEvento}>Salvar</button>
                <button className="btn btn-secondary" onClick={() => setShowEventoPopup(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
