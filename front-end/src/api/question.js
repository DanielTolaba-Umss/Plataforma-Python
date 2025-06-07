import api from "./configuracion";

export const questionsAPI = {
  crearPregunta: (data) => api.post("/api/questions", data),
  actualizarPregunta: (id, data) => api.put(`/api/questions/${id}`, data),
  obtenerPreguntas: () => api.get("/api/questions"),
  obtenerPreguntaPorId: (id) => api.get(`/api/questions/${id}`),
  obtenerPreguntasPorQuiz: (quizId) => api.get(`/api/questions/by-quiz/${quizId}`),
  eliminarPregunta: (id) => api.delete(`/api/questions/${id}`)
};
