import api from './api';

export const userService = {
  getUsers: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get('/users?${params.toString()}');
    return response.data;
  },

  getUser: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updatePreferences: async (preferences) => {
    const response = await api.put('/users/preferences', preferences);
    return response.data;
  },

  updatePrivacy: async (privacySettings) => {
    const response = await api.put('/users/privacy', privacySettings);
    return response.data;
  },

  updateSafety: async (safetySettings) => {
    const response = await api.put('/users/safety', safetySettings);
    return response.data;
  },

  blockUser: async (userId) => {
    const response = await api.post(`/users/${userId}/block`);
    return response.data;
  },

  unblockUser: async (userId) => {
    const response = await api.post(`/users/${userId}/unblock`);
    return response.data;
  },

  reportUser: async (userId, reportData) => {
    const response = await api.post(`/users/${userId}/report`, reportData);
    return response.data;
  },

  appealUser: async (userId, appealData) => {
    const response = await api.post(`/users/${userId}/appeal`, appealData);
    return response.data;
  },
};