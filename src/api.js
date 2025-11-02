export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://booknest-fusx.onrender.com';

export function getAuthToken() {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
}

export function authHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...authHeaders()
  };
  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (res.status === 401) {
    // auto-logout on unauthorized
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  return res;
}


