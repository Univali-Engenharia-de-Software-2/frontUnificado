import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Fotos() {
  const [fotos, setFotos] = useState([]);
  const [novaImagem, setNovaImagem] = useState(null);
  const [mostrarBotaoAdicionar, setMostrarBotaoAdicionar] = useState(false);

  const idCultura = localStorage.getItem("idCulturaSelecionada");
  const idUsuarioLogado = localStorage.getItem("id");
  const tipoUsuario = localStorage.getItem("tipoUsuario");

  useEffect(() => {
    const fetchFotos = async () => {
      try {
        const response = await axios.get(`http://localhost:5017/api/imagem-cultura/get-all-by-cultura/${idCultura}`);
        setFotos(response.data.imagens || []); // Ajustado conforme retorno da API
      } catch (error) {
        console.error("Erro ao carregar fotos:", error.response?.data || error.message);
      }
    };

    const verificarPermissao = async () => {
      try {
        const culturaRes = await axios.get(`http://localhost:5017/api/cultura/${idCultura}`);
        const cultura = culturaRes.data.cultura;

        if (cultura.idUsuarioOng && tipoUsuario === "entidade" && cultura.idUsuarioOng.toString() === idUsuarioLogado) {
          setMostrarBotaoAdicionar(true);
        }
      } catch (error) {
        console.error("Erro ao verificar permissão:", error.response?.data || error.message);
      }
    };

    fetchFotos();
    verificarPermissao();
  }, [idCultura, idUsuarioLogado, tipoUsuario]);

  const handleFileChange = (e) => {
    setNovaImagem(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!novaImagem) {
      alert("Selecione uma imagem primeiro.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("Imagem", novaImagem);

      const uploadRes = await axios.post(
        "http://localhost:5017/api/imagem-cultura/upload-imagem",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const diretorioImagem = uploadRes.data?.caminho || uploadRes.data;

      await axios.post("http://localhost:5017/api/imagem-cultura/create", {
        diretorioImagem,
        idCultura: parseInt(idCultura),
      });

      // Atualiza a lista de fotos
      const fotosRes = await axios.get(`http://localhost:5017/api/imagem-cultura/get-all-by-cultura/${idCultura}`);
      setFotos(fotosRes.data.imagens || []); // Corrigido aqui também
      setNovaImagem(null);
      alert("Imagem adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error.response?.data || error.message);
      alert("Erro ao adicionar imagem.");
    }
  };

  return (
    <div className="">
      <h2 className="text-center mb-4">Galeria de Fotos</h2>

      {mostrarBotaoAdicionar && (
        <div className="mb-4 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="form-control mb-2"
            style={{ maxWidth: "300px", margin: "0 auto" }}
          />
          <button className="btn btn-primary" onClick={handleUpload}>
            Adicionar Nova Foto
          </button>
        </div>
      )}

      <div className="row">
        {fotos.length === 0 ? (
          <div className="alert alert-info text-center">Nenhuma foto cadastrada.</div>
        ) : (
          fotos.map((foto, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <img
                  src={foto.diretorioImagem}
                  className="card-img-top"
                  alt={`Foto ${index + 1}`}
                  style={{ maxHeight: "250px", objectFit: "cover" }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
