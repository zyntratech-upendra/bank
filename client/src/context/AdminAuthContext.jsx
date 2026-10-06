import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bank_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('bank_admin_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('bank_admin_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data.user) {
          setAdminUser(res.data.user);
          localStorage.setItem('bank_admin_user', JSON.stringify(res.data.user));
        }
      } catch (err) {
        console.warn('Auth verification fallback:', err.message);
        // If server is temporarily restarting, keep stored user if valid
        const saved = localStorage.getItem('bank_admin_user');
        if (saved) {
          setAdminUser(JSON.parse(saved));
        } else {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/admin-login', { email, password });
      const { token: receivedToken, user } = res.data;

      if (user.role !== 'admin' && user.role !== 'manager') {
        throw new Error('Access Denied: Admin authorization required');
      }

      localStorage.setItem('bank_admin_token', receivedToken);
      localStorage.setItem('bank_admin_user', JSON.stringify(user));
      setToken(receivedToken);
      setAdminUser(user);
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Authentication failed';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('bank_admin_token');
    localStorage.removeItem('bank_admin_user');
    setToken(null);
    setAdminUser(null);
  };

  const isAdmin = !!adminUser && (adminUser.role === 'admin' || adminUser.role === 'manager');

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        token,
        loading,
        isAuthenticated: !!token && !!adminUser,
        isAdmin,
        login,
        logout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
