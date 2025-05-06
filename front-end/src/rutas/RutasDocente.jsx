import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "../paginas/docente/Dashboard";
import GestionCursos from "../paginas/docente/GestionCursos/GestionCursos";
import GestionCurso from "../paginas/docente/GestionCursos/GestionCurso";
import CrearExamen from "../paginas/docente/GestionCursos/CrearExamen";

export default function RutasDocente() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Gestion de cursos" element={<GestionCursos />} />
        <Route path="/Gestion-Cursos" element={<GestionCurso />} />
        <Route path="/crear-examen" element={<CrearExamen />} />
        {/* Aquí puedes añadir más rutas si es necesario */}
      </Routes>
    </>
  );
}
