import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('servex_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [ngo, setNgo] = useState(() => {
    const saved = localStorage.getItem('servex_ngo');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('servex_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('servex_token');
      if (savedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.success) {
            setUser(res.data.data.user);
            setNgo(res.data.data.ngo || null);
            localStorage.setItem('servex_user', JSON.stringify(res.data.data.user));
            if (res.data.data.ngo) {
              localStorage.setItem('servex_ngo', JSON.stringify(res.data.data.ngo));
            }
          }
        } catch {
          // Token invalid, clear storage
          localStorage.removeItem('servex_token');
          localStorage.removeItem('servex_user');
          localStorage.removeItem('servex_ngo');
          setUser(null);
          setNgo(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password, role) => {
    try {
      const res = await api.post('/auth/login', { email, password, role });
      const { user: userData, ngo: ngoData, accessToken } = res.data.data;

      setUser(userData);
      setNgo(ngoData || null);
      setToken(accessToken);

      localStorage.setItem('servex_token', accessToken);
      localStorage.setItem('servex_user', JSON.stringify(userData));
      if (ngoData) {
        localStorage.setItem('servex_ngo', JSON.stringify(ngoData));
      }

      toast.success(`Welcome back, ${userData.fullName}!`);
      return { success: true, user: userData, ngo: ngoData };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(msg);
      return { success: false, message: msg, code: err.response?.data?.code, storedRole: err.response?.data?.storedRole };
    }
  };

  const googleLogin = async (credential, selectedRole, extra = {}) => {
    try {
      const payload = {
        credential: credential || 'sim_google_token',
        role: selectedRole,
        ...extra,
      };
      if (extra?.profile) {
        payload.profile = extra.profile;
      }
      if (extra?.simulatedUser) {
        payload.simulatedUser = extra.simulatedUser;
      }
      if (extra?.isSimulated) {
        payload.isSimulated = true;
      }
      const res = await api.post('/auth/google', payload);
      if (res.data?.code === 'NGO_REGISTRATION_REQUIRED') {
        return {
          success: false,
          code: 'NGO_REGISTRATION_REQUIRED',
          message: res.data.message,
          data: res.data.data,
        };
      }
      const { user: userData, ngo: ngoData, accessToken } = res.data.data;

      setUser(userData);
      setNgo(ngoData || null);
      setToken(accessToken);

      localStorage.setItem('servex_token', accessToken);
      localStorage.setItem('servex_user', JSON.stringify(userData));
      if (ngoData) {
        localStorage.setItem('servex_ngo', JSON.stringify(ngoData));
      }

      toast.success(`Welcome back, ${userData.fullName}!`);
      return { success: true, user: userData, ngo: ngoData };
    } catch (err) {
      const msg = err.response?.data?.message || 'Google sign-in failed.';
      const code = err.response?.data?.code;
      toast.error(msg);
      return { success: false, message: msg, code, storedRole: err.response?.data?.storedRole };
    }
  };


  const registerDonor = async (payload) => {
    try {
      const res = await api.post('/auth/register/donor', payload);
      const { user: userData, accessToken } = res.data.data;

      setUser(userData);
      setToken(accessToken);

      localStorage.setItem('servex_token', accessToken);
      localStorage.setItem('servex_user', JSON.stringify(userData));

      toast.success('Donor account created successfully!');
      return { success: true, user: userData };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const registerNGO = async (payload) => {
    try {
      const res = await api.post('/auth/register/ngo', payload);
      const { user: userData, ngo: ngoData, accessToken } = res.data.data;

      setUser(userData);
      setNgo(ngoData);
      setToken(accessToken);

      localStorage.setItem('servex_token', accessToken);
      localStorage.setItem('servex_user', JSON.stringify(userData));
      localStorage.setItem('servex_ngo', JSON.stringify(ngoData));

      toast.success('NGO registration submitted for administrative review!');
      return { success: true, user: userData, ngo: ngoData };
    } catch (err) {
      const msg = err.response?.data?.message || 'NGO registration failed.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    }
    localStorage.removeItem('servex_token');
    localStorage.removeItem('servex_user');
    localStorage.removeItem('servex_ngo');
    setUser(null);
    setNgo(null);
    setToken(null);
    toast.success('Signed out successfully');
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data?.success) {
        setUser(res.data.data.user);
        setNgo(res.data.data.ngo || null);
        localStorage.setItem('servex_user', JSON.stringify(res.data.data.user));
        if (res.data.data.ngo) {
          localStorage.setItem('servex_ngo', JSON.stringify(res.data.data.ngo));
        }
      }
    } catch (err) {
      console.error('Failed to refresh user', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        ngo,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        googleLogin,
        registerDonor,
        registerNGO,
        logout,
        refreshUser,

      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
