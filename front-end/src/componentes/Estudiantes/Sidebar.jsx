// src/componentes/Estudiantes/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { cursosAPI } from "/src/api/courseService";
import "/src/componentes/Estudiantes/Sidebar.css";
import { LayoutDashboard, BookOpen, GraduationCap } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isCursosOpen, setIsCursosOpen] = useState(false);
  const [niveles, setNiveles] = useState([]);
  // Extraer el ID del nivel de la URL
  const nivelIdActivo = location.pathname.split("/")[2];

  useEffect(() => {
    if (location.pathname.startsWith("/cursos")) {
      setIsCursosOpen(true);
    } else {
      setIsCursosOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isCursosOpen) {
      cursosAPI
        .obtenerTodos()
        .then((res) => {
          setNiveles(res.data);
        })
        .catch((err) => console.error("Error al obtener niveles:", err));
    }
  }, [isCursosOpen]);

  const toggleCursos = () => {
    setIsCursosOpen(!isCursosOpen);
  };

  // Modifica la función handleNivelClick en tu Sidebar.jsx
  const handleNivelClick = (nivel) => {
    localStorage.setItem("nivel", JSON.stringify(nivel));
    navigate(`/cursos/${nivel.id}/lecciones`, { state: { nivel } });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">Python EDU</div>
      <nav className="sidebar-nav">
        <NavLink to="/" className="sidebar-link">
          <LayoutDashboard className="sidebar-icon" /> Dashboard
        </NavLink>

        <div
          onClick={toggleCursos}
          className={`sidebar-link sidebar-link-static ${
            isCursosOpen ? "active" : ""
          }`}
        >
          <BookOpen className="sidebar-icon" />
          Cursos
        </div>

        {isCursosOpen && (
          <div className="submenu">
            {niveles.map((nivel) => (
              <button
                key={nivel.id}
                className={`sidebar-sublink ${
                  nivelIdActivo === nivel.id.toString() ? "active" : ""
                }`}
                onClick={() => handleNivelClick(nivel)}
              >
                {nivel.title}
              </button>
            ))}
          </div>
        )}

        <NavLink to="/perfil" className="sidebar-link">
          <GraduationCap className="sidebar-icon" /> Perfil
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
