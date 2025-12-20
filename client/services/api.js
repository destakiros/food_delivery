
const API_URL = '/api';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const user = localStorage.getItem('qb_user');
  if (user) {
    try {
      const parsed = JSON.parse(user);
      if (parsed && parsed.token) {
        headers['Authorization'] = `Bearer ${parsed.token}`;
      }
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
    }
  }
  return headers;
};

const safeParseJson = async (response) => {
  try {
    const contentType = response.headers.get('content-type');
    if (!response.ok || !contentType || !contentType.includes('application/json')) {
      return null;
    }
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const apiService = {
  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return await safeParseJson(response);
    } catch (error) {
      return null;
    }
  },

  async get(endpoint) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await safeParseJson(response);
    } catch (error) {
      return null;
    }
  },

  async put(endpoint, data) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return await safeParseJson(response);
    } catch (error) {
      return null;
    }
  },

  async delete(endpoint) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return await safeParseJson(response);
    } catch (error) {
      return null;
    }
  }
};
