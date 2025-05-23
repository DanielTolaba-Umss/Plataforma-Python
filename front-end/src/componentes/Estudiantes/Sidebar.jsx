// src/componentes/Estudiantes/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "/src/componentes/Estudiantes/Sidebar.css";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Settings,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const [isCursosOpen, setIsCursosOpen] = useState(false);

  // Abrir el submenú si ya estás en una ruta de cursos
  useEffect(() => {
    if (location.pathname.startsWith("/cursos")) {
      setIsCursosOpen(true);
    } else {
      setIsCursosOpen(false); // Cierra si te vas a otra ruta
    }
  }, [location.pathname]);

  const toggleCursos = () => {
    setIsCursosOpen(!isCursosOpen);
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
            <NavLink to="/cursos/basico" className="sidebar-sublink">
              Básico
            </NavLink>
            <NavLink to="/cursos/intermedio" className="sidebar-sublink">
              Intermedio
            </NavLink>
            <NavLink to="/cursos/avanzado" className="sidebar-sublink">
              Avanzado
            </NavLink>
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
