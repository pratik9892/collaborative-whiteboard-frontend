import api from './api';

export const registerUser = async (name, email, username, password) => {
  try {
    const response = await api.post('/auth/register', {
      name,
      email,
      username,
      password
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};


export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};


export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user' };
  }
};


export const logoutUser = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Logout failed' };
  }
};
