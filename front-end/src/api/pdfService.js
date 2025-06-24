import api from "./configuracion";

export const pdfApi = {

  upload: async (formData) => {
    try {
      const response = await api.post(`/resources/upload-pdf`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error("Error en pdfApi.upload:", error);
      throw error;
    }
  },
  
  getAll: async () => {
    try {
      const response = await api.get('/resources');
      return response.data;
    } catch (error) {
      console.error("Error en pdfApi.getAll:", error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/resources/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error en pdfApi.getById:", error);
      throw error;
    }
  },
  
  update: async (id, formData) => {
    try {
      const response = await api.put(`/resources/upload-pdf/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error("Error en pdfApi.update:", error);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      await api.delete(`/resources/delete-pdf/${id}`);
      return true;
    } catch (error) {
      console.error("Error en pdfApi.delete:", error);
      throw error;
    }
  },
};
