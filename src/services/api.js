import axios from 'axios';

const API_URL = `http://${window.location.hostname}:5000/api`;

const api = axios.create({
  baseURL: API_URL,
});

// ... existing interceptors ...
// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token expiration/invalid tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/admin/login')) {
      localStorage.removeItem('adminToken');
      alert('Session expired. Please login again.');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Menu APIs
export const fetchMenu = async () => {
  const response = await api.get('/menu');
  return response.data;
};

export const addMenuItem = async (itemData) => {
  const response = await api.post('/menu', itemData);
  return response.data;
};

export const deleteMenuItem = async (id) => {
  const response = await api.delete(`/menu/${id}`);
  return response.data;
};

// Order APIs
export const placeOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const fetchOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/orders/${id}`, { status });
  return response.data;
};

export const fetchOrderStatus = async (orderNumber) => {
  const response = await api.get(`/orders/status/${orderNumber}`);
  return response.data;
};

export const cancelOrder = async (orderNumber, reason) => {
  const response = await api.post(`/orders/cancel/${orderNumber}`, { reason });
  return response.data;
};

// Table APIs
export const fetchTables = async () => {
  const response = await api.get('/tables');
  return response.data;
};

export const addTable = async (tableNumber) => {
  const response = await api.post('/tables', { table_number: tableNumber });
  return response.data;
};

export const downloadSmallQRSheet = async () => {
  const response = await api.get('/qr/generate-small', { responseType: 'blob' });
  return response.data;
};

// Admin Auth API
export const adminLogin = async (email, password) => {
  const response = await api.post('/admin/login', { email, password });
  return response.data;
};
