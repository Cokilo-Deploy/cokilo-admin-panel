import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';

interface Stats {
  users: { total: number; active: number };
  trips: { total: number; active: number };
  transactions: { total: number; pending: number };
  revenue: {
    total: number;
    completedTransactions: number;
  };
  monthlyRevenue: number;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setStats(response.data.data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  if (!stats) {
    return <div className="text-center py-8">Erreur chargement des statistiques</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Tableau de bord</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Utilisateurs */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Utilisateurs</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.users.total}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {stats.users.active} actifs
              </p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        {/* Voyages */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Voyages</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.trips.total}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {stats.trips.active} actifs
              </p>
            </div>
            <div className="text-4xl">✈️</div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Transactions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.transactions.total}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {stats.transactions.pending} en attente
              </p>
            </div>
            <div className="text-4xl">💳</div>
          </div>
        </div>

        {/* Revenus du mois */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Revenus (mois)</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {Number(stats.monthlyRevenue).toFixed(2)}€
              </p>
              <p className="text-sm text-gray-500 mt-1">Ce mois-ci</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>

        {/* Revenus totaux - Carte plus large */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm font-medium opacity-90">Revenus totaux</p>
              <p className="text-4xl font-bold mt-2">
                {Number(stats?.revenue?.total).toFixed(2)}€
              </p>
              <p className="text-sm opacity-90 mt-2">
  {Number(stats?.revenue?.completedTransactions) || 0} transactions complétées
</p>
            </div>
            <div className="text-6xl opacity-20">💰</div>
          </div>
        </div>
      </div>

      {/* Section Activité récente */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Activité récente</h3>
        <p className="text-gray-600">
          Les statistiques détaillées seront affichées ici.
        </p>
      </div>
    </div>
  );
};