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
   * Iniciar una lección (cambiar estado a IN_PROGRESS)
   * @param {number} lessonId - ID de la lección
   */
  startLesson: async (lessonId) => {
    try {
      console.log(`Iniciando lección ${lessonId}`);
      const response = await api.post(`/user/lessons/${lessonId}/start`);
      console.log("Respuesta de inicio de lección:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al iniciar lección:", error.response || error);
      throw new Error('Error al iniciar lección: ' + (error.response?.data?.message || error.message));
    }
  },

  /**
   * Completar una lección por práctica (cambiar estado a COMPLETED)
   * @param {number} lessonId - ID de la lección
   * @param {number} score - Puntuación obtenida
   */
  completeLessonByPractice: async (lessonId, score = 100) => {
    try {
      console.log(`Completando lección ${lessonId} con puntuación ${score}`);
      const response = await api.post(`/user/lessons/${lessonId}/complete-practice`, {
        passed: true,
        score: score
      });
      console.log("Respuesta de completar lección:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al completar lección:", error.response || error);
      throw new Error('Error al completar lección: ' + (error.response?.data?.message || error.message));
    }
  },

  /**
   * Completar quiz de un curso
   * @param {number} courseId - ID del curso
   * @param {number} score - Puntuación obtenida
   * @param {boolean} passed - Si aprobó el quiz
   */
  completeQuiz: async (courseId, score, passed = true) => {
    try {
      console.log(`Completando quiz del curso ${courseId} con puntuación ${score}`);
      const response = await api.post(`/user/quiz/${courseId}/complete`, {
        score: score,
        passed: passed
      });
      console.log("Respuesta de completar quiz:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al completar quiz:", error.response || error);
      throw new Error('Error al completar quiz: ' + (error.response?.data?.message || error.message));
    }
  },

  /**
   * Incrementar intentos de quiz
   * @param {number} courseId - ID del curso
   */
  incrementQuizAttempts: async (courseId) => {
    try {
      console.log(`Incrementando intentos de quiz del curso ${courseId}`);
      const response = await api.post(`/user/quiz/${courseId}/attempt`);
      console.log("Respuesta de incrementar intentos:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al incrementar intentos de quiz:", error.response || error);
      throw new Error('Error al incrementar intentos de quiz: ' + (error.response?.data?.message || error.message));
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
