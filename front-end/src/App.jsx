import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AppDocente from "./AppDocente";
import AppAdmin from "./AppAdmin";
import AppEstudiante from "./AppEstudiante";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [vista, setVista] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const usuarios = [
    { rol: "admin", email: "admin@edu.com", password: "admin111" },
    { rol: "docente", email: "docente@edu.com", password: "docente222" },
    {
      rol: "estudiante",
      email: "estudiante@edu.com",
      password: "estudiante333",
    },
  ];

  const handleLogin = () => {
    const usuario = usuarios.find(
      (u) => u.email === email && u.password === password
    );

    if (usuario) {
      setVista(usuario.rol);
      setError("");
      navigate("/");
    } else {
      setError("Correo o contraseña incorrectos");
    }
  };

  const volver = () => {
    setVista(null);
    setEmail("");
    setPassword("");
    setError("");
    navigate("/");
  };

  const estiloBotonVolver = {
    position: "fixed",
    bottom: "10px",
    left: "10px",
    padding: "8px 15px",
    backgroundColor: "#FFD438",
    color: "#0c0461fd",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    zIndex: 1000,
    fontWeight: "bold",
  };

  const estiloInput = {
    padding: "10px",
    width: "100%",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  };

  const estiloBotonLogin = {
    padding: "12px 30px",
    backgroundColor: "rgb(48, 61, 204)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s",
    width: "100%",
  };

  if (vista) {
    return (
      <div className="app-container">
        <button onClick={volver} style={estiloBotonVolver}>
          ← Volver al login
        </button>
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
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#0c0461fd",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "50px",
      }}
    >
      {/* Título fuera del formulario */}
      <h1
        style={{
          color: "#FFD438",
          marginBottom: "40px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Bienvenido a Python EDU
      </h1>

      {/* Formulario */}
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "25px",
            color: "#0c0461fd",
          }}
        >
          Iniciar sesión
        </h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={estiloInput}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={estiloInput}
        />
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <button
          onClick={handleLogin}
          style={estiloBotonLogin}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#301dcb")}
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = "rgb(48, 61, 204)")
          }
        >
          Ingresar
        </button>
      </div>
    </div>
  );
}

export default App;
