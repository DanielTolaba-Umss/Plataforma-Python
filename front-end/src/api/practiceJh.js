import { API_URL } from "./configuracion";

const PRACTICE_API_URL = `${API_URL}/practice`;
const TESt_CASES_API_URL = `${API_URL}/test-cases`;

export const practiceJhService = {

    async getPracticeByLessonId(lessonId) {
        try {
            const response = await fetch(`${PRACTICE_API_URL}/lesson/${lessonId}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching practice with ID ${lessonId}:`, error);
            throw error;
        }
    }
};

export const testCasesService = {
    async getTestCasesByPracticeId(practiceId) {
        try {
            const response = await fetch(`${TESt_CASES_API_URL}/by-practice/${practiceId}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching test cases for practice ID ${practiceId}:`, error);
            throw error;
        }
    }
};