// src/componentes/layouts/Sidebar.jsx
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../../style/LayoutDocente.css";
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
        <NavLink to="/Gestion de Cursos" className="sidebar-link">
          <BookOpen className="sidebar-icon" /> Módulos
        </NavLink>
        <NavLink to="/Gestion-Cursos" className="sidebar-link">
          <BookOpen className="sidebar-icon" /> Gestion Cursos
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
