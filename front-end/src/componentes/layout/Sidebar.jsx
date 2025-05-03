// src/componentes/layouts/Sidebar.jsx
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "/src/estilos/Sidebar.css";
import {
  LayoutDashboard,
  BookOpen,
  Users,
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
        <NavLink to="/Lista-Modulos" className="sidebar-link">
          <BookOpen className="sidebar-icon" /> Módulos
        </NavLink>
        <NavLink to="/Lista-Profesores" className="sidebar-link">
          <Users className="sidebar-icon" /> Docentes
        </NavLink>
        <NavLink to="/Lista-Estudiantes" className="sidebar-link">
          <GraduationCap className="sidebar-icon" /> Estudiantes
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
