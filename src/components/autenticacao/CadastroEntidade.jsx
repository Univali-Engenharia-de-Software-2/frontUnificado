import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

export default function CadastroEntidade() {
  const [estados, setEstados] = useState([]);

  const [cidades, setCidades] = useState([]);

  const [formData, setFormData] = useState({ 
    nome: '',
    email: '',
    senha: '',
    foto: null,
    telefone: '',
    cpfcnpj: '',
    descricao: '',
    endereco: { rua:'', numero:'', bairro:'', cidade:'', estado:'' }
  });

  const [errors, setErrors] = useState({});

  // Busca a lista de estados ao carregar o componente
  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then((res) => res.json()) 
      .then((data) => setEstados(data)); 
  }, []);

  // Busca a lista de cidades toda vez que o estado é atualizado
  useEffect(() => {
    if (formData.endereco.estado) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.endereco.estado}/municipios`)
        .then((res) => res.json()) 
        .then((data) => setCidades(data)); 
    }
  }, [formData.endereco.estado]);

  // Handle para alteração de campos simples
  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };
  
  // Handle para alteração de foto
  const handleFile = (e) => {
    setFormData({ 
      ...formData, 
      foto: e.target.files[0] 
    });
  };
  
  // Handle para alteração de campos de endereco
  const handleEndereco = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      endereco: { 
        ...prev.endereco, 
        [name]: value 
      }
    }))
  };
  
  // Handle para envio do formulário
  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = {};

    if (formData.nome.trim() === '') {
      newErrors.nome = "Informe o nome da entidade.";
    }
    if (!formData.email.includes('@')) {
      newErrors.email = "E-mail inválido.";
    }
    if (formData.telefone.trim() === '') {
      newErrors.telefone = "Informe o telefone.";
    }
    if (formData.descricao.trim() === '') {
      newErrors.descricao = "Informe a descrição.";
    }
    if (formData.senha.length < 6) {
      newErrors.senha = "Senha deve ter no mínimo 6 caracteres.";
    }
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

    if (!cpfRegex.test(formData.cpfcnpj) && !cnpjRegex.test(formData.cpfcnpj)) {
      newErrors.cpfcnpj = "CPF ou CNPJ inválido.";
    }
  
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert("Cadastro de entidade válido!");
    }
  };

  return (
    <div className="auth-container">
      <h2>Cadastro de Entidade</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Foto */}
        <label htmlFor="foto">Foto</label>
        <input id="foto" type="file" onChange={handleFile} />

        {/* Outros campos controlados pelo handleChange */}
        <label htmlFor="nome">Nome da Entidade</label>
        <input id="nome" name="nome" onChange={handleChange} />
        {errors.nome && <small className="text-danger">{errors.nome}</small>}

        <label htmlFor="cpfcnpj">CPF/CNPJ</label>
        <input id="cpfcnpj" name="cpfcnpj" onChange={handleChange} />
        {errors.cpfcnpj && <small className="text-danger">{errors.cpfcnpj}</small>}

        <label htmlFor="email">E-mail</label>
        <input id="email" name="email" onChange={handleChange} />
        {errors.email && <small className="text-danger">{errors.email}</small>}

        <label htmlFor="telefone">Telefone</label>
        <input id="telefone" name="telefone" onChange={handleChange} />
        {errors.telefone && <small className="text-danger">{errors.telefone}</small>}

        <label htmlFor="descricao">Descrição</label>
        <textarea id="descricao" name="descricao" onChange={handleChange}></textarea>
        {errors.descricao && <small className="text-danger">{errors.descricao}</small>}

        <label htmlFor="senha">Senha</label>
        <input id="senha" name="senha" onChange={handleChange} type="password" />
        {errors.senha && <small className="text-danger">{errors.senha}</small>}

        {/* Agora o handleEndereco controla o objeto endereco */}
        <label htmlFor="rua">Rua</label>
        <input id="rua" name="rua" onChange={handleEndereco} />

        <label htmlFor="numero">Número</label>
        <input id="numero" name="numero" onChange={handleEndereco} />

        <label htmlFor="bairro">Bairro</label>
        <input id="bairro" name="bairro" onChange={handleEndereco} />

        <label htmlFor="estado">Estado</label>
        <select id="estado" name="estado" onChange={handleEndereco}>
          <option value="">Selecione um estado</option>
          {estados?.map((uf) => (
            <option key={uf.id} value={uf.sigla}>
              {uf.nome}
            </option>
          ))}
        </select>

        <label htmlFor="cidade">Cidade</label>
        <select id="cidade" name="cidade" onChange={handleEndereco}>
          <option value="">Selecione uma cidade</option>
          {cidades?.map((cidade) => (
            <option key={cidade.id} value={cidade.nome}>
              {cidade.nome}
            </option>
          ))}
        </select>

        <button type="submit" className="btn btn-primary">
          Cadastrar
        </button>
      </form>

      <div className="text-center mt-4">
        <p>Não possui uma conta?</p>
        <Link to="/login" className="btn btn-outline-primary btn-sm mx-1">
          Login
        </Link>
        <Link to="/cadastro-usuario" className="btn btn-outline-primary btn-sm mx-1">
          Cadastrar Usuário
        </Link>
      </div>
    </div>
  )
}

