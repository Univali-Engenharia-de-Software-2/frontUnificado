import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import SaibaMais from "./components/saibaMais";
import Login from "./components/autenticacao/Login";
import CadastroUsuario from "./components/autenticacao/CadastroUsuario";
import CadastroEntidade from "./components/autenticacao/CadastroEntidade";
import PaginaPrincipal from "./components/home/paginaPrincipal";
import Editar from "./components/paginas/Editar";
import NovaCultura from "./components/paginas/NovaCultura";
import Visualizacao from "./components/paginas/Visualizacao";
import AlterarContaEntidade from "./components/autenticacao/AlterarContaEntidade";
import AlterarContaVisitante from "./components/autenticacao/AlterarContaVisitante";
import Calendario from "./components/calendario/Calendario";
import Fotos from "./components/fotos/Fotos";
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
          <Route path="/novaCultura" element={<NovaCultura />} />
          <Route path="/visualizacao" element={<Visualizacao />} />
          <Route path="/atcontaentidade" element={<AlterarContaEntidade />} />
          <Route path="/atcontavisitante" element={<AlterarContaVisitante />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/fotos" element={<Fotos />} />
        </Routes>
      </Router>
    </CategoriaProvider>
  );
}

export default App;
