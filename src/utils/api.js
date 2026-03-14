import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const changePassword = (data) => API.put('/auth/change-password', data);

// Donors
export const getDonors = (params) => API.get('/donors', { params });
export const getDonorById = (id) => API.get(`/donors/${id}`);
export const getDonorStats = () => API.get('/donors/stats/overview');

// Requests
export const getRequests = (params) => API.get('/requests', { params });
export const createRequest = (data) => API.post('/requests', data);
export const getMyRequests = () => API.get('/requests/my');
export const updateRequestStatus = (id, status) => API.put(`/requests/${id}/status`, { status });
export const deleteRequest = (id) => API.delete(`/requests/${id}`);

// Camps & Misc
export const getCamps = () => API.get('/camps');
export const getTestimonials = () => API.get('/testimonials');
export const submitTestimonial = (data) => API.post('/testimonials', data);
export const recordDonation = (data) => API.post('/donations', data);
export const getMyDonations = () => API.get('/donations/my');

// Admin
export const getAdminDashboard = () => API.get('/admin/dashboard');
export const getAllUsers = (params) => API.get('/admin/users', { params });
export const toggleUserStatus = (id) => API.put(`/admin/users/${id}/toggle-status`);
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);
export const getAdminRequests = (params) => API.get('/admin/requests', { params });
export const getAdminCamps = () => API.get('/admin/camps');
export const createCamp = (data) => API.post('/admin/camps', data);
export const deleteCamp = (id) => API.delete(`/admin/camps/${id}`);
export const getAdminTestimonials = () => API.get('/admin/testimonials');
export const approveTestimonial = (id) => API.put(`/admin/testimonials/${id}/approve`);

export default API;
