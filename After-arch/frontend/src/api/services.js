import api from './client';

export const authAPI = {
  register: (email, password, name, role) =>
    api.post('/auth/register', { email, password, name, role }),

  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  verify: () =>
    api.get('/auth/verify')
};

export const attendanceAPI = {
  detect: (formData) =>
    api.post('/detection/detect', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  getRecords: (courseId, startDate, endDate) =>
    api.get(`/attendance/records/${courseId}`, {
      params: { startDate, endDate }
    }),

  getSummary: (studentId, courseId) =>
    api.get(`/attendance/summary/${studentId}/${courseId}`)
};

export const studentAPI = {
  getAll: () =>
    api.get('/students'),

  getById: (id) =>
    api.get(`/students/${id}`),

  create: (student) =>
    api.post('/students', student),

  update: (id, student) =>
    api.put(`/students/${id}`, student),

  delete: (id) =>
    api.delete(`/students/${id}`)
};
