import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface DZDWallet {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  balance: number;
  lastUpdate: string;
}

export const DZDWallets: React.FC = () => {
  const [wallets, setWallets] = useState<DZDWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWallets();
  }, [currentPage]);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDZDWallets(currentPage);

      const wallets = response.data.data.wallets.map((w: { balance: any; }) => ({
  ...w,
  balance: Number(w.balance) || 0
}));
setWallets(wallets);

      setTotalPages(response.data.data.pagination.pages);
    } catch (error) {
      console.error('Erreur chargement wallets DZD:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const viewHistory = (userId: number) => {
    navigate(`/wallet/user/${userId}`);
  };
  

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Wallets Algériens (DZD)</h2>
        <div className="text-sm text-gray-600">
          Gestion des retraits manuels
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Solde</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dernière MAJ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {wallets.map((wallet) => (
                  <tr key={wallet.userId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {wallet.firstName} {wallet.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {wallet.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-semibold text-green-600">
                        {wallet.balance.toFixed(2)}€
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(wallet.lastUpdate)}
                    </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
  <button
    onClick={() => viewHistory(wallet.userId)}
    className="text-blue-600 hover:text-blue-800"
  >
    Historique
  </button>
  <button
    onClick={() => navigate(`/users/${wallet.userId}/withdrawals`)}
    className="text-green-600 hover:text-green-800"
  >
    Demandes retrait
  </button>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
            >
              Précédent
            </button>
            <span className="px-4 py-2">
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
};