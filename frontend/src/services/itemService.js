import api from './api';

export const getItems = async (params = {}) => {
  const res = await api.get('/items', { params });
  return res.data;
};

export const getItemById = async (id) => {
  const res = await api.get(`/items/${id}`);
  return res.data;
};

export const createItem = async (formData) => {
  const res = await api.post('/items', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const updateItem = async (id, formData) => {
  const res = await api.put(`/items/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteItem = async (id) => {
  const res = await api.delete(`/items/${id}`);
  return res.data;
};

export const getMyItems = async () => {
  const res = await api.get('/items/my-listings');
  return res.data;
};

export const markAsSold = async (id) => {
  const res = await api.patch(`/items/${id}/sold`);
  return res.data;
};
