import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "../paginas/docente/Dashboard";
import GestionCursos from "../paginas/docente/GestionCursos/GestionCursos";
import GestionCurso from "../paginas/docente/GestionCursos/GestionCurso";
import CrearExamen from "../paginas/docente/GestionCursos/CrearExamen";
import CrearPdf from "../paginas/docente/GestionCursos/CrearPdf";

export default function RutasDocente() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/gestion-cursos" element={<GestionCursos />} />
        <Route path="/gestion-curso" element={<GestionCurso />} />
        <Route path="/crear-examen" element={<CrearExamen />} />
        <Route path="/crear-pdf" element={<CrearPdf />} />
      </Routes>
    </>
  );
}
