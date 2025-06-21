import { createContext, useState } from "react";

export const CategoriaContext = createContext();

export const CategoriaProvider = ({ children }) => {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todas");
  const [busca, setBusca] = useState(""); // 👈 Novo estado

  return (
    <CategoriaContext.Provider value={{ categoriaSelecionada, setCategoriaSelecionada, busca, setBusca }}>
      {children}
    </CategoriaContext.Provider>
  );
};
