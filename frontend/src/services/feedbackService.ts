import axiosInstance from '../lib/axios';

export const submitFeedback = async (title: string, content: string) => {
  const response = await axiosInstance.post('/feedbacks', { title, content });
  return response.data;
};

export const getUserFeedbacks = async () => {
  const response = await axiosInstance.get('/feedbacks');
  return response.data;
};
