import axios from 'axios';

export default axios.create({
  baseURL: 'http://127.0.0.1:8000',
  // baseURL: '/aip/public',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Api-Key': 'adb69d232d124c98fe20400d9a4757d71380ba1d4200697e6817c99a30959ed1',
    'Authorization': `Bearer ${typeof localStorage.getItem('token') !== undefined ? localStorage.getItem('token') : ''}`
  }
});
