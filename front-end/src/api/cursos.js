import api from "./configuracion";

export const cursosAPI = {
  obtenerTodos: () => api.get("/courses"),
  obtenerPorId: (id) => api.get(`/courses/${id}`),
  crear: (curso) => api.post("/courses", curso),
  actualizar: (id, curso) => api.put(`/courses/${id}`, curso),
  eliminar: (id) => api.delete(`/courses/${id}`),
  obtenerPorModulo: (modulo) => api.get(`/courses/module/${modulo}`),
  crearVideo: (resources) => api.post("/resources", resources),
};
