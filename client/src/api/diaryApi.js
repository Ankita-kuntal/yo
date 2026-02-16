import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/diaries`;
// Helper to get the token from storage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

// Fetch Single Diary
export const fetchDiaryById = async (id) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(`${API_URL}/${id}`, config);
  return response.data;
};

// 1. Get all diaries
export const fetchDiaries = async () => {
  const response = await axios.get(API_URL, getAuthHeader());
  return response.data;
};

// 2. Create a new diary
export const createDiary = async (diaryData) => {
  const response = await axios.post(API_URL, diaryData, getAuthHeader());
  return response.data;
};

// 3. Update a diary
export const updateDiary = async (id, diaryData) => {
  const response = await axios.put(`${API_URL}/${id}`, diaryData, getAuthHeader());
  return response.data;
};

// 4. Delete a diary
export const deleteDiary = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
  return response.data;
};