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
  
  createReservation: async (data) => {
    try {
      const response = await axiosClient.post('/Reservations', data);
      return response.data;
    } catch (error) {
      console.error("Error creating reservation", error);
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
