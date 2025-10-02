import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const { admin, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">
          Bienvenue, {admin?.name}
        </h1>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">{admin?.email}</span>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
};