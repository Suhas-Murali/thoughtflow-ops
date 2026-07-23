import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const response = await api.post('/login', { email, password });
    const { token: newToken } = response.data;

    localStorage.setItem('token', newToken);
    setToken(newToken);

    // Decode the token payload to get basic user info (email, role)
    const payload = JSON.parse(atob(newToken.split('.')[1]));
    setUser({ email: payload.email, role: payload.role, userId: payload.userId });

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}