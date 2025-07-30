import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
    case 'AUTH_ERROR':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user - wrapped in useCallback to fix dependency issue
  const loadUser = useCallback(async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get('/api/auth/profile');
      dispatch({
        type: 'USER_LOADED',
        payload: res.data.user
      });
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' });
    }
  }, []);

  // Set auth token
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Register user
  const register = async (formData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const res = await axios.post('/api/auth/register', formData);
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data
      });
      
      setAuthToken(res.data.token);
      toast.success('Registration successful!');
      
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      dispatch({ type: 'REGISTER_FAIL' });
      toast.error(message);
      
      return { success: false, message };
    }
  };

  // Login user
  const login = async (formData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const res = await axios.post('/api/auth/login', formData);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      });
      
      setAuthToken(res.data.token);
      toast.success('Login successful!');
      
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAIL' });
      toast.error(message);
      
      return { success: false, message };
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  useEffect(() => {
    loadUser();
  }, [loadUser]); // Now loadUser is properly memoized

  const value = {
    ...state,
    register,
    login,
    logout,
    loadUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
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

export default AuthContext;
