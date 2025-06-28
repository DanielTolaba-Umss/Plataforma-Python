import api from "./configuracion";

export const questionsAPI = {
  crearPregunta: (data) => {
    const payload = {
      ...data,
      opciones: (() => {
        if (data.opciones && !Array.isArray(data.opciones)) {
          return data.opciones;
        }
        if (Array.isArray(data.opciones)) {
          const opcionesObj = {};
          data.opciones.forEach((item) => {
            opcionesObj[item.clave || item.key] = item.valor || item.value;
          });
          return opcionesObj;
        }
        return {};
      })(),
    };

    return api.post("/questions", payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  },
  obtenerPreguntas: () => api.get("/questions"),
  obtenerPreguntaPorId: (id) => api.get(`/questions/${id}`),
  obtenerPreguntasPorQuiz: (quizId) => api.get(`/questions/by-quiz/${quizId}`),
  eliminarPregunta: (id) => api.delete(`/questions/${id}`),
};
