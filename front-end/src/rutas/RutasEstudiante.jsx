import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../paginas/estudiante/Dashboard";
import Cursos from "../paginas/estudiante/Cursos";
import Lecciones from "../paginas/estudiante/Cursos/cursos/Lecciones";
import PerfilEstudiante from "../paginas/estudiante/PerfilEstudiante";
import Quiz from "../paginas/estudiante/Cursos/cursos/Quiz";
import Prueba from "../paginas/estudiante/Prueba";
import RealizarQuiz from "../paginas/estudiante/Cursos/cursos/RealizarQuiz";

const RutasEstudiante = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/cursos" element={<Cursos />} />
      {/* Ruta de lecciones */}
      <Route path="/cursos/:id/lecciones" element={<Lecciones />} />
      <Route path="/cursos/:id/lecciones/Practica" element={<Prueba />} />
      <Route path="/perfil" element={<PerfilEstudiante />} />
      <Route path="/cursos/:courseId/lecciones/quiz" element={<Quiz />} />
      <Route
        path="/cursos/:courseId/lecciones/realizar-quiz/:quizId"
        element={<RealizarQuiz />}
      />
    </Routes>
  );
};

export default RutasEstudiante;
