import { API_URL } from "./configuracion";

const PRACTICE_API_URL = `${API_URL}/practice`;

export const practiceJhService = {

    async getPracticeById(id) {
        try {
            const response = await fetch(`${PRACTICE_API_URL}/${id}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching practice with ID ${id}:`, error);
            throw error;
        }
    }
};