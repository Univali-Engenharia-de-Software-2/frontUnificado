import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Fotos() {
  const [fotos, setFotos] = useState([]);
  const [novaImagem, setNovaImagem] = useState(null);
  const [mostrarBotaoAdicionar, setMostrarBotaoAdicionar] = useState(false);
  const [imagemPreview, setImagemPreview] = useState(null);

  const idCultura = localStorage.getItem("idCulturaSelecionada");
  const idUsuarioLogado = localStorage.getItem("id");
  const tipoUsuario = localStorage.getItem("tipoUsuario");

  useEffect(() => {
    const fetchFotos = async () => {
      try {
        const response = await axios.get(`http://localhost:5017/api/imagem-cultura/get-all-by-cultura/${idCultura}`);
        setFotos(response.data.imagens || []);
      } catch (error) {
        console.error("Erro ao carregar fotos:", error.response?.data || error.message);
      }
    };

    const verificarPermissao = async () => {
      try {
        const culturaRes = await axios.get(`http://localhost:5017/api/cultura/${idCultura}`);
        const cultura = culturaRes.data.cultura;

        if (
          cultura.idUsuarioOng &&
          tipoUsuario === "entidade" &&
          cultura.idUsuarioOng.toString() === idUsuarioLogado
        ) {
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
    const file = e.target.files[0];
    setNovaImagem(file);
    setImagemPreview(file ? URL.createObjectURL(file) : null);
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

      const diretorioImagem = uploadRes.data?.caminho;
      if (!diretorioImagem) {
        throw new Error("Erro: Caminho da imagem não retornado pela API.");
      }

      await axios.post("http://localhost:5017/api/imagem-cultura/create", {
        diretorioImagem: diretorioImagem,
        idCultura: parseInt(idCultura),
      });

      const fotosRes = await axios.get(`http://localhost:5017/api/imagem-cultura/get-all-by-cultura/${idCultura}`);
      setFotos(fotosRes.data.imagens || []);
      setNovaImagem(null);
      setImagemPreview(null);
      alert("Imagem adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error.response?.data || error.message);
      alert("Erro ao adicionar imagem.");
    }
  };

  return (
    <div style={{ width: "80vw", margin: "0 auto", padding: "20px" }}>
      <h2 className="text-center mb-4">Galeria de Fotos</h2>

      {mostrarBotaoAdicionar && (
        <div className="mb-4 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="form-control mb-2"
            style={{ maxWidth: "500px", margin: "0 auto" }}
          />
          {imagemPreview && (
            <div className="mb-3">
              <img
                src={imagemPreview}
                alt="Preview"
                style={{ maxWidth: "300px", maxHeight: "200px", objectFit: "cover" }}
              />
            </div>
          )}
          <button className="btn btn-primary" onClick={handleUpload}>
            Adicionar Nova Foto
          </button>
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
      }}>
        {fotos.length === 0 ? (
          <div className="alert alert-info text-center" style={{ gridColumn: "1 / -1" }}>
            Nenhuma foto cadastrada.
          </div>
        ) : (
          fotos.map((foto, index) => (
            <div key={index} style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
              <img
                src={`http://localhost:5017/${foto.diretorio}`}
                alt={`Foto ${index + 1}`}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
