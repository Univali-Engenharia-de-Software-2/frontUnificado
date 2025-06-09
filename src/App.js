import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import SaibaMais from "./components/saibaMais";
import Login from "./components/auth/Login";
import CadastroUsuario from "./components/auth/CadastroUsuario";
import CadastroEntidade from "./components/auth/CadastroEntidade";
import PaginaPrincipal from "./components/paginaPrincipal";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<PaginaPrincipal />} />
        <Route path="/saiba-mais" element={<SaibaMais />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
        <Route path="/cadastro-entidade" element={<CadastroEntidade />} />
      </Routes>
    </Router>
  );
}

export default App;