import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AppDocente from "./AppDocente";
import AppAdmin from "./AppAdmin";
import AppEstudiante from "./AppEstudiante";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/LoginStyles.css";
import { useAuth } from "./hooks/useAuth";
import { PythonLogo } from "./components/PythonLogo";
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from "./components/Icons";

function App() {
  const [vista, setVista] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, loading, login, logout } = useAuth();

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

  const handleLogin = async (e) => {
    e.preventDefault();
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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const volver = () => {
    logout();
    setVista(null);
    setEmail("");
    setPassword("");
    setError("");
    navigate("/");
  };

  // Generate random floating elements
  const generateFloatingElements = () => {
    return Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="code-snippet"
        style={{
          width: `${Math.random() * 200 + 100}px`,
          height: `${Math.random() * 80 + 40}px`,
          top: `${Math.random() * 80}%`,
          left: `${Math.random() * 80}%`,
          opacity: Math.random() * 0.2 + 0.05,
          transform: `rotate(${Math.random() * 20 - 10}deg)`,
        }}
      >
        <div className="snippet-line-1"></div>
        <div className="snippet-line-2"></div>
        <div className="snippet-line-3"></div>
        <div className="snippet-line-4"></div>
      </div>
    ));
  };

  const generateParticles = () => {
    return Array.from({ length: 20 }).map((_, i) => (
      <div
        key={i}
        className="particle"
        style={{
          width: `${Math.random() * 4 + 1}px`,
          height: `${Math.random() * 4 + 1}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          backgroundColor: Math.random() > 0.5 ? 'rgba(255,212,56,0.8)' : 'white',
          opacity: Math.random() * 0.5 + 0.3,
          animationDuration: `${Math.random() * 10 + 20}s`,
        }}
      />
    ));
  };

  if (vista) {
    return (
      <div className="app-container">
        <button onClick={volver} className="back-button">
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
    <div className="login-container">
      {/* Background Elements */}
      <div className="background-wrapper">
        <div className="base-gradient" />
        <div className="code-grid" />
        
        <div className="abstract-elements">
          {/* 3D cube wireframes */}
          <svg className="cube-wireframe-1" viewBox="0 0 100 100">
            <path
              d="M30,30 L70,10 L70,70 L30,90 Z"
              stroke="rgba(255,212,56,0.8)"
              fill="none"
              strokeWidth="0.5"
            />
            <path
              d="M30,30 L70,10 M30,90 L70,70 M30,30 L30,90 M70,10 L70,70"
              stroke="rgba(255,212,56,0.8)"
              fill="none"
              strokeWidth="0.5"
            />
          </svg>
          <svg className="cube-wireframe-2" viewBox="0 0 100 100">
            <path
              d="M20,40 L80,20 L80,80 L20,60 Z"
              stroke="white"
              fill="none"
              strokeWidth="0.5"
            />
            <path
              d="M20,40 L80,20 M20,60 L80,80 M20,40 L20,60 M80,20 L80,80"
              stroke="white"
              fill="none"
              strokeWidth="0.5"
            />
          </svg>
        </div>

        <div className="floating-snippets">
          {generateFloatingElements()}
        </div>

        <div className="light-rays">
          <div className="light-ray-1"></div>
          <div className="light-ray-2"></div>
        </div>

        <div className="animated-particles">
          {generateParticles()}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Left side - Visual branding area */}
        <div className="branding-section">
          <div className="branding-content">
            <div className="logo-container">
              <PythonLogo />
            </div>
            <h1 className="main-title">
              PyLearn<span className="academy-highlight">Academy</span>
            </h1>
            <p className="subtitle">
              Domina Python con nuestra plataforma de aprendizaje inmersiva y práctica
            </p>
            
            <div className="decorative-elements">
              <div className="decorative-icon">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10,50 L90,50"
                    stroke="rgba(255,212,56,0.3)"
                    strokeWidth="1"
                  />
                  <path
                    d="M50,10 L50,90"
                    stroke="rgba(255,212,56,0.3)"
                    strokeWidth="1"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="rgba(255,212,56,0.3)"
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>
              </div>
              <div className="dots-container">
                <div className="dot dot-1"></div>
                <div className="dot dot-2"></div>
                <div className="dot dot-3"></div>
              </div>
            </div>
          </div>

          {/* Mobile login form */}
          <div className="mobile-login">
            <form onSubmit={handleLogin} className="mobile-form">
              <LoginFormFields
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                toggleShowPassword={toggleShowPassword}
                error={error}
              />
            </form>
          </div>
        </div>

        {/* Right side - Login form area */}
        <div className="login-section">
          <div className="login-gradient"></div>
          <div className="form-container">
            <div className="form-header">
              <h2 className="form-title">Bienvenido</h2>
              <p className="form-subtitle">Ingresa tus credenciales para continuar</p>
            </div>
            <form onSubmit={handleLogin} className="login-form">
              <LoginFormFields
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                toggleShowPassword={toggleShowPassword}
                error={error}
              />
            </form>
            
            <div className="bottom-decorative">
              <div className="decorative-line"></div>
              <div className="decorative-circle">
                <div className="decorative-dot"></div>
              </div>
              <div className="decorative-line"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="floating-bottom-left">
        <div className="version-indicator">
          <div className="version-bar"></div>
          <div className="version-text">Python 3.10+</div>
        </div>
      </div>
      <div className="floating-top-right">
        <div className="status-indicator">
          <div className="status-dot"></div>
          <div className="status-text">Plataforma en vivo</div>
        </div>
      </div>
    </div>
  );
}

// Form fields component for reuse between mobile and desktop layouts
function LoginFormFields({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  toggleShowPassword,
  error
}) {
  return (
    <>
      <div className="form-field">
        <div className="field-label">
          <MailIcon size={16} className="label-icon" />
          <label htmlFor="email" className="label-text">
            Correo electrónico
          </label>
        </div>
        <div className="input-container">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            placeholder="nombre@ejemplo.com"
          />
        </div>
      </div>
      
      <div className="form-field">
        <div className="field-label">
          <LockIcon size={16} className="label-icon" />
          <label htmlFor="password" className="label-text">
            Contraseña
          </label>
        </div>
        <div className="input-container">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input password-input"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="password-toggle"
          >
            {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
          </button>
        </div>
      </div>
      
      <div className="forgot-password">
        <a href="#" className="forgot-link">
          ¿Olvidaste tu contraseña?
        </a>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div>
        <button type="submit" className="submit-button">
          <span className="button-text">Iniciar sesión</span>
          <span className="button-effect-1"></span>
          <span className="button-effect-2"></span>
        </button>
      </div>
    </>
  );
}

export default App;
