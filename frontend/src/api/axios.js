import axios from 'axios';

const baseURL = (import.meta.env && import.meta.env.VITE_API_URL) ? import.meta.env.VITE_API_URL : 'http://localhost:5001';

const API = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

if (import.meta.env.DEV) {
  API.interceptors.request.use(req => {
    console.debug('[API] req', req.method?.toUpperCase(), req.url, req.data || req.params || '');
    return req;
  }, err => {
    console.error('[API] req err', err);
    return Promise.reject(err);
  });

  API.interceptors.response.use(res => {
    console.debug('[API] res', res.status, res.config.url, res.data);
    return res;
  }, err => {
    console.error('[API] res err', err?.response?.status, err?.response?.data || err.message);
    return Promise.reject(err);
  });
}

API.getErrorMessage = (err) => {
  if (!err) return 'Unknown error';
  if (err.response?.data?.error) return err.response.data.error;
  if (err.response?.data) return JSON.stringify(err.response.data);
  if (err.message) return err.message;
  return String(err);
};

export default API;
