import axios from 'axios';
import { environment } from '../environment/environment';

export const API_URL = environment.apiUrl;

const api = axios.create({
    baseURL: API_URL,
    timeout: environment.timeoutMs,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            console.log(`Enviando solicitud a ${config.url} con token: ${accessToken.substring(0, 20)}...`);
            config.headers.Authorization = `Bearer ${accessToken}`;
        } else {
            console.warn(`Enviando solicitud a ${config.url} sin token de autenticación`);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                    return Promise.reject(error);
                }
                
                const response = await axios.post(`${API_URL}/auth/refresh`, 
                    { refreshToken },
                    { 
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
                
                const { accessToken, refreshToken: newRefreshToken } = response.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axios(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        if (error.response) {
            switch (error.response.status) {
                case 401:
                    localStorage.removeItem('accessTokentoken'); 
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                    break;
                case 403:
                    console.error('Error 403 - No tienes permisos para realizar esta acción');
                    console.error('URL de la solicitud:', originalRequest.url);
                    console.error('Método de la solicitud:', originalRequest.method);
                    console.error('Token actual:', localStorage.getItem('accessToken'));
                    
                    // Decodificar el token para ver su contenido (sólo para depuración)
                    try {
                        const token = localStorage.getItem('accessToken');
                        if (token) {
                            const base64Url = token.split('.')[1];
                            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                            const payload = JSON.parse(window.atob(base64));
                            console.error('Contenido del token:', payload);
                        }
                    } catch (e) {
                        console.error('Error al decodificar el token:', e);
                    }
                    break;
                case 404:
                    console.error('Recurso no encontrado');
                    break;
                default:
                    console.error('Error en la petición:', error.response.data);
            }
        } else if (error.request) {
            console.error('No se pudo conectar con el servidor');
        } else {
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;