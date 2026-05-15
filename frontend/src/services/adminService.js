import api from './api';

export const getAdminStats = async () => {
  const res = await api.get('/admin/stats');
  return res.data;
};

export const getAllUsers = async (params = {}) => {
  const res = await api.get('/admin/users', { params });
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data;
};

export const toggleUserStatus = async (id) => {
  const res = await api.patch(`/admin/users/${id}/toggle-status`);
  return res.data;
};

export const getAllListings = async (params = {}) => {
  const res = await api.get('/admin/listings', { params });
  return res.data;
};

export const approveItem = async (id) => {
  const res = await api.patch(`/admin/listings/${id}/approve`);
  return res.data;
};

export const rejectItem = async (id) => {
  const res = await api.patch(`/admin/listings/${id}/reject`);
  return res.data;
};

export const adminDeleteItem = async (id) => {
  const res = await api.delete(`/admin/listings/${id}`);
  return res.data;
};

export const getReports = async () => {
  const res = await api.get('/admin/reports');
  return res.data;
};
