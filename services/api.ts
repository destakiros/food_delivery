
const API_URL = '/api';

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const user = localStorage.getItem('qb_user');
  if (user) {
    try {
      const { token } = JSON.parse(user);
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
    }
  }
  return headers;
};

/**
 * Safely parses JSON response. If parsing fails, returns null or throws an informative error.
 */
const safeParseJson = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    // If not JSON, get text for debugging or just throw
    const text = await response.text();
    throw new Error(text || `Expected JSON but received ${response.status} status.`);
  }

  try {
    return await response.json();
  } catch (error) {
    throw new Error('Response was not valid JSON');
  }
};

export const apiService = {
  async post(endpoint: string, data: any) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      
      const result = await safeParseJson(response);
      if (!response.ok) throw new Error(result?.message || 'Network request failed');
      return result;
    } catch (error) {
      // Re-throw so the calling context (like AuthContext) can catch and handle fallback
      throw error;
    }
  },

  async get(endpoint: string) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      
      const result = await safeParseJson(response);
      if (!response.ok) throw new Error(result?.message || 'Network request failed');
      return result;
    } catch (error) {
      throw error;
    }
  },

  async put(endpoint: string, data: any) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      
      const result = await safeParseJson(response);
      if (!response.ok) throw new Error(result?.message || 'Network request failed');
      return result;
    } catch (error) {
      throw error;
    }
  },

  async delete(endpoint: string) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      
      const result = await safeParseJson(response);
      if (!response.ok) throw new Error(result?.message || 'Network request failed');
      return result;
    } catch (error) {
      throw error;
    }
  }
};
