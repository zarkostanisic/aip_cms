import axios from 'axios';

const axios_api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  // baseURL: '/aip/public',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Api-Key': 'adb69d232d124c98fe20400d9a4757d71380ba1d4200697e6817c99a30959ed1',
    'Authorization': `Bearer ${typeof localStorage.getItem('token') !== undefined ? localStorage.getItem('token') : ''}`,
    'X-Localization': 'sr'
  }
})

axios_api.interceptors.response.use(response => {
    return response;
}, error => {
    // 401
    if (error?.response?.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
    }
    
    // 404 || 403 || 406
    if (error?.response?.status === 404 || error?.response?.status === 403 || error?.response?.status === 406) {
        window.location.href = '/admin/dashboard';
    }

    return Promise.reject(error);
});

export default axios_api;
