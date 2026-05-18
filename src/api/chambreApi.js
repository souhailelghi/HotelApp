import axiosClient from './axiosClient';

export const chambreApi = {
  getChambres: async () => {
    try {
      const response = await axiosClient.get('/Chambres');
      return response.data;
    } catch (error) {
      console.error("Error fetching rooms", error);
      throw error;
    }
  },

  createChambre: async (roomData) => {
    try {
      const response = await axiosClient.post('/Chambres', roomData);
      return response.data;
    } catch (error) {
      console.error("Error creating room", error);
      throw error;
    }
  },

  updateChambre: async (id, roomData) => {
    try {
      const response = await axiosClient.put(`/Chambres/${id}`, roomData);
      return response.data;
    } catch (error) {
      console.error("Error updating room", error);
      throw error;
    }
  },

  deleteChambre: async (id) => {
    try {
      const response = await axiosClient.delete(`/Chambres/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting room", error);
      throw error;
    }
  },

  getAvailableRooms: async (checkIn, checkOut, guests) => {
    try {
      console.log(`[API CALL] Fetching available rooms for: CheckIn=${checkIn}, CheckOut=${checkOut}, Guests=${guests}`);
      // Backend expects: /api/Chambres/available?checkIn=...&checkOut=...&guests=...
      // We add a timestamp 't' to prevent browser caching of identical search requests
      const response = await axiosClient.get(`/Chambres/available`, {
        params: {
          checkIn,
          checkOut,
          guests,
          t: new Date().getTime()
        }
      });
      console.log(`[API RESPONSE] Found ${response.data.length} available rooms.`);
      return response.data;
    } catch (error) {
      console.error("Error fetching available rooms", error);
      throw error;
    }
  }
};
