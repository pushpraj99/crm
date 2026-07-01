import api from './api';

export const exportData = async () => {
  const response = await api.get('/settings/export');
  return response.data;
};

export const importData = async (data, mode = 'merge') => {
  const response = await api.post('/settings/import', { data, mode });
  return response.data;
};

export const downloadBackup = async () => {
  const response = await api.get('/settings/backup');
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/settings/stats');
  return response.data;
};

export const getSmtpSettings = async () => {
  const response = await api.get('/settings/smtp');
  return response.data;
};

export const saveSmtpSettings = async (settings) => {
  const response = await api.put('/settings/smtp', settings);
  return response.data;
};

export const testSmtpSettings = async (email, settings) => {
  const response = await api.post('/settings/smtp/test', { email, settings });
  return response.data;
};
