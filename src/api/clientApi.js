import axiosClient from './axiosClient';

export const clientApi = {
  createClient: async (clientData) => {
    try {
      const response = await axiosClient.post('/Clients', clientData);
      return response.data;
    } catch (error) {
      console.error("Error creating client", error);
      throw error;
    }
  },

  getClients: async () => {
    try {
      const response = await axiosClient.get('/Clients');
      return response.data;
    } catch (error) {
      console.error("Error fetching clients", error);
      throw error;
    }
  }
};
