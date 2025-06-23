import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './alterarConta.css';

function formatCpfCnpj(value) {
  const onlyNumbers = value.replace(/\D/g, "");

  if (onlyNumbers.length <= 11) {
    return onlyNumbers
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
      .slice(0, 14);
  } else {
    return onlyNumbers
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5")
      .slice(0, 18);
  }
}

export default function AlterarContaEntidade() {
  const [form, setForm] = useState({
    nome: "",
    cnpj: "",
    email: "",
    senha: "",
    imagem: null,
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      const id = localStorage.getItem("id");
      if (!id) return alert("ID não encontrado.");

      try {
        const res = await axios.get(`http://localhost:5017/api/usuario-ong/${id}`);
        const data = res.data.usuario;
        setForm({
          nome: data.nomeOng || "",
          email: data.email || "",
          cnpj: formatCpfCnpj(data.cnpj || ""),
          senha: "", // não carregar senha real
          imagem: null,
        });
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        alert("Erro ao carregar dados do usuário.");
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cnpj") {
      const formatted = formatCpfCnpj(value);
      setForm((prev) => ({ ...prev, cnpj: formatted }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFile = (e) => {
    setForm((prev) => ({
      ...prev,
      imagem: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const idUsuario = localStorage.getItem("id");
    if (!idUsuario) return alert("ID do usuário não encontrado.");

    try {
      let diretorioImagem = "";

      if (form.imagem) {
        const imagemData = new FormData();
        imagemData.append("Imagem", form.imagem);

        const uploadRes = await axios.post(
          "http://localhost:5017/api/imagem-perfil/upload-imagem",
          imagemData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        diretorioImagem = typeof uploadRes.data === "string"
          ? uploadRes.data
          : uploadRes.data.caminho;
      }

      const payload = {};
      if (form.nome) payload.nome = form.nome;
      if (form.email) payload.email = form.email;
      if (form.senha) payload.senha = form.senha;
      if (form.cnpj) payload.cnpj = form.cnpj.replace(/\D/g, "");
      if (diretorioImagem) payload.diretorioImagem = diretorioImagem;

      await axios.put(`http://localhost:5017/api/usuario-ong/update/${idUsuario}`, payload);

      alert("Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar dados:", error.response?.data || error.message);
      alert("Erro ao atualizar dados.");
    }
  };

  return (
    <div className="pagina-alterar-conta">
      <form onSubmit={handleSubmit}>
        <h2>Alterar Dados da Conta - Entidade</h2>

        <label>Foto da ONG (opcional)</label>
        <input type="file" name="imagem" onChange={handleFile} />

        <label>Nome da ONG</label>
        <input
          type="text"
          name="nome"
          placeholder="Novo nome da ONG"
          value={form.nome}
          onChange={handleChange}
        />

        <label>CPF/CNPJ</label>
        <input
          type="text"
          name="cnpj"
          placeholder="Novo CPF/CNPJ"
          value={form.cnpj}
          onChange={handleChange}
          maxLength={18}
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Novo email"
          value={form.email}
          onChange={handleChange}
        />

        <label>Senha</label>
        <input
          type="password"
          name="senha"
          placeholder="Nova senha"
          value={form.senha}
          onChange={handleChange}
        />

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}
