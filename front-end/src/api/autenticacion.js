import api from './configuracion';

export const autenticacionAPI = {
  login: (datos) => api.post('/auth/login', datos),
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }),
  cambiarContrasena: (email, datos) => api.put(`/auth/change-password/${email}`, datos),
};