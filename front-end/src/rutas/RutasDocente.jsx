import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "../paginas/docente/Dashboard";
import GestionCurso from "../paginas/docente/GestionCursos/GestionCurso";
import CrearExamen from "../paginas/docente/GestionCursos/CrearExamen";
import CrearPdf from "../paginas/docente/GestionCursos/CrearPdf";
import GestionLecciones from "../paginas/docente/GestionCursos/GestionLecciones";
import Recursos from "../paginas/docente/Recursos";
import ExamenesyQuizzes from "../paginas/docente/GestionCursos/ExamenesyQuizzes";
import CrearQuizz from "../paginas/docente/GestionCursos/CrearQuizz";
export default function RutasDocente() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/gestion-curso" element={<GestionCurso />} />
        <Route
          path="/gestion-curso/lecciones/:courseId"
          element={<GestionLecciones />}
        />
        <Route
          path="/gestion-curso/lecciones/:courseId/recursos"
          element={<Recursos />}
        />
        <Route path="/crear-examen" element={<CrearExamen />} />
        <Route path="/crear-pdf" element={<CrearPdf />} />
        <Route path="/gestion-curso/lecciones/:courseId/examenes-y-quizzes" element={<ExamenesyQuizzes />} />
        <Route path="/crear-quizz" element={<CrearQuizz />} />

      </Routes>
    </>
  );
}
