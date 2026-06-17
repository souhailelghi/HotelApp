import axios from 'axios';

const authApiClient = axios.create({
  baseURL: 'https://localhost:7253/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  loginCustomer: async (credentials) => {
    const response = await authApiClient.post('/Auth/login-email', credentials);
    return response.data;
  },
  
  loginAdmin: async (credentials) => {
    const response = await authApiClient.post('/Account/login', credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await authApiClient.post('/Account/register', userData);
    return response.data;
  },
  
  registerAdmin: async (adminData) => {
    const response = await authApiClient.post('/Account/registerAdmin', adminData);
    return response.data;
  }
};
