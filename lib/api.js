const API = process.env.NEXT_PUBLIC_API_URL;

export async function getToken() {
  const res = await fetch('/api/auth/token', { credentials: 'include' });
  if (!res.ok) return null;
  const data = await res.json();
  return data.token;
}

// Calls our Express server and attaches the JWT automatically
export async function apiFetch(path, options = {}) {
  const token = await getToken();
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  let body = options.body;
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    body = JSON.stringify(body);
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API}${path}`, { ...options, headers, body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return data;
}