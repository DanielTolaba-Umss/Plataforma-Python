import api from "./configuracion";

export const questionsAPI = {
  crearPregunta: (data) => axios.post("/api/questions", data),
  actualizarPregunta: (id, data) => axios.put(`/api/questions/${id}`, data),
  obtenerPreguntas: () => axios.get("/api/questions"),
  obtenerPreguntaPorId: (id) => axios.get(`/api/questions/${id}`),
  obtenerPreguntasPorQuiz: (quizId) => axios.get(`/api/questions/by-quiz/${quizId}`),
  eliminarPregunta: (id) => axios.delete(`/api/questions/${id}`)
};
