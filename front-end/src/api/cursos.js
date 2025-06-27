import api from "./configuracion";

export const cursosAPI = {
  obtenerPorDocenteId: (id) => api.get(`/courses/teachers/${id}`),
  obtenerTodos: () => api.get("/courses"),
  obtenerPorId: (id) => api.get(`/courses/${id}`),
  crear: (curso) => api.post("/courses", curso),
  actualizar: (id, curso) => api.put(`/courses/${id}`, curso),
  eliminar: (id) => api.delete(`/courses/${id}`),
  obtenerPorModulo: (modulo) => api.get(`/courses/module/${modulo}`),
  crearVideo: (resources) => api.post("/resources", resources),
  // Gestión de estudiantes
  asignarEstudiantes: (cursoId, studentIds) => api.post(`/courses/${cursoId}/assign-students`, studentIds),
  obtenerEstudiantesNoAsignados: (cursoId) => api.get(`/courses/${cursoId}/unassigned-students`),
};
