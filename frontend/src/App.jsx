import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, UserPage, ZPIPage, TopicsPage } from './pages';
import ProtectedRoute from './components/ProtectedRoute';
import { verifyToken } from './api/apiFetch';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // check if there is a valid token
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        // Verify token with backend
        const verifiedUser = await verifyToken();
        if (verifiedUser) {
          setUser(verifiedUser);
        } else {
          // Token is invalid, clear localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user ? <Navigate to="/topics" replace /> : <LoginPage onLogin={handleLogin} />
        }
      />
      <Route
        path="/user"
        element={
          <ProtectedRoute user={user}>
            <UserPage user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/zpi"
        element={
          <ProtectedRoute user={user}>
            <ZPIPage user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/topics"
        element={
          <ProtectedRoute user={user}>
            <TopicsPage user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute user={user}>
            <ZPIPage user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
