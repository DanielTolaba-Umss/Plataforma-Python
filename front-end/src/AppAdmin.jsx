import RutasAdmin from "./rutas/RutasAdmin";
import Sidebar from "./componentes/layout/Sidebar";

import "bootstrap/dist/css/bootstrap.min.css";

function AppAdmin() {
  return (
    <>
      <div
        className="contenedorPrincipal"
        style={{ display: "flex", justifyContent: "flex-start" }}
      >
        <Sidebar />
        <RutasAdmin />
      </div>
    </>
  );
}

export default AppAdmin;
