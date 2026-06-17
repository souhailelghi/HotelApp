import axiosClient from './axiosClient';

export const reservationApi = {
  getReservations: async () => {
    try {
      const response = await axiosClient.get('/Reservations');
      return response.data;
    } catch (error) {
      console.error("Error fetching reservations", error);
      throw error;
    }
  },

  getClientReservations: async (idClient) => {
    try {
      const response = await axiosClient.get(`/Reservations/client/${idClient}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching client reservations", error);
      throw error;
    }
  },
  
  createReservation: async (data) => {
    try {
      const response = await axiosClient.post('/Reservations', data);
      return response.data;
    } catch (error) {
      console.error("Error creating reservation", error.response?.data || error);
      throw error;
    }
  },

  updateReservation: async (id, data) => {
    try {
      const response = await axiosClient.put(`/Reservations/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating reservation", error);
      throw error;
    }
  },

  cancelReservation: async (id) => {
    try {
      const response = await axiosClient.put(`/Reservations/cancel/${id}`);
      return response;
    } catch (error) {
      console.error("Error cancelling reservation", error.response?.data || error);
      throw error;
    }
  },

  getBookingNotifications: async () => {
    try {
      const response = await axiosClient.get('/Reservations/notifications');
      return response.data;
    } catch (error) {
      console.error("Error fetching booking notifications", error);
      throw error;
    }
  },

  getRoomAvailability: async (roomId, year, month) => {
    try {
      const response = await axiosClient.get(`/Availability/room/${roomId}?year=${year}&month=${month}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching availability", error);
      throw error;
    }
  }
};
