import axios from 'axios';

const API_BASE_URL = 'https://google-notebooklm.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout:  120000, // 30 seconds timeout
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Document APIs
export const uploadPDF = async (file, onUploadProgress) => {
  const formData = new FormData();

  formData.append('pdf', file);
  
  return api.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

export const getDocument = async (documentId) => {
  return api.get(`/documents/${documentId}`);
};

export const getPDFUrl = (documentId) => {
  return `${API_BASE_URL}/documents/${documentId}/pdf`;
};

// Chat APIs
export const sendMessage = async (chatId, message) => {
  return api.post('/chat/message', {
    chatId,
    message,
  });
};

export const getChatHistory = async (chatId) => {
  return api.get(`/chat/${chatId}`);
};

export default api;


