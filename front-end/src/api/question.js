import api from "./configuracion";

export const questionsAPI = {
  crearPregunta: (data) => api.post("/questions", data),
  actualizarPregunta: (id, data) => api.put(`/questions/${id}`, data),
  obtenerPreguntas: () => api.get("/questions"),
  obtenerPreguntaPorId: (id) => api.get(`/questions/${id}`),
  obtenerPreguntasPorQuiz: (quizId) => api.get(`/questions/by-quiz/${quizId}`),
  eliminarPregunta: (id) => api.delete(`/questions/${id}`)
};
