import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  

  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  response => response,
  error => {

    if (error.response?.status === 401) {
      console.log('Auth token invalid or expired');

    }
    return Promise.reject(error);
  }
);

export default api;
