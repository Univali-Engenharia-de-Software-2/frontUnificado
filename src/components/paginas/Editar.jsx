import React, { useEffect } from "react";
import "./visualizarEditar.css";

export default function Editar() {
  useEffect(() => {
    const savedLogo = localStorage.getItem("logo");
    if (savedLogo) {
      document.getElementById("logoPreview").src = savedLogo;
    }

    const input = document.getElementById("logoInput");
    input.addEventListener("change", function () {
      const file = this.files[0];
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("logoPreview").src = e.target.result;
      };
      if (file) reader.readAsDataURL(file);
    });
  }, []);

  const salvarEdicao = () => {
    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;
    const nomegrupo = document.getElementById("nomegrupo").innerText;
    const tipogrupo = document.getElementById("tipogrupo").innerText;

    if (!titulo.trim() || !descricao.trim()) {
      alert("Preencha todos os campos antes de salvar.");
      return;
    }

    localStorage.setItem("titulo", titulo);
    localStorage.setItem("descricao", descricao);
    localStorage.setItem("nomegrupo", nomegrupo);
    localStorage.setItem("tipogrupo", tipogrupo);

    const logo = document.getElementById("logoPreview").src;
    localStorage.setItem("logo", logo);

    alert("Edição salva com sucesso!");
  };

  return (
    <div className="container mt-4">
      <div className="content">
        {" "}
        {/* Área principal flexível */}
        <h1>Editar Grupo</h1>
        <input
          type="text"
          id="titulo"
          defaultValue="Título"
          className="form-control my-2 editable"
        />
        <textarea
          id="descricao"
          className="form-control my-2 editable"
          style={{ resize: "none" }}
          defaultValue=""
        ></textarea>
        <button onClick={salvarEdicao} className="btn btn-primary">
          Salvar
        </button>
      </div>

      <aside className="grupo-sidebar mt-4">
        {" "}
        {/* Aside fixo ao lado */}
        <img
          id="logoPreview"
          className="grupo-img"
          src=""
          alt="Logo do Grupo"
        />
        <input
          type="file"
          id="logoInput"
          accept="image/*"
          className="form-control my-2"
        />
        <h2 contentEditable={true} id="nomegrupo">
          Grupo
        </h2>
        <button className="grupo-btn">EVENTOS</button>
        <button className="grupo-btn">CONTATO</button>
        <button className="grupo-btn">FOTOS</button>
        <div className="grupo-rodape" contentEditable={true} id="tipogrupo">
          ONG
        </div>
      </aside>
    </div>
  );
}
