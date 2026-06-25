const API_BASE_URL = '';

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const message = result?.error || 'Ошибка запроса к API';
    throw new Error(message);
  }

  return result;
}

async function getStats() {
  const result = await apiRequest('/api/leads/stats');

  return result.data;
}

async function getLeads(status = '') {
  const query = status ? `?status=${status}` : '';
  const result = await apiRequest(`/api/leads${query}`);

  return result.data;
}

async function getLeadById(id) {
  const result = await apiRequest(`/api/leads/${id}`);

  return result.data;
}

async function updateLeadStatus(id, status) {
  const result = await apiRequest(`/api/leads/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({
      status,
    }),
  });

  return result.data;
}
