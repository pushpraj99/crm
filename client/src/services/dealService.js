import api from './api';

export const getDeals = async () => {
  const response = await api.get('/deals');
  return response.data;
};

export const createDeal = async (data) => {
  const response = await api.post('/deals', data);
  return response.data;
};

export const updateDeal = async (id, data) => {
  const response = await api.put(`/deals/${id}`, data);
  return response.data;
};

export const deleteDeal = async (id) => {
  const response = await api.delete(`/deals/${id}`);
  return response.data;
};
