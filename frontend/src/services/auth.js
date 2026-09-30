import { apiRequest } from './api';

export function login(credentials) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

export function getCurrentUser() {
  return apiRequest('/auth/me');
}

export function logout() {
  localStorage.removeItem('mizan_token');
  localStorage.removeItem('mizan_user');
}
