const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function getToken() {
  return localStorage.getItem('token');
}

async function api(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || `Error ${res.status}`);
  return data;
}

export const AuthAPI = {
  login: (email, password) => api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (body) => api('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
};

export const ClientesAPI = {
  list: () => api('/api/clientes'),
  miperfil: () => api('/api/clientes/miperfil'),
  create: (body) => api('/api/clientes', { method: 'POST', body: JSON.stringify(body) }),
  get: (id) => api(`/api/clientes/${id}`),
  campanas: (id) => api(`/api/clientes/${id}/campanas`),
};

export const CampanasAPI = {
  list: (estado) => api(`/api/campanas${estado ? `?estado=${estado}` : ''}`),
  create: (body) => api('/api/campanas', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => api(`/api/campanas/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  get: (id) => api(`/api/campanas/${id}`),
  remove: (id) => api(`/api/campanas/${id}`, { method: 'DELETE' }),
};

export const ProductosAPI = {
  list: () => api('/api/productos'),
  create: (body) => api('/api/productos', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => api(`/api/productos/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  get: (id) => api(`/api/productos/${id}`),
  remove: (id) => api(`/api/productos/${id}`, { method: 'DELETE' }),
};

export const MetricasAPI = {
  list: () => api('/api/metricas'),
  byCampana: (campanaId) => api(`/api/metricas/${campanaId}`),
};

export const IntegracionesAPI = {
  list: () => api('/api/integraciones'),
  create: (body) => api('/api/integraciones', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => api(`/api/integraciones/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => api(`/api/integraciones/${id}`, { method: 'DELETE' }),
};

export const PanelAPI = {
  stats: () => api('/api/panel/estadisticas'),
  graficasProductos: () => api('/api/panel/graficas/productos'),
  graficasClientes: () => api('/api/panel/graficas/clientes'),
};

export const UsuariosAPI = {
  list: () => api('/api/usuarios'),
};

export const CotizacionesAPI = {
  // Campañas
  listCampanas: () => api('/api/cotizaciones/campanas'),
  createCampana: (body) => api('/api/cotizaciones/campanas', { method: 'POST', body: JSON.stringify(body) }),
  cotizarCampana: (id, body) => api(`/api/cotizaciones/campanas/${id}/cotizar`, { method: 'PUT', body: JSON.stringify(body) }),
  updateCampanaStatus: (id, estado) => api(`/api/cotizaciones/campanas/${id}/estado`, { method: 'PUT', body: JSON.stringify({ estado }) }),
  // Productos
  listProductos: () => api('/api/cotizaciones/productos'),
  createProducto: (body) => api('/api/cotizaciones/productos', { method: 'POST', body: JSON.stringify(body) }),
  updateProductoStatus: (id, estado) => api(`/api/cotizaciones/productos/${id}/estado`, { method: 'PUT', body: JSON.stringify({ estado }) }),
};

export const CampanaProductosAPI = {
  list: (campanaId) => api(`/api/campanas/${campanaId}/productos`),
  assign: (campanaId, body) => api(`/api/campanas/${campanaId}/productos`, { method: 'POST', body: JSON.stringify(body) }),
  remove: (id) => api(`/api/campanas/productos/${id}`, { method: 'DELETE' }),
};
