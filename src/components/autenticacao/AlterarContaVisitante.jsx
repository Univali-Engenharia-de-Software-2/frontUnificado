import React, { useState, useEffect } from "react";
import axios from "axios";
import "./alterarConta.css";

function formatCpf(value) {
  const onlyNumbers = value.replace(/\D/g, "");
  return onlyNumbers
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
    .slice(0, 14);
}

export default function AlterarContaVisitante() {
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    imagem: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const id = localStorage.getItem("id");
      if (!id) {
        alert("ID do usuário não encontrado.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5017/api/usuario-visitante/${id}`);
        const data = response.data.usuario;
        setForm({
          nome: data.nome || "",
          cpf: formatCpf(data.cpf || ""),
          email: data.email || "",
          senha: "", // nunca mostrar senha real
          imagem: null,
        });
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        alert("Erro ao carregar dados do usuário.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "cpf") {
      setForm((prev) => ({ ...prev, cpf: formatCpf(value) }));
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

    const id = localStorage.getItem("id");
    if (!id) {
      alert("ID do usuário não encontrado.");
      return;
    }

    const cpfLimpo = form.cpf.replace(/\D/g, "");

    // Validações básicas
    if (form.nome && !form.nome.trim()) {
      alert("Informe um nome válido.");
      return;
    }
    if (form.email && !form.email.includes("@")) {
      alert("E-mail inválido.");
      return;
    }
    if (form.senha && form.senha.length > 0 && form.senha.length < 6) {
      alert("Senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (form.cpf && cpfLimpo.length !== 11) {
      alert("CPF deve ter 11 dígitos.");
      return;
    }

    try {
      let diretorioImagem = "";

      if (form.imagem) {
        const imagemData = new FormData();
        imagemData.append("Imagem", form.imagem);

        const response = await axios.post(
          "http://localhost:5017/api/imagem-perfil/upload-imagem",
          imagemData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        diretorioImagem =
          typeof response.data === "string"
            ? response.data
            : response.data.caminho;
      }

      const payload = {};
      if (form.nome) payload.nome = form.nome;
      if (form.email) payload.email = form.email;
      if (form.senha) payload.senha = form.senha;
      if (form.cpf) payload.cpf = cpfLimpo;
      if (diretorioImagem) payload.diretorioImagem = diretorioImagem;

      await axios.put(`http://localhost:5017/api/usuario-visitante/update/${id}`, payload);

      alert("Dados atualizados com sucesso!");

    } catch (error) {
      console.error("Erro ao atualizar dados:", error.response?.data || error.message);
      alert("Erro ao atualizar dados.");
    }
  };

  if (loading) return <p>Carregando dados do usuário...</p>;

  return (
    <div className="pagina-alterar-conta">
      <form onSubmit={handleSubmit} autoComplete="off">
        <h2>Atualize seus dados</h2>

        <label>Foto (opcional)</label>
        <input
          type="file"
          name="imagem"
          onChange={handleFile}
          autoComplete="off"
        />

        <label>Nome</label>
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
          autoComplete="off"
        />

        <label>CPF</label>
        <input
          type="text"
          name="cpf"
          placeholder="000.000.000-00"
          maxLength={14}
          value={form.cpf}
          onChange={handleChange}
          autoComplete="off"
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          autoComplete="off"
        />

        <label>Senha</label>
        <input
          type="password"
          name="senha"
          placeholder="Nova senha"
          value={form.senha}
          onChange={handleChange}
          autoComplete="new-password"
        />

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}
