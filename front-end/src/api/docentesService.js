import api from "./configuracion";

export const teachersAPI = {
  obtenerTodosDocente: () => api.get('/teachers'),
  obtenerDocentePorId: (id) => api.get(`/teachers/${id}`),
  crearDocente: (teacher) => api.post('/teachers', teacher),
  actualizarDocente: (id, teacher) => api.put(`/teachers/${id}`, teacher),
  eliminarDocente: (id) => api.delete(`/teachers/${id}`),
  desactivarDocente: (id) => api.put(`/teachers/${id}/deactivate`),
  activarDocente: (id) => api.put(`/teachers/${id}/activate`),
};