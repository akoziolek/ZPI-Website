import { 
  createBrowserRouter, 
  RouterProvider, 
  createRoutesFromElements, 
  Route, 
  Outlet 
} from 'react-router-dom';

// Importy stron
import LoginPage from './pages/LoginPage';
import UserPage from './pages/UserPage';
import ZPIPage from './pages/ZPIPage';
import TopicPage from './pages/TopicPage';
import TopicsPage from './pages/TopicsPage';
import OpinionFormPage from './pages/OpinionFormPage';

// Importy komponentów i konfiguracji
import ProtectedRoute from './components/ProtectedRoute';
import NotificationContainer from './components/NotificationContainer';
import AnnouncementModal from './components/AnnouncementModal';
import { ROLES } from './config';

// Importy Providerów i Contextu
import { NotificationProvider } from './providers/NotificationProvider';
import { ModalProvider } from './providers/ModalProvider';
import { AuthProvider } from './providers/AuthProvider';
import { useAuthContext } from './contexts/AuthContext';

const RootLayout = () => {
  return (
    <>
      <NotificationContainer />
      <AnnouncementModal /> 
      <Outlet />
    </>
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
  return (
    <NotificationProvider>
      <AuthProvider>
        <ModalProvider>
            {/* Renderujemy AppContent, który ma dostęp do wszystkich contextów powyżej */}
            <AppContent />
        </ModalProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;