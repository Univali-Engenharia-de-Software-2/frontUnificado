import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import SaibaMais from "./components/saibaMais";
import Login from "./components/autenticacao/Login";
import CadastroUsuario from "./components/autenticacao/CadastroUsuario";
import CadastroEntidade from "./components/autenticacao/CadastroEntidade";
import PaginaPrincipal from "./components/home/paginaPrincipal";
import Editar from "./components/paginas/Editar";
import Visualizacao from "./components/paginas/Visualizacao";
import { CategoriaProvider } from "./components/home/categoriaContext";

function App() {
  return (
    <CategoriaProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<PaginaPrincipal />} />
        <Route path="/saiba-mais" element={<SaibaMais />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
        <Route path="/cadastro-entidade" element={<CadastroEntidade />} />
        <Route path="/editar" element={<Editar />} />
        <Route path="/visualizacao" element={<Visualizacao />} />
      </Routes>
    </Router>
    </CategoriaProvider>
  );
}

export default App;
