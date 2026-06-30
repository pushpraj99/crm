import api from './api';

export const getActivities = async (params = {}) => {
  const response = await api.get('/activities', { params });
  return response.data;
};

export const logActivity = async (data) => {
  const response = await api.post('/activities', data);
  return response.data;
};

export const updateActivity = async (id, data) => {
  const response = await api.put(`/activities/${id}`, data);
  return response.data;
};

export const deleteActivity = async (id) => {
  const response = await api.delete(`/activities/${id}`);
  return response.data;
};

export const getActivitiesByCustomerId = async (customerId) => {
  const response = await api.get(`/activities/customer/${customerId}`);
  return response.data;
};
