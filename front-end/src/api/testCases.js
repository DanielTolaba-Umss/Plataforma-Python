import api from "./configuracion";

export const testCasesAPI = {
  crear: (testCase) => api.post("/test-cases", testCase),
  actualizar: (id, testCase) => api.put(`/test-cases/${id}`, testCase),
  obtenerPorId: (id) => api.get(`/test-cases/${id}`),
  obtenerPorPractice: (practiceId) =>
    api.get(`/test-cases/by-practice/${practiceId}`),
  eliminar: (id) => api.delete(`/test-cases/${id}`),
};
