import RutasDocente from "./rutas/RutasDocente";
import Sidebar from "./componentes/layout/LayoutDocente";

function AppDocente() {
  return (
    <>
      <div
        className="contenedorPrincipal"
        style={{ display: "flex", justifyContent: "flex-start" }}
      >
        <Sidebar />
        <RutasDocente />
      </div>
    </>
  );
}

export default AppDocente;
