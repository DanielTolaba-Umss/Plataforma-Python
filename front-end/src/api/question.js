import api from './configuracion';

export const questionsAPI = {
  getByQuizId: (quizId) => api.get(`/quizzes/${quizId}/questions`)
};
