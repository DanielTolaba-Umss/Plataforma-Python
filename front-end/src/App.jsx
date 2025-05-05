import React, { useState } from "react";
import AppDocente from "./AppDocente";
import AppAdmin from "./AppAdmin";
import AppEstudiante from "./AppEstudiante";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [vista, setVista] = useState(null); // 'admin' | 'docente' | 'estudiante' | null

  const manejarVista = (tipo) => {
    setVista(tipo);
  };

  const volver = () => {
    setVista(null);
  };

  if (vista === "admin") {
    return (
      <div>
        <button onClick={volver}>← Volver</button>
        <AppAdmin />
      </div>
    );
  }

  if (vista === "docente") {
    return (
      <div>
        <button onClick={volver}>← Volver</button>
        <AppDocente />
      </div>
    );
  }

  if (vista === "estudiante") {
    return (
      <div>
        <button onClick={volver}>← Volver</button>
        <AppEstudiante />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Bienvenido</h1>
      <button onClick={() => manejarVista("admin")} style={{ margin: "10px" }}>
        Entrar como Admin
      </button>
      <button
        onClick={() => manejarVista("docente")}
        style={{ margin: "10px" }}
      >
        Entrar como Docente
      </button>
      <button
        onClick={() => manejarVista("estudiante")}
        style={{ margin: "10px" }}
      >
        Entrar como Estudiante
      </button>
    </div>
  );
}

export default App;
