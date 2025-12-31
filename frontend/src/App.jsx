import React from 'react';
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
import NotificationContainer from './components/NotificationContainer';
import { ROLES } from './config';
import OpinionFormPage from './pages/OpinionFormPage';
import { NotificationProvider } from './providers/NotificationProvider';
import { ModalProvider } from './providers/ModalProvider';
import { AuthProvider } from './providers/AuthProvider';
import { useAuthContext } from './contexts/AuthContext';

const RootLayout = () => {
  return (
    <ModalProvider>
      <NotificationContainer />
      <Outlet />
    </ModalProvider>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/user"
        element={
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/topics"
        element={
          <ProtectedRoute>
            <TopicsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/topics/:uuid/opinion"
        element={
          <ProtectedRoute allowedRoles={[ROLES.KPK_MEMBER]}>
            <OpinionFormPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/topics/:uuid"
        element={
          <ProtectedRoute>
            <TopicPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/zpi"
        element={
          <ProtectedRoute>
            <ZPIPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <TopicsPage />
          </ProtectedRoute>
        }
      />
    </Route>
  )
);

function AppContent() {
  const { loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}


function App() {
  // auth nie wyzej?
  return (
    <NotificationProvider>
      <AuthProvider> 
        <AppContent />  
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;