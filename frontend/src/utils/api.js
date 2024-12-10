import { API_URL } from '../config';

export const apiClient = {
  get: async (endpoint, customHeaders = {}) => {
    const response = await fetch(`${API_URL}/api${endpoint}`, {
      headers: {
        ...customHeaders
      }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  post: async (endpoint, data, customHeaders = {}) => {
    const response = await fetch(`${API_URL}/api${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...customHeaders
      },
      body: JSON.stringify(data),
    });
    
    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }
};