import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AppDocente from "./AppDocente";
import AppAdmin from "./AppAdmin";
import AppEstudiante from "./AppEstudiante";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [vista, setVista] = useState(null);
  const navigate = useNavigate();

  const manejarVista = (tipo) => {
    setVista(tipo);
    navigate("/");
  };

  const volver = () => {
    setVista(null);
    navigate("/");
  };

  const estiloBotonVolver = {
    position: "fixed",
    top: "20px",
    left: "20px",
    padding: "8px 15px",
    backgroundColor: "#0f766e",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    gap: "5px",
  };

  const estiloBoton = {
    padding: "15px 30px",
    fontSize: "16px",
    backgroundColor: "#0f766e",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    margin: "10px",
  };

  // Si hay una vista seleccionada, mostrar la aplicación correspondiente
  if (vista) {
    return (
      <div className="app-container">
        <button onClick={volver} style={estiloBotonVolver}>
          ← Volver al inicio
        </button>
        <div className="app-content">
          <Routes>
            <Route
              path="/*"
              element={
                vista === "admin" ? (
                  <AppAdmin />
                ) : vista === "docente" ? (
                  <AppDocente />
                ) : vista === "estudiante" ? (
                  <AppEstudiante />
                ) : null
              }
            />
          </Routes>
        </div>
      </div>
    );
  }

  // Pantalla de selección de rol
  return (
    <div
      style={{
        padding: "20px",
        textAlign: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f3f4f6",
      }}
    >
      <h1>Bienvenido a Python EDU</h1>
      <div>
        <button
          onClick={() => manejarVista("admin")}
          style={estiloBoton}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0a5a52")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#0f766e")}
        >
          Entrar como Admin
        </button>
        <button
          onClick={() => manejarVista("docente")}
          style={estiloBoton}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0a5a52")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#0f766e")}
        >
          Entrar como Docente
        </button>
        <button
          onClick={() => manejarVista("estudiante")}
          style={estiloBoton}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0a5a52")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#0f766e")}
        >
          Entrar como Estudiante
        </button>
      </div>
    </div>
  );
}

export default App;
