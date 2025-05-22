import { API_URL } from './configuracion';
import axios from 'axios';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const estudiantesApi = {
  // Obtener todos los estudiantes
  listar: async () => {
    try {
      const response = await api.get('/students');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener estudiantes: ' + (error.response?.data?.message || error.message));
    }
  },
  // Obtener un estudiante por ID
  obtenerPorId: async (id) => {
    try {
      const response = await api.get(`/students/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener estudiante: ' + (error.response?.data?.message || error.message));
    }
  },

  // Crear un nuevo estudiante
  crear: async (estudiante) => {
    try {
      const response = await api.post('/students', estudiante);
      return response.data;
    } catch (error) {
      throw new Error('Error al crear estudiante: ' + (error.response?.data?.message || error.message));
    }
  },

  // Actualizar un estudiante
  actualizar: async (id, estudiante) => {
    try {
      const response = await api.put(`/students/${id}`, estudiante);
      return response.data;
    } catch (error) {
      throw new Error('Error al actualizar estudiante: ' + (error.response?.data?.message || error.message));
    }
  },

  // Eliminar un estudiante
  eliminar: async (id) => {
    try {
      await api.delete(`/students/${id}`);
      return true;
    } catch (error) {
      throw new Error('Error al eliminar estudiante: ' + (error.response?.data?.message || error.message));
    }
  },
};