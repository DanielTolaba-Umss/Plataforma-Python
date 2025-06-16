// src/componentes/layouts/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
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
        <NavLink to="/gestion-curso" className="sidebar-link">
          <BookOpen className="sidebar-icon" /> Cursos
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
