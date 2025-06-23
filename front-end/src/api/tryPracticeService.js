import api from "./configuracion";


export const tryPracticeService = {
    async getAllPractices() {
        try {
            const response = await api.get(`/try-practices/all`);
            return response.data;
        } catch (error) {
            console.error("Error fetching all practices:", error);
            throw error;
        }
    },

    async createTryPractice(payload) {
        try {
            const response = await api.post("/try-practices", payload);
            return response.data;
        } catch (error) {
            console.error("Error creating practice:", error);
            throw error;
        }
    },
    
    async getPracticeById(id) {
        try {
            const response = await api.get(`/try-practices/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching practice with ID ${id}:`, error);
            throw error;
        }
    },

    async getStudentPracticeAttempts(studentId, practiceId) {
        if (!studentId || !practiceId) {
            console.error('studentId y practiceId son obligatorios', { studentId, practiceId });
            return [];
        }
        
        try {
            const response = await api.get(`/try-practices/by-estudiante/${studentId}/by-practice/${practiceId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching attempts for student ${studentId} and practice ${practiceId}:`, error);
            throw error;
        }
    },

    async updatePracticeFeedback(id, feedback) {
        try {
            const response = await api.put(`/try-practices/${id}/feedback`, { feedback });
            return response.data;
        } catch (error) {
            console.error(`Error updating feedback for practice with ID ${id}:`, error);
            throw error;
        }
    }
};
