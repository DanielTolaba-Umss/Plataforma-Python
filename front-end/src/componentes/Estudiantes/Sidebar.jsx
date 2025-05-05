// src/componentes/Estudiantes/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import "/src/componentes/Estudiantes/Sidebar.css";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Settings,
} from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">Python EDU</div>
      <nav className="sidebar-nav">
        <NavLink to="/" className="sidebar-link">
          <LayoutDashboard className="sidebar-icon" /> Dashboard
        </NavLink>
        <NavLink to="/cursos" className="sidebar-link">
          <BookOpen className="sidebar-icon" />
          Cursos
        </NavLink>
        <NavLink to="/perfil" className="sidebar-link">
          <GraduationCap className="sidebar-icon" /> Perfil Estudiante
        </NavLink>
        <NavLink to="/configuracion" className="sidebar-link">
          <Settings className="sidebar-icon" /> Configuración
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
