import axiosClient from './axiosClient';

export const uploadApi = {
  uploadRoomImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosClient.post('/Chambres/room-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.imageUrl;
  },
  uploadRoomImages: async (files) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    const response = await axiosClient.post('/Chambres/room-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.imageUrls;
  }
};
