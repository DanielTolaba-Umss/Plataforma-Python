import api from './configuracion';

export const modulosAPI = {
    obtenerTodos: () => api.get('/modules'),
    obtenerPorId: (id) => api.get(`/modules/${id}`),
    crear: (modulo) => api.post('/modules', modulo),
    actualizar: (id, modulo) => api.put(`/modules/${id}`, modulo),
    eliminar: (id) => api.delete(`/modules/${id}`),
    activar: (id) => api.put(`/modules/${id}/activate`),
    desactivar: (id) => api.put(`/modules/${id}/deactivate`),
    buscarPorTitulo: (titulo) => api.get(`/modules?title=${titulo}`)
};