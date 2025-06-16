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
};
