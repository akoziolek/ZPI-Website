import React from "react";
import Navbar from "../components/Navbar";

const UserPage = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6 mb-6 text-center">
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
              <span className="ml-2 text-gray-900">{user?.role}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">ID użytkownika:</span>
              <span className="ml-2 text-gray-900 font-mono text-sm">{user?.uuid}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserPage;