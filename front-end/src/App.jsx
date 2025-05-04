import AppRutas from "./rutas/RutasDocente";
import Sidebar from "./componentes/layout/LayoutDocente";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <>
      <div
        className="contenedorPrincipal"
        style={{ display: "flex", justifyContent: "flex-start" }}
      >
        <Sidebar />
        <AppRutas />
      </div>
    </>
  );
}

export default App;