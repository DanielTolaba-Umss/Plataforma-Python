import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "../paginas/docente/Dashboard";
import GestionCursos from "../paginas/docente/GestionCursos/GestionCursos";

export default function RutasDocente() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Gestion de cursos" element={<GestionCursos />} />
        {/* Aquí puedes añadir más rutas si es necesario */}
      </Routes>
    </>
  );
}
