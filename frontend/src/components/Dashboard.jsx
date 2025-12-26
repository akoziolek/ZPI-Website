import React from "react";
import Navbar from "./Navbar";

const Dashboard = ({ user, onLogout }) => {

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Witaj w Systemie Wspomagania ZPI!
              </h2>
              <p className="text-gray-600 mb-8">
                Jesteś zalogowany jako <strong>{user?.name} {user?.surname}</strong> ({user?.role?.role_name})
              </p>

              {/* User Info Card */}
              <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informacje o użytkowniku</h3>
                <div className="space-y-3 text-left">
                  <div>
                    <span className="font-medium text-gray-700">Imię i nazwisko:</span>
                    <span className="ml-2 text-gray-900">{user?.name} {user?.surname}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="ml-2 text-gray-900">{user?.mail}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Rola:</span>
                    <span className="ml-2 text-gray-900">{user?.role?.role_name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">ID użytkownika:</span>
                    <span className="ml-2 text-gray-900 font-mono text-sm">{user?.uuid}</span>
                  </div>
                </div>
              </div>

              {/* Feature Placeholder */}
              <div className="mt-8">
                <p className="text-sm text-gray-500">
                  Tutaj będą dostępne funkcje systemu ZPI takie jak zarządzanie tematami,
                  deklaracje, opinie i statystyki.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;