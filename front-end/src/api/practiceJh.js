import api from "./configuracion";

export const practiceJhService = {
    async getPracticeByLessonId(lessonId) {
        try {
            const response = await api.get(`/practice/lesson/${lessonId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching practice with ID ${lessonId}:`, error);
            throw error;
        }
    }
};

export const testCasesService = {
    async getTestCasesByPracticeId(practiceId) {
        try {
            const response = await api.get(`/test-cases/by-practice/${practiceId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching test cases for practice ID ${practiceId}:`, error);
            throw error;
        }
    }
};