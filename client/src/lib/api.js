const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: isFormData
      ? {
          ...(options.headers || {})
        }
      : {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong while contacting the server.');
  }

  return data;
}

export const sessionsApi = {
  list: () => request('/api/sessions'),
  get: (id) => request(`/api/sessions/${id}`),
  create: (payload) => request('/api/sessions', {
    method: 'POST',
    body: payload instanceof FormData ? payload : JSON.stringify(payload)
  }),
  remove: (id) => request(`/api/sessions/${id}`, {
    method: 'DELETE'
  }),
  generate: (id, payload) => request(`/api/sessions/${id}/generate`, {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  answer: (id, payload) => request(`/api/sessions/${id}/answer`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
};

export { API_BASE_URL };