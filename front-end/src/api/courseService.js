import api from './configuracion';

// API legacy para cursos
export const cursosAPI = {
    obtenerPorId: (id) => api.get(`/courses/${id}`), 
    actualizar: (id, datos) => api.put(`/courses/${id}`, datos),
    eliminar: (id) => api.delete(`/courses/${id}`),
    desactivar: (id) => api.put(`/courses/${id}/deactivate`),
    activar: (id) => api.put(`/courses/${id}/activate`),
    obtenerTodos: async () => {
        console.log("Solicitando todos los cursos al backend");
        const response = await api.get('/courses');
        console.log("Respuesta de cursos:", response);
        return response;
    },
    crear: (datos) => api.post('/courses', datos),
    obtenerPorDocenteId: (id) => api.get(`/courses/teachers/${id}`),
    crearPorDocente: (teacherId, datos) => api.post(`/courses/teacher/${teacherId}`, datos),
};

// Nueva API de cursos compatible con formularios admin
export const courseService = {
  // Obtener todos los cursos
  getAllCourses: () => api.get('/courses'),
  
  // Obtener un curso por ID
  getCourseById: (id) => api.get(`/courses/${id}`),
    // Obtener lecciones de un curso
  getLessonsByCourse: (courseId) => api.get(`/lessons?courseId=${courseId}`),
  
  // Obtener una lección específica
  getLessonById: (courseId, lessonId) => api.get(`/courses/${courseId}/lessons/${lessonId}`),
  
  // Crear un nuevo curso (solo admin)
  createCourse: (courseData) => api.post('/courses', courseData),

  
  // Actualizar un curso (solo admin)
  updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
  
  // Eliminar un curso (solo admin)
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  
  // Crear una nueva lección en un curso
  createLesson: (courseId, lessonData) => api.post(`/courses/${courseId}/lessons`, lessonData),
  
  // Actualizar una lección
  updateLesson: (courseId, lessonId, lessonData) => api.put(`/courses/${courseId}/lessons/${lessonId}`, lessonData),
  
  // Eliminar una lección
  deleteLesson: (courseId, lessonId) => api.delete(`/courses/${courseId}/lessons/${lessonId}`)
};