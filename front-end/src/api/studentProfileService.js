import api from "./configuracion";

/**
 * Servicio para gestión del perfil de estudiantes
 * Utiliza los endpoints específicos del backend: /api/user/student-*
 */
export const studentProfileService = {
  /**
   * Obtener el perfil del estudiante autenticado
   */
  getProfile: async () => {
    try {
      console.log("Solicitando perfil de estudiante al backend");
      const response = await api.get('/user/student-profile');
      console.log("Respuesta del perfil de estudiante:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener perfil de estudiante:", error.response || error);
      throw new Error('Error al obtener perfil: ' + (error.response?.data?.message || error.message));
    }
  },

  /**
   * Actualizar el perfil del estudiante autenticado
   * @param {Object} profileData - Datos del perfil a actualizar
   * @param {string} profileData.nombres - Nombres del estudiante
   * @param {string} profileData.apellidos - Apellidos del estudiante
   * @param {string} profileData.email - Email del estudiante
   * @param {string} profileData.telefono - Teléfono del estudiante (8 dígitos)
   */
  updateProfile: async (profileData) => {
    try {
      console.log("Actualizando perfil de estudiante:", profileData);
      const response = await api.put('/user/student-profile', profileData);
      console.log("Respuesta de actualización del perfil:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar perfil de estudiante:", error.response || error);
      throw new Error('Error al actualizar perfil: ' + (error.response?.data?.message || error.message));
    }
  },

  /**
   * Obtener los cursos del estudiante autenticado
   */
  getCourses: async () => {
    try {
      console.log("Solicitando cursos de estudiante al backend");
      const response = await api.get('/user/student-courses');
      console.log("Respuesta de cursos de estudiante:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener cursos de estudiante:", error.response || error);
      throw new Error('Error al obtener cursos: ' + (error.response?.data?.message || error.message));
    }
  },
  /**
   * Obtener el progreso del estudiante autenticado
   */
  getProgress: async () => {
    try {
      console.log("Solicitando progreso de estudiante al backend");
      const response = await api.get('/user/student-progress');
      console.log("Respuesta de progreso de estudiante:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener progreso de estudiante:", error.response || error);
      throw new Error('Error al obtener progreso: ' + (error.response?.data?.message || error.message));
    }
  },
  /**
   * Obtener las lecciones de un curso específico con el progreso del estudiante
   * @param {number} courseId - ID del curso
   */
  getCourseLessons: async (courseId) => {
    try {
      console.log(`Solicitando lecciones del curso ${courseId} al backend`);
      const response = await api.get(`/user/student-course-lessons/${courseId}`);
      console.log("Respuesta de lecciones del curso:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener lecciones del curso:", error.response || error);
      throw new Error('Error al obtener lecciones del curso: ' + (error.response?.data?.message || error.message));
    }
  },

  /**
   * Cambiar la contraseña del usuario autenticado
   * @param {Object} passwordData - Datos para cambio de contraseña
   * @param {string} passwordData.currentPassword - Contraseña actual
   * @param {string} passwordData.newPassword - Nueva contraseña
   * @param {string} passwordData.confirmPassword - Confirmación de la nueva contraseña
   */
  changePassword: async (passwordData) => {
    try {
      console.log("Cambiando contraseña del usuario");
      const response = await api.post('/user/change-password', passwordData);
      console.log("Respuesta de cambio de contraseña:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al cambiar contraseña:", error.response || error);
      throw new Error('Error al cambiar contraseña: ' + (error.response?.data?.message || error.message));
    }
  }
};

export default studentProfileService;
