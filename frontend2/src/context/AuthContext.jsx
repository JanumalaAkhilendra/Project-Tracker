import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/api';
import { socket } from '../socket';
import axios from 'axios';

const AuthContext = createContext();

api.defaults.baseURL = import.meta.env.VITE_API_URL;
api.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      socket.auth = { token };
      socket.connect();
      return () => {
        socket.disconnect();
      };
    } else {
      delete axios.defaults.headers.common['Authorization'];
      socket.disconnect();
    }
  }, [token]);

  const loadUser = async () => {
    try {
      if (token) {
        const { data } = await api.get('/api/auth/me');
        setUser(data.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
      logout(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      await loadUser();
      navigate(location.state?.from?.pathname || '/dashboard');
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (name, email, password, role = 'member') => {
    try {
      const { data } = await api.post('/api/auth/register', { name, email, password, role });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      await loadUser();
      navigate('/dashboard');
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const logout = (redirect = true) => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    socket.disconnect();
    if (redirect) navigate('/login');
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (!loading && !token && location.pathname !== '/login' && location.pathname !== '/register') {
      navigate('/login', { state: { from: location } });
    }
  }, [token, loading, location, navigate]);

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    loadUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
