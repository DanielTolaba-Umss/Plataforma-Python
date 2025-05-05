import RutasEstudiante from "./rutas/RutasEstudiante";
import Sidebar from "./componentes/Estudiantes/Sidebar";

function AppEstudiante() {
  return (
    <>
      <div
        className="contenedorPrincipal"
        style={{ display: "flex", justifyContent: "flex-start" }}
      >
        <Sidebar />
        <RutasEstudiante />
      </div>
    </>
  );
}

export default AppEstudiante;
