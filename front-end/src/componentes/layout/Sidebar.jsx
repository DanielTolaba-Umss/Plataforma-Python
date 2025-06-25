// src/componentes/layouts/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import "/src/estilos/Sidebar.css";
import {
  LayoutDashboard,
  Users,
  Settings,
} from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">Python EDU</div>
      <nav className="sidebar-nav">
        <NavLink to="/" className="sidebar-link">
          <LayoutDashboard className="sidebar-icon" /> Dashboard
        </NavLink>        <NavLink to="/gestion-usuarios" className="sidebar-link">
          <Users className="sidebar-icon" /> Gestión de Usuarios
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
