import api from "./configuracion";

export const quizzesAPI = {
  getAllQuizzes: () => api.get("/quizzes"),
  crear: (datos) => api.post("/quizzes", datos),
  actualizar: (id, datos) => api.put(`/quizzes/${id}`, datos),
  eliminar: (id) => api.delete(`/quizzes/${id}`),
  descontarIntento: (id) => api.put(`/quizzes/${id}/descontar-intento`),
};
