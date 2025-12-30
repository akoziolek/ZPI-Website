import React, { useMemo } from 'react';
import { 
  createBrowserRouter, 
  RouterProvider, 
  createRoutesFromElements, 
  Route, 
  Navigate,
  Outlet 
} from 'react-router-dom';

import { LoginPage, UserPage, ZPIPage, TopicsPage, TopicPage } from './pages';
import ProtectedRoute from './components/ProtectedRoute';
import { NotificationProvider } from './contexts/NotificationContext';
import NotificationContainer from './components/NotificationContainer';
import { useAuth } from './hooks/useAuth';
import { ROLES } from './config';
import OpinionFormPage from './pages/OpinionFormPage';
import { ModalProvider } from './contexts/ModalContext';


const RootLayout = () => {
  return (
    <ModalProvider>
      <NotificationContainer />
      <Outlet />
    </ModalProvider>
  );
};

function AppContent() {
  const { user, loading, login, logout, handleTokenExpired } = useAuth();

  const router = useMemo(() => {
    return createBrowserRouter(
      createRoutesFromElements(
        <Route element={<RootLayout />}>
          
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
            path="/topics/:uuid/opinion"
            element={
              <ProtectedRoute user={user} allowedRoles={[ROLES.KPK_MEMBER]}>
                <OpinionFormPage user={user} onLogout={logout} onTokenExpired={handleTokenExpired} />
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
        </Route>
      )
    );
  }, [user, login, logout, handleTokenExpired]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <RouterProvider router={router} />
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