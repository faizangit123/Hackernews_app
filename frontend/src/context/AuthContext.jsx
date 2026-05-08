import { createContext, useContext, useState } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage so login persists on refresh
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ---- REGISTER ----
  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.post('/auth/register', {
        username,
        email,
        password,
      });
      // Save user + token to state and localStorage
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // ---- LOGIN ----
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // ---- LOGOUT ----
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // ---- CLEAR ERROR ----
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, register, login, logout, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};