
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
 * In this environment, we expect failures if the backend isn't deployed.
 * Instead of throwing loud errors, we return null so the frontend can use its MOCK data.
 */
const safeParseJson = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  
  // If the status is 500 or not OK, we likely don't have a real backend.
  // We return null to signal "No data from API, use fallback".
  if (!response.ok || !contentType || !contentType.includes('application/json')) {
    return null;
  }

  try {
    return await response.json();
  } catch (error) {
    return null;
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
      if (result === null) throw new Error('API_UNAVAILABLE');
      return result;
    } catch (error) {
      throw error;
    }
  },

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
