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
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // El servidor respondió con un código de error
            switch (error.response.status) {
                case 401:
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                    break;
                case 403:
                    console.error('No tienes permisos para realizar esta acción');
                    break;
                case 404:
                    console.error('Recurso no encontrado');
                    break;
                default:
                    console.error('Error en la petición:', error.response.data);
            }
        } else if (error.request) {
            // La petición fue hecha pero no se recibió respuesta
            console.error('No se pudo conectar con el servidor');
        } else {
            // Error al configurar la petición
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;