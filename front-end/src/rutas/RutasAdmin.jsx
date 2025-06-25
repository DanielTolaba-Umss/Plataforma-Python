import { BrowserRouter, Routes, Route } from "react-router-dom";

import StudentList from "../componentes/especificos/StudentList";
import TeacherList from "../componentes/especificos/TeacherList";
import AdminDashboard from "../componentes/especificos/AdminDashboard";
import UserManagement from "../componentes/especificos/UsuarioManagement";

export default function RutasAdmin() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/docentes" element={<TeacherList />} />
        <Route path="/estudiantes" element={<StudentList />} />
        <Route path="/gestion-usuarios" element={<UserManagement />} />
        {/* Aquí puedes añadir más rutas si es necesario */}
      </Routes>
    </>
  );
}
