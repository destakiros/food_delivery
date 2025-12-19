
const API_URL = '/api';

const getHeaders = () => {
  const headers: Record<string, string> = {
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

/**
 * Safely parses JSON response. 
 * If the response is not OK or not JSON, returns null.
 */
const safeParseJson = async (response: Response) => {
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
  /**
   * Performs a POST request. Returns null on any failure.
   */
  async post(endpoint: string, data: any) {
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

  /**
   * Performs a GET request. Returns null on any failure.
   */
  async get(endpoint: string) {
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

  /**
   * Performs a PUT request. Returns null on any failure.
   */
  async put(endpoint: string, data: any) {
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

  /**
   * Performs a DELETE request. Returns null on any failure.
   */
  async delete(endpoint: string) {
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
