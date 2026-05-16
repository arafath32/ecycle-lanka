import api from './api';

export const getRequests = async (params = {}) => {
  const res = await api.get('/requests', { params });
  return res.data;
};

export const getRequestById = async (id) => {
  const res = await api.get(`/requests/${id}`);
  return res.data;
};

export const createRequest = async (data) => {
  const res = await api.post('/requests', data);
  return res.data;
};

export const getMyRequests = async () => {
  const res = await api.get('/requests/my-requests');
  return res.data;
};

export const updateRequestStatus = async (id, status) => {
  const res = await api.put(`/requests/${id}/status`, { status });
  return res.data;
};

export const deleteRequest = async (id) => {
  const res = await api.delete(`/requests/${id}`);
  return res.data;
};