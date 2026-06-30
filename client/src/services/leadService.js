import api from './api';

export const getLeads = async () => {
  const response = await api.get('/leads');
  return response.data;
};

export const createLead = async (data) => {
  const response = await api.post('/leads', data);
  return response.data;
};

export const updateLead = async (id, data) => {
  const response = await api.put(`/leads/${id}`, data);
  return response.data;
};

export const deleteLead = async (id) => {
  const response = await api.delete(`/leads/${id}`);
  return response.data;
};
