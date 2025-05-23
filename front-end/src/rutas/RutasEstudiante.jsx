import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../paginas/estudiante/Dashboard";
import Cursos from "../paginas/estudiante/Cursos";
import CursosBasico from "../paginas/estudiante/Cursos/cursos/CursosBasico";
import CursosIntermedio from "../paginas/estudiante/Cursos/cursos/CursosIntermedio";
import CursosAvanzado from "../paginas/estudiante/Cursos/cursos/CursosAvanzado";
import PerfilEstudiante from "../paginas/estudiante/PerfilEstudiante";
// import "./App.css";

const RutasEstudiante = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/cursos" element={<Cursos />} />
      <Route path="/cursos/basico" element={<CursosBasico />} />
      <Route path="/cursos/intermedio" element={<CursosIntermedio />} />
      <Route path="/cursos/avanzado" element={<CursosAvanzado />} />
      <Route path="/perfil" element={<PerfilEstudiante />} />
    </Routes>
  );
};

export default RutasEstudiante;
