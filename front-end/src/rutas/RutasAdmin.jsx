import { BrowserRouter, Routes, Route } from "react-router-dom";

import StudentList from "../componentes/especificos/StudentList";
import TeacherList from "../componentes/especificos/TeacherList";

export default function RutasAdmin() {
  return (
    <>
      <Routes>
        <Route path="/" element={<TeacherList />} />
        <Route path="/Lista-Estudiantes" element={<StudentList />} />
        {/* Aquí puedes añadir más rutas si es necesario */}
      </Routes>
    </>
  );
}
