import { API_URL } from "./configuracion";

const PDF_API_URL = `${API_URL}/pdfs`;

export const pdfApi = {  // Subir un nuevo PDF
  upload: async (formData) => {
    try {
      const response = await fetch(`${PDF_API_URL}/upload`, {
        method: "POST",
        body: formData, // FormData con archivo, nombre y descripción
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al subir el PDF");
      }

      return await response.json();
    } catch (error) {
      console.error("Error en pdfApi.upload:", error);
      throw error;
    }
  },
  // Obtener todos los PDFs
  getAll: async () => {
    try {
      const response = await fetch(PDF_API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los PDFs");
      }

      return await response.json();
    } catch (error) {
      console.error("Error en pdfApi.getAll:", error);
      throw error;
    }
  },
  // Obtener un PDF por ID
  getById: async (id) => {
    try {
      const response = await fetch(`${PDF_API_URL}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener el PDF");
      }

      return await response.json();
    } catch (error) {
      console.error("Error en pdfApi.getById:", error);
      throw error;
    }
  },
  // Actualizar un PDF
  update: async (id, formData) => {
    try {
      const response = await fetch(`${PDF_API_URL}/${id}`, {
        method: "PUT",
        body: formData, // FormData con archivo, nombre y descripción
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el PDF");
      }

      return await response.json();
    } catch (error) {
      console.error("Error en pdfApi.update:", error);
      throw error;
    }
  },

  // Eliminar un PDF
  delete: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el PDF");
      }

      return true;
    } catch (error) {
      console.error("Error en pdfApi.delete:", error);
      throw error;
    }
  },
};
