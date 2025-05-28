import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../paginas/estudiante/Dashboard";
import Cursos from "../paginas/estudiante/Cursos";
import Lecciones from "../paginas/estudiante/Cursos/cursos/Lecciones";
import PerfilEstudiante from "../paginas/estudiante/PerfilEstudiante";
// import "./App.css";

const RutasEstudiante = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/cursos" element={<Cursos />} />
      <Route path="/cursos/:nivelId" element={<Lecciones />} />
      <Route path="/perfil" element={<PerfilEstudiante />} />
    </Routes>
  );
};

export default RutasEstudiante;
