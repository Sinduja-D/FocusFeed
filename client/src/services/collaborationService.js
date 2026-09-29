import api from './api';

export const collaborationService = {
  getCollaborations: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/collaborations?${params.toString()}`);
    return response.data;
  },

  getCollaboration: async (collaborationId) => {
    const response = await api.get(`/collaborations/${collaborationId}`);
    return response.data;
  },

  createCollaboration: async (collaborationData) => {
    const response = await api.post('/collaborations', collaborationData);
    return response.data;
  },

  joinCollaboration: async (collaborationId) => {
    const response = await api.post(`/collaborations/${collaborationId}/join`);
    return response.data;
  },

  leaveCollaboration: async (collaborationId) => {
    const response = await api.post(`/collaborations/${collaborationId}/leave`);
    return response.data;
  },

  updateCollaboration: async (collaborationId, collaborationData) => {
    const response = await api.put(`/collaborations/${collaborationId}`, collaborationData);
    return response.data;
  },

  deleteCollaboration: async (collaborationId) => {
    const response = await api.delete(`/collaborations/${collaborationId}`);
    return response.data;
  },

  contributeToCollaboration: async (collaborationId, contributionData) => {
    const response = await api.post(`/collaborations/${collaborationId}/contribute`, contributionData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  generateVideo: async (collaborationId) => {
    const response = await api.post(`/collaborations/${collaborationId}/generate-video`);
    return response.data;
  },

  publishCollaboration: async (collaborationId) => {
    const response = await api.post(`/collaborations/${collaborationId}/publish`);
    return response.data;
  },
};