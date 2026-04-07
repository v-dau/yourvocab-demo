import axiosInstance from '../lib/axios';

export const getAdminUsers = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  filterBanned?: boolean;
}) => {
  const response = await axiosInstance.get('/admin/users', { params });
  return response.data;
};

export const banUser = async (userId: string) => {
  const response = await axiosInstance.post(`/admin/users/${userId}/ban`);
  return response.data;
};

export const unbanUser = async (userId: string) => {
  const response = await axiosInstance.post(`/admin/users/${userId}/unban`);
  return response.data;
};
