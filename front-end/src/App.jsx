import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AppDocente from "./AppDocente";
import AppAdmin from "./AppAdmin";
import AppEstudiante from "./AppEstudiante";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "./hooks/useAuth"; 

function App() {
  const [vista, setVista] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {user, loading, login, logout} = useAuth();

  useEffect(() => {
    if (user) {
      const rolMapping = {
        'ADMIN': 'admin',
        'TEACHER': 'docente',
        'STUDENT': 'estudiante'
      };
      
      setVista(rolMapping[user.role]);
    }
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    console.log('Token almacenado:', token);
    console.log('Usuario almacenado:', user);
    
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        console.log('Contenido completo del token:', payload);
      } catch (e) {
        console.error('Error al decodificar el token', e);
      }
    }
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  const handleLogin = async () => {
    try {
      const userData = await login(email, password);
      
      const rolMapping = {
        'ADMIN': 'admin',
        'TEACHER': 'docente',
        'STUDENT': 'estudiante'
      };
      
      setVista(rolMapping[userData.role]);
      setError("");
    } catch (err) {
      setError(err.message || "Credenciales incorrectas");
    }
  };


  const volver = () => {
    logout();
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
