import api from './configuracion';

export const usuariosAPI = {
    registrar: (usuario) => api.post('/students', usuario),
    login: (credenciales) => api.post('/auth/login', credenciales),
    obtenerPerfil: () => api.get('/students/profile'),
    actualizarPerfil: (datos) => api.put('/students/profile', datos),
    obtenerCursosInscritos: () => api.get('/students/courses'),
    inscribirCurso: (cursoId) => api.post(`/students/courses/${cursoId}`),
    cancelarInscripcion: (cursoId) => api.delete(`/students/courses/${cursoId}`)
};