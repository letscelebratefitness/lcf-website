import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 15000,
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('lcf_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('lcf_admin_token');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

// ── Page APIs ──────────────────────────────────────────
export const getPage = (pageName) => API.get(`/pages/${pageName}`);
export const updatePage = (pageName, data) => API.put(`/pages/${pageName}`, data);
export const updateSection = (pageName, idx, data) => API.patch(`/pages/${pageName}/sections/${idx}`, data);
export const reorderSections = (pageName, sectionOrders) => API.patch(`/pages/${pageName}/reorder`, { sectionOrders });

// ── Event APIs ─────────────────────────────────────────
export const getEvents = (params) => API.get('/events', { params });
export const getAllEvents = () => API.get('/events/all');
export const getEvent = (id) => API.get(`/events/${id}`);
export const createEvent = (data) => API.post('/events', data);
export const updateEvent = (id, data) => API.put(`/events/${id}`, data);
export const deleteEvent = (id) => API.delete(`/events/${id}`);

// ── Gallery APIs ───────────────────────────────────────
export const getGallery = (params) => API.get('/gallery', { params });
export const getAllGallery = () => API.get('/gallery/all');
export const addGalleryImage = (data) => API.post('/gallery', data);
export const updateGalleryImage = (id, data) => API.put(`/gallery/${id}`, data);
export const deleteGalleryImage = (id) => API.delete(`/gallery/${id}`);

// ── Upload APIs ────────────────────────────────────────
export const uploadImage = (formData) => API.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// ── Contact APIs ───────────────────────────────────────
export const submitContact = (data) => API.post('/contact', data);
export const getContacts = () => API.get('/contact');
export const markContactRead = (id) => API.patch(`/contact/${id}/read`);
export const deleteContact = (id) => API.delete(`/contact/${id}`);

// ── Auth APIs ──────────────────────────────────────────
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const changePassword = (data) => API.put('/auth/password', data);

export default API;
