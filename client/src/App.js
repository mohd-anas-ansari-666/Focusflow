import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import HabitsPage from './components/habits/HabitsPage';
import TimerPage from './components/timer/TimerPage';
import StatsPage from './components/stats/StatsPage';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <ThemeProvider>

      <AuthProvider>
        <Router>
          <div className="App">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
            
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />

              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/dashboard" />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="habits" element={<HabitsPage />} />
                <Route path="timer" element={<TimerPage />} />
                <Route path="stats" element={<StatsPage />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>

  );
}

export default App;
