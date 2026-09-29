import api from './api';

export const communityService = {
  getCommunities: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/communities?${params.toString()}`);
    return response.data;
  },

  getCommunity: async (communityId) => {
    const response = await api.get(`/communities/${communityId}`);
    return response.data;
  },

  createCommunity: async (communityData) => {
    const response = await api.post('/communities', communityData);
    return response.data;
  },

  joinCommunity: async (communityId) => {
    const response = await api.post(`/communities/${communityId}/join`);
    return response.data;
  },

  leaveCommunity: async (communityId) => {
    const response = await api.post(`/communities/${communityId}/leave`);
    return response.data;
  },

  updateCommunity: async (communityId, communityData) => {
    const response = await api.put(`/communities/${communityId}`, communityData);
    return response.data;
  },

  deleteCommunity: async (communityId) => {
    const response = await api.delete(`/communities/${communityId}`);
    return response.data;
  },

  getCommunityPosts: async (communityId, filters = {}) => {
    const params = new URLSearchParams();
    params.append('community', communityId);
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/posts?${params.toString()}`);
    return response.data;
  },
};