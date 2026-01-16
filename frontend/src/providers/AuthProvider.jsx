import { useAuth } from '../hooks/useAuth';
import { AuthContext } from '../contexts/AuthContext';

// 2. Główny komponent Providera
export const AuthProvider = ({ children }) => {
  const auth = useAuth(); 

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};
