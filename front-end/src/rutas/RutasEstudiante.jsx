import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../paginas/estudiante/Dashboard";
import Cursos from "../paginas/estudiante/Cursos";
import PerfilEstudiante from "../paginas/estudiante/PerfilEstudiante";
import ConfiguracionEstudiante from "../paginas/estudiante/ConfiguracionEstudiante";
// import "./App.css";

const RutasEstudiante = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/cursos" element={<Cursos />} />
      <Route path="/perfil" element={<PerfilEstudiante />} />
      <Route path="/configuracion" element={<ConfiguracionEstudiante />} />
    </Routes>
  );
};

export default RutasEstudiante;
