import api from './api';

export const getActivities = async () => {
  const response = await api.get('/activities');
  return response.data;
};

export const logActivity = async (data) => {
  const response = await api.post('/activities', data);
  return response.data;
};

export const getActivitiesByCustomerId = async (customerId) => {
  const response = await api.get(`/activities/${customerId}`);
  return response.data;
};
