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

  getClient: async (id) => {
    try {
      const response = await axiosClient.get(`/Clients/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching client", error);
      throw error;
    }
  },

  updateClient: async (id, clientData) => {
    try {
      const response = await axiosClient.put(`/Clients/${id}`, clientData);
      return response.data;
    } catch (error) {
      console.error("Error updating client", error);
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
  },

  deleteClient: async (id) => {
    try {
      const response = await axiosClient.delete(`/Clients/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting client", error);
      throw error;
    }
  }
};
