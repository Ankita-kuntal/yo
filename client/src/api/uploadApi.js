import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/upload`;

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const token = localStorage.getItem('token');
  const config = {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  };

  const response = await axios.post(API_URL, formData, config);
  return response.data;
};