import axiosClient from './axiosClient';

export const adminApi = {
  createAdmin: async (adminData) => {
    try {
      const response = await axiosClient.post('/Admins', adminData);
      return response.data;
    } catch (error) {
      console.error("Error creating admin", error);
      throw error;
    }
  },
  getAdmins: async () => {
    try {
      const response = await axiosClient.get('/Admins');
      return response.data;
    } catch (error) {
      console.error("Error fetching admins", error);
      throw error;
    }
  }
};
