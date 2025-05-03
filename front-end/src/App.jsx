import AppRutas from "./rutas/AppRutas";
import Sidebar from "./componentes/layout/Sidebar";
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
