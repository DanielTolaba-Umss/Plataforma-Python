import api from './configuracion';

export const leccionesAPI = {
    obtenerPorId: (id) => api.get(`/lessons/${id}`),
    actualizar: (id, datos) => api.put(`/lessons/${id}`, datos),
    eliminar: (id) => api.delete(`/lessons/${id}`),
    desactivar: (id) => api.put(`/lessons/${id}/deactivate`),
    activar: (id) => api.put(`/lessons/${id}/activate`),
    obtenerTodas: () => api.get('/lessons'),
    crear: (datos) => api.post('/lessons', datos),
    obtenerPorCursoYNivel: (courseId, level) => api.get(`/lessons/course/${courseId}/level/${level}`),
};