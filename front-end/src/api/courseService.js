import api from './configuracion';

export const cursosAPI = {
    obtenerPorId: (id) => api.get(`/courses/${id}`), 
    actualizar: (id, datos) => api.put(`/courses/${id}`, datos),
    eliminar: (id) => api.delete(`/courses/${id}`),
    desactivar: (id) => api.put(`/courses/${id}/deactivate`),
    activar: (id) => api.put(`/courses/${id}/activate`),
    obtenerTodos: async () => {
        console.log("Solicitando todos los cursos al backend");
        const response = await api.get('/courses');
        console.log("Respuesta de cursos:", response);
        return response;
    },
    crear: (datos) => api.post('/courses', datos),
};