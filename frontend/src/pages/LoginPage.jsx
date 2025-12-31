import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuthContext } from "../contexts/AuthContext";

const LoginPage = () => {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(`${backendUrl}/users`);
        const json = await res.json();
        setUsers(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);


  // Obsługa logowania
    
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setLoggingIn(true);
      setError("");

      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      // ujednolicić zapytania do bazy!
      const res = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mail: selectedUser.mail }),
         credentials: "include",
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      localStorage.setItem("token", json.token);
      localStorage.setItem("user", JSON.stringify(json.user));

      login(json.user);
      navigate("/topics");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoggingIn(false);
    }
  };

  

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-col justify-center py-6 sm:px-6 lg:px-8 flex-1">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Proszę wybrać użytkownika do zalogowania
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Konta są testowe, nie wymagają znajomości hasła
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gray-100 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {loadingUsers && (
              <div className="text-center text-gray-500">Ładowanie użytkowników...</div>
            )}

            {error && (
              <div className="text-center text-red-600 mb-4">{error}</div>
            )}

            {!error && (  
              <div className="grid grid-cols-1 gap-3 overflow-y-scroll h-96">
                {!loadingUsers && 
                  users
                    .slice() 
                    .sort((a, b) => a.role.localeCompare(b.role))
                    .map((user) => (
                  <button
                    key={user.uuid}
                    onClick={() => setSelectedUser(user)}
                    className={`w-full text-left px-4 py-3 border rounded-md transition-colors ${
                      selectedUser?.uuid === user.uuid
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium">
                      {user.role} ({user.name} {user.surname})
                    </div>
                    <div className="text-sm text-gray-500">{user.mail}</div>
                  </button>
                ))}

              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6 mt-4">
              <button
                type="submit"
                disabled={loggingIn || !selectedUser}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loggingIn ? "logowanie..." : `Zaloguj`}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
