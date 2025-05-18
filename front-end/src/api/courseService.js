import api from './configuracion';

export const cursosAPI = {
    obtenerPorId: (id) => api.get(`/courses/${id}`), 
    actualizar: (id, datos) => api.put(`/courses/${id}`, datos),
    eliminar: (id) => api.delete(`/courses/${id}`),
    desactivar: (id) => api.put(`/courses/${id}/deactivate`),
    activar: (id) => api.put(`/courses/${id}/activate`),
    obtenerTodos: () => api.get('/courses'),
    crear: (datos) => api.post('/courses', datos),
};