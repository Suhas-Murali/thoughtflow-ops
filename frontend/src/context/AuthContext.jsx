import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { email: payload.email, role: payload.role, userId: payload.userId };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const existingToken = localStorage.getItem('token');
    return existingToken ? decodeToken(existingToken) : null;
  });

  const login = async (email, password) => {
    const response = await api.post('/login', { email, password });
    const { token: newToken } = response.data;

    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(decodeToken(newToken));

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