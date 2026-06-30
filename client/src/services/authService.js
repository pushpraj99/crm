import api from './api';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const getLoginHistory = async () => {
  const response = await api.get('/auth/login-history');
  return response.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.put('/auth/change-password', { currentPassword, newPassword });
  return response.data;
};

export const changeEmail = async (newEmail, password) => {
  const response = await api.put('/auth/change-email', { newEmail, password });
  return response.data;
};

export const updatePasswordPolicy = async (policy) => {
  const response = await api.put('/auth/password-policy', policy);
  return response.data;
};
