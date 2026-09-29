import api from './api';

export const postService = {
  getPosts: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/posts?${params.toString()}`);
    return response.data;
  },

  getPost: async (postId) => {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },

  createPost: async (postData) => {
    const response = await api.post('/posts', postData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updatePost: async (postId, postData) => {
    const response = await api.put(`/posts/${postId}`, postData);
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },

  likePost: async (postId) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  unlikePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}/like`);
    return response.data;
  },

  reportPost: async (postId, reportData) => {
    const response = await api.post(`/posts/${postId}/report`, reportData);
    return response.data;
  },

  appealPost: async (postId, appealData) => {
    const response = await api.post(`/posts/${postId}/appeal`, appealData);
    return response.data;
  },
};