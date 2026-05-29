import api from './api';

export const issueAPI = {
  fetchIssues: (params) => api.get('/issues', { params }),
  fetchIssueById: (id) => api.get(`/issues/${id}`),
  fetchCategories: () => api.get('/categories'),
  fetchPublicStats: () => api.get('/issues/stats/public'),
  createIssue: (data) => api.post('/issues', data),
  updateIssue: (id, data) => api.put(`/issues/${id}`, data),
};
