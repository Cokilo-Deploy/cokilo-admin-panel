import axios from 'axios';

const API_URL = 'https://seal-app-og4c6.ondigitalocean.app/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminAPI = {
  login: (email: string, password: string) =>
    axios.post(`${API_URL}/admin/login`, { email, password }),

  getDashboard: () => api.get('/admin/dashboard'),

  getUsers: (page = 1, search = '', status = '') =>
    api.get('/admin/users', { params: { page, search, status } }),
  
  getUserDetails: (id: number) => api.get(`/admin/users/${id}`),
  
  updateUserStatus: (id: number, action: string) =>
    api.patch(`/admin/users/${id}/status`, { action }),

  getTrips: (page = 1, status = '') =>
    api.get('/admin/trips', { params: { page, status } }),

  getTransactions: (page = 1, status = '') =>
    api.get('/admin/transactions', { params: { page, status } }),
  
  resolveTransaction: (id: number, action: string) =>
    api.patch(`/admin/transactions/${id}/resolve`, { action }),
  
  getWalletStats: () => 
    api.get('/admin/wallet/stats'),

  getDZDWallets: (page = 1) => 
    api.get('/admin/wallet/dzd', { params: { page } }),

  getUserWalletHistory: (userId: number) => 
    api.get(`/admin/wallet/user/${userId}/history`),

  
  getWithdrawalDetails: (withdrawalId: number) => 
  api.get(`/admin/wallet/withdrawal/${withdrawalId}`),

  approveWithdrawal: (withdrawalId: number) => 
  api.post(`/admin/wallet/withdrawal/${withdrawalId}/approve`),

  rejectWithdrawal: (withdrawalId: number, reason: string) => 
  api.post(`/admin/wallet/withdrawal/${withdrawalId}/reject`, { reason }),

  getUserWithdrawalRequests: (userId: number) => 
    api.get(`/admin/users/${userId}/withdrawals`),

  deleteUser: (userId: number) =>
    api.delete(`/admin/users/${userId}`),
};
