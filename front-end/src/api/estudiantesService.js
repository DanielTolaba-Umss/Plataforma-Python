import api from "./configuracion";

export const estudiantesApi = { 
  listar: async () => {
    try {
      console.log("Solicitando lista de estudiantes al backend");
      const response = await api.get('/students');
      console.log("Respuesta del backend (estudiantes):", response.data);
      return response.data;
    } catch (error) {
      console.error("Error en listar estudiantes:", error.response || error);
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
  },  // Crear un nuevo estudiante
  crear: async (estudiante) => {
    try {
      // Asegurarse de que cursos sea un array si está presente
      if (estudiante.cursos && !Array.isArray(estudiante.cursos)) {
        estudiante.cursos = [estudiante.cursos];
      }
      
      console.log("Enviando petición para crear estudiante:", estudiante);
      const response = await api.post('/students', estudiante);
      console.log("Respuesta de crear estudiante:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error en crear estudiante:", error.response || error);
      throw new Error('Error al crear estudiante: ' + (error.response?.data?.message || error.message));
    }
  },
  // Actualizar un estudiante
  actualizar: async (id, estudiante) => {
    try {
      // Asegurarse de que cursos sea un array si está presente
      if (estudiante.cursos && !Array.isArray(estudiante.cursos)) {
        estudiante.cursos = [estudiante.cursos];
      }
      
      console.log(`Actualizando estudiante ${id} con datos:`, estudiante);
      const response = await api.put(`/students/${id}`, estudiante);
      console.log("Respuesta de actualizar estudiante:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error en actualizar estudiante:", error.response || error);
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