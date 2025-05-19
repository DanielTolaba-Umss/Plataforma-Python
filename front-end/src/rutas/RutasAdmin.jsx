import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "../paginas/administrador/Dashboard";
import ModuleList from "../componentes/especificos/ModuleList";
//import Dashboard from "../paginas/administrador/Dashboard";
import StudentList from "../componentes/especificos/StudentList";
import TeacherList from "../componentes/especificos/TeacherList";

export default function RutasAdmin() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Lista-Modulos" element={<ModuleList />} />
        
        <Route path="/"element={<StudentList/>}/>
        <Route path="/Lista-Estudiantes" element={<StudentList />} />
        <Route path="/Lista-Profesores" element={<TeacherList />} />
        {/* Aquí puedes añadir más rutas si es necesario */}
      </Routes>
    </>
  );
}
