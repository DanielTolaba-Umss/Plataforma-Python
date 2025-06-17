import api from "./configuracion";

export const practiceAPI = {
  crear: (practice) => api.post("/practice", practice),
  obtenerTodas: () => api.get("/practice"),
  actualizar: (id, practice) => api.put(`/practice/${id}`, practice),
  eliminar: (id) => api.delete(`/practice/${id}`),
};
