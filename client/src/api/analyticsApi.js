import axios from 'axios';

const API_URL = '/api/analytics';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getAnalytics = async () => {
  const response = await axios.get(API_URL, getAuthHeader());
  return response.data;
};