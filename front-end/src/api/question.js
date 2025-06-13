import api from "./configuracion";

export const questionsAPI = {
  crearPregunta: (data) => {
    // Asegurar el formato correcto incluso si los datos vienen mal formados
    const payload = {
      ...data,
      opciones: (() => {
        // Si ya es un objeto con el formato correcto
        if (data.opciones && !Array.isArray(data.opciones)) {
          return data.opciones;
        }
        // Si viene como array, convertirlo a objeto
        if (Array.isArray(data.opciones)) {
          const opcionesObj = {};
          data.opciones.forEach(item => {
            opcionesObj[item.clave || item.key] = item.valor || item.value;
          });
          return opcionesObj;
        }
        // Caso por defecto (objeto vacío)
        return {};
      })()
    };

    return api.post("/questions", payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  },
  obtenerPreguntas: () => api.get("/questions"),
  obtenerPreguntaPorId: (id) => api.get(`/questions/${id}`),
  obtenerPreguntasPorQuiz: (quizId) => api.get(`/questions/by-quiz/${quizId}`),
  eliminarPregunta: (id) => api.delete(`/questions/${id}`)
};

function transformarOpciones(opciones) {
 
  const formatoBackend = {};
  Object.entries(opciones).forEach(([clave, valor]) => {
    formatoBackend[clave] = { valor }; // Ejemplo de formato alternativo
  });
  return formatoBackend;
}