import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "../paginas/docente/Dashboard";
import GestionCursos from "../paginas/docente/GestionCursos/GestionCursos";
import GestionCurso from "../paginas/docente/GestionCursos/GestionCurso";
import FormularioCrearCurso from "../paginas/docente/GestionCursos/FormularioCrearCurso";

export default function RutasDocente() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Gestion de cursos" element={<GestionCursos />} />
        <Route path="/Gestion-Cursos" element={<GestionCurso />} />

        {/* Aquí puedes añadir más rutas si es necesario */}
      </Routes>
    </>
  );
}
