import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../paginas/estudiante/Dashboard";
import Cursos from "../paginas/estudiante/Cursos";
import Lecciones from "../paginas/estudiante/Cursos/cursos/Lecciones";
import PerfilEstudiante from "../paginas/estudiante/PerfilEstudiante";
import Prueba from "../paginas/estudiante/Prueba";
// import "./App.css";

const RutasEstudiante = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/cursos" element={<Cursos />} />
      // En tu archivo de rutas principal (App.jsx o similar)
      <Route path="/cursos/:id/lecciones" element={<Lecciones />} />
      <Route path="/cursos/:id/lecciones/Practica" element={<Prueba />} />
      <Route path="/perfil" element={<PerfilEstudiante />} />
    </Routes>
  );
};

export default RutasEstudiante;
