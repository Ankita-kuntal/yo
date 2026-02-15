import axios from 'axios';

const API_URL = '/api/upload';

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