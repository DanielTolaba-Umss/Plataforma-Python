import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "../paginas/docente/Dashboard";
import GestionCurso from "../paginas/docente/GestionCursos/GestionCurso";
import CrearExamen from "../paginas/docente/GestionCursos/CrearExamen";
import CrearPdf from "../paginas/docente/GestionCursos/CrearPdf";
import CrearPractica from "../paginas/docente/GestionCursos/CrearPractica"; 

export default function RutasDocente() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/gestion-curso" element={<GestionCurso />} />
        <Route path="/crear-examen" element={<CrearExamen />} />
        <Route path="/crear-pdf" element={<CrearPdf />} />
        <Route path="/crear-practica" element={<CrearPractica />} /> 
      </Routes>
    </>
  );
}