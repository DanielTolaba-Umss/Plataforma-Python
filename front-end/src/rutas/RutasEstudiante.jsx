import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Lecciones from "../paginas/estudiante/Cursos/cursos/Lecciones";
import PerfilEstudiante from "../paginas/estudiante/PerfilEstudiante";
import Quiz from "../paginas/estudiante/Cursos/cursos/Quiz";
import Prueba from "../paginas/estudiante/Prueba";
import RealizarQuiz from "../paginas/estudiante/Cursos/cursos/RealizarQuiz";

const RutasEstudiante = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/perfil" replace />} />
      {/* Ruta de lecciones */}
      <Route path="/cursos/:id/lecciones" element={<Lecciones />} />
      <Route
        path="/cursos/:courseId/lecciones/:lessonId/practica"
        element={<Prueba />}
      />
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
