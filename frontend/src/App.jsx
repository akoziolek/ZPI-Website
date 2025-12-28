import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, UserPage, ZPIPage, TopicsPage, TopicPage } from './pages';
import ProtectedRoute from './components/ProtectedRoute';
import { NotificationProvider } from './contexts/NotificationContext';
import NotificationContainer from './components/NotificationContainer';
import { useAuth } from './hooks/useAuth';

function AppContent() {
  const { user, loading, login, logout, handleTokenExpired } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <NotificationContainer />
      <Routes>
        <Route
          path="/login"
          element={
            user ? <Navigate to="/topics" replace /> : <LoginPage onLogin={login} />
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute user={user}>
              <UserPage user={user} onLogout={logout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zpi"
          element={
            <ProtectedRoute user={user}>
              <ZPIPage user={user} onLogout={logout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/topics"
          element={
            <ProtectedRoute user={user}>
              <TopicsPage user={user} onLogout={logout} onTokenExpired={handleTokenExpired} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/topics/:uuid"
          element={
            <ProtectedRoute user={user}>
              <TopicPage user={user} onLogout={logout} onTokenExpired={handleTokenExpired} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <ZPIPage user={user} onLogout={logout} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}

export default App;
