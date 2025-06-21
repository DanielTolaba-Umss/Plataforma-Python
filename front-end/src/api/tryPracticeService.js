import { API_URL } from "./configuracion";

const TRY_PRACTICE_API_URL = `${API_URL}/try-practices`;

export const tryPracticeService = {
    async getAllPractices() {
        try {
            const response = await fetch(`${TRY_PRACTICE_API_URL}/all`);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching all practices:", error);
            throw error;
        }
    },

    async createTryPractice(payload) {
        try {
            const response = await fetch(TRY_PRACTICE_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error creating practice:", error);
            throw error;
        }
    },
    

    async getPracticeById(id) {
        try {
            const response = await fetch(`${TRY_PRACTICE_API_URL}/${id}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            return await response.json();
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

            const response = await fetch(`${TRY_PRACTICE_API_URL}/by-estudiante/${studentId}/by-practice/${practiceId}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching attempts for student ${studentId} and practice ${practiceId}:`, error);
            throw error;
        }
    },

    async updatePracticeFeedback(id, feedback) {
        try {
            const response = await fetch(`${TRY_PRACTICE_API_URL}/${id}/feedback`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ feedback })
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error updating feedback for practice with ID ${id}:`, error);
            throw error;
        }
    }
};
