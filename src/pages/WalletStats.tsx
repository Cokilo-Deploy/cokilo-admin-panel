import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';

interface WalletStats {
  totalWallets: number;
  totalBalance: number;
  pendingWithdrawals: number;
}

export const WalletStats: React.FC = () => {
  const [stats, setStats] = useState<WalletStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getWalletStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Erreur stats wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Statistiques Wallet</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Wallets actifs</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {Number(stats?.totalWallets) || 0}
              </p>
            </div>
            <div className="text-4xl">💳</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Solde total</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
  {Number(stats?.totalBalance || 0).toFixed(2)}€
</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Retraits en attente</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {Number(stats?.pendingWithdrawals) || 0}
              </p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>
      </div>
    </div>
  );
};