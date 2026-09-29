import api from './api';

export const reportService = {
  getReports: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/reports?${params.toString()}`);
    return response.data;
  },

  getMyReports: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/reports/my?${params.toString()}`);
    return response.data;
  },

  createReport: async (reportData) => {
    const response = await api.post('/reports', reportData);
    return response.data;
  },

  updateReport: async (reportId, reportData) => {
    const response = await api.put(`/reports/${reportId}`, reportData);
    return response.data;
  },

  deleteReport: async (reportId) => {
    const response = await api.delete(`/reports/${reportId}`);
    return response.data;
  },

  resolveReport: async (reportId, resolutionData) => {
    const response = await api.post(`/reports/${reportId}/resolve`, resolutionData);
    return response.data;
  },

  rejectReport: async (reportId, rejectionData) => {
    const response = await api.post(`/reports/${reportId}/reject`, rejectionData);
    return response.data;
  },

  markReportAsRead: async (reportId) => {
    const response = await api.put(`/reports/${reportId}/read`);
    return response.data;
  },

  markAllReportsAsRead: async () => {
    const response = await api.put('/reports/mark-all-read');
    return response.data;
  },
};