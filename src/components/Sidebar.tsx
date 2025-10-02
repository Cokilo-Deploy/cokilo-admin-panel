import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Tableau de bord', icon: '📊' },
    { path: '/users', label: 'Utilisateurs', icon: '👥' },
    { path: '/trips', label: 'Voyages', icon: '✈️' },
    { path: '/transactions', label: 'Transactions', icon: '💰' },
    { path: '/wallet/stats', label: 'Wallet Stats', icon: '💳' },
    { path: '/wallet/dzd', label: 'Wallets DZD', icon: '🇩🇿' },
  ];

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">CoKilo Admin</h2>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};