import api from './configuracion';

export const adminAPI = {
  // Gestión de usuarios administrativos
  getAllUsers: (page = 0, size = 10, name = null, email = null, role = null, active = null) => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', size);
    if (name) params.append('name', name);
    if (email) params.append('email', email);
    if (role) params.append('role', role);
    if (active !== null) params.append('active', active);
    
    return api.get(`/admin/users?${params.toString()}`);
  },
  getUserById: (id) => api.get(`/admin/users/${id}`),
  
  // Creación básica de usuarios
  createUser: (userData) => api.post('/admin/users', userData),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  // Funcionalidad principal: Creación con inscripción/asignación automática
  createUserWithEnrollment: (userData) => api.post('/admin/users/create-with-enrollment', userData),
  
  // Gestión de estados
  activateUser: (id) => api.patch(`/admin/users/${id}/activate`),
  deactivateUser: (id) => api.patch(`/admin/users/${id}/deactivate`),    // Filtros y búsquedas con paginación
  getUsersByRole: (role, page = 0, size = 10) => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', size);
    params.append('role', role);
    
    return api.get(`/admin/users?${params.toString()}`);
  },
  getActiveUsers: (page = 0, size = 10) => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', size);
    params.append('active', true);
    
    return api.get(`/admin/users?${params.toString()}`);
  },
  getInactiveUsers: (page = 0, size = 10) => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', size);
    params.append('active', false);
    
    return api.get(`/admin/users?${params.toString()}`);
  },
  
  // Estadísticas
  getUserStats: () => api.get('/admin/stats'),
  
  // Verificación de email
  verifyUserEmail: (id) => api.patch(`/admin/users/${id}/verify-email`),
  
  // Reset de contraseña
  resetUserPassword: (id, newPassword) => api.patch(`/admin/users/${id}/reset-password`, { newPassword })
};
