import api from './api';

export const adminService = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getUsers: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/admin/users?${params.toString()}`);
    return response.data;
  },

  getUser: async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  banUser: async (userId, banData) => {
    const response = await api.post(`/admin/users/${userId}/ban`, banData);
    return response.data;
  },

  unbanUser: async (userId) => {
    const response = await api.post(`/admin/users/${userId}/unban`);
    return response.data;
  },

  makeAdmin: async (userId) => {
    const response = await api.post(`/admin/users/${userId}/make-admin`);
    return response.data;
  },

  removeAdmin: async (userId) => {
    const response = await api.post(`/admin/users/${userId}/remove-admin`);
    return response.data;
  },

  getPosts: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/admin/posts?${params.toString()}`);
    return response.data;
  },

  getPost: async (postId) => {
    const response = await api.get(`/admin/posts/${postId}`);
    return response.data;
  },

  moderatePost: async (postId, moderationData) => {
    const response = await api.post(`/admin/posts/${postId}/moderate`, moderationData);
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await api.delete(`/admin/posts/${postId}`);
    return response.data;
  },

  getReports: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/admin/reports?${params.toString()}`);
    return response.data;
  },

  getReport: async (reportId) => {
    const response = await api.get(`/admin/reports/${reportId}`);
    return response.data;
  },

  resolveReport: async (reportId, resolutionData) => {
    const response = await api.post(`/admin/reports/${reportId}/resolve`, resolutionData);
    return response.data;
  },

  rejectReport: async (reportId, rejectionData) => {
    const response = await api.post(`/admin/reports/${reportId}/reject`, rejectionData);
    return response.data;
  },

  getModerationQueue: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/admin/moderation?${params.toString()}`);
    return response.data;
  },

  moderateItem: async (itemId, moderationData) => {
    const response = await api.post(`/admin/moderation/${itemId}/moderate`, moderationData);
    return response.data;
  },

  getFakeAccounts: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/admin/fake-accounts?${params.toString()}`);
    return response.data;
  },

  getFakeAccount: async (accountId) => {
    const response = await api.get(`/admin/fake-accounts/${accountId}`);
    return response.data;
  },

  verifyAccount: async (accountId) => {
    const response = await api.post(`/admin/fake-accounts/${accountId}/verify`);
    return response.data;
  },

  banAccount: async (accountId, banData) => {
    const response = await api.post(`/admin/fake-accounts/${accountId}/ban`, banData);
    return response.data;
  },

  getEngagementData: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/admin/engagement?${params.toString()}`);
    return response.data;
  },

  getCollaborations: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/admin/collaborations?${params.toString()}`);
    return response.data;
  },

  getCollaboration: async (collaborationId) => {
    const response = await api.get(`/admin/collaborations/${collaborationId}`);
    return response.data;
  },

  moderateCollaboration: async (collaborationId, moderationData) => {
    const response = await api.post(`/admin/collaborations/${collaborationId}/moderate`, moderationData);
    return response.data;
  },

  getAppeals: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/admin/appeals?${params.toString()}`);
    return response.data;
  },

  getAppeal: async (appealId) => {
    const response = await api.get(`/admin/appeals/${appealId}`);
    return response.data;
  },

  resolveAppeal: async (appealId, resolutionData) => {
    const response = await api.post(`/admin/appeals/${appealId}/resolve`, resolutionData);
    return response.data;
  },

  rejectAppeal: async (appealId, rejectionData) => {
    const response = await api.post(`/admin/appeals/${appealId}/reject`, rejectionData);
    return response.data;
  },

  getSafetyData: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/admin/safety?${params.toString()}`);
    return response.data;
  },
};