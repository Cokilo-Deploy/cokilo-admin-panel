import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';

interface StatusHistoryItem {
  status: string;
  timestamp: string;
  notes?: string;
}

interface Transaction {
  id: number;
  amount: number;
  serviceFee: number;
  status: string;
  statusHistory: StatusHistoryItem[];
  packageDescription: string;
  createdAt: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  paymentReleasedAt?: string;
  senderName: string;
  travelerName: string;
}

export const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, [currentPage]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getTransactions(currentPage);
      
      // Parser statusHistory qui est en JSON string
      const parsedTransactions = response.data.data.transactions.map((t: any) => ({
        ...t,
        statusHistory: typeof t.statusHistory === 'string' 
          ? JSON.parse(t.statusHistory) 
          : t.statusHistory
      }));
      
      setTransactions(parsedTransactions);
      setTotalPages(response.data.data.pagination.pages);
    } catch (error) {
      console.error('Erreur chargement transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'payment_pending': 'Paiement en attente',
      'payment_escrowed': 'Paiement sécurisé',
      'package_picked_up': 'Colis récupéré',
      'payment_released': 'Livraison confirmée',
      'cancelled': 'Annulée'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'payment_pending': 'bg-yellow-100 text-yellow-800',
      'payment_escrowed': 'bg-blue-100 text-blue-800',
      'package_picked_up': 'bg-purple-100 text-purple-800',
      'payment_released': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Transactions</h2>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expéditeur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voyageur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <React.Fragment key={transaction.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">#{transaction.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{transaction.senderName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{transaction.travelerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {Number(transaction.amount).toFixed(2)}€
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(transaction.status)}`}>
                      {getStatusLabel(transaction.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setExpandedRow(expandedRow === transaction.id ? null : transaction.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {expandedRow === transaction.id ? 'Masquer' : 'Détails'}
                    </button>
                  </td>
                </tr>
                
                {expandedRow === transaction.id && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 bg-gray-50">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Description du colis</h4>
                          <p className="text-sm text-gray-700">{transaction.packageDescription}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">Historique des étapes</h4>
                          <div className="space-y-3">
                            {transaction.statusHistory.map((item, index) => (
                              <div key={index} className="flex items-start space-x-3 border-l-2 border-blue-500 pl-4">
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{getStatusLabel(item.status)}</p>
                                  <p className="text-xs text-gray-500">{formatDate(item.timestamp)}</p>
                                  {item.notes && (
                                    <p className="text-xs text-gray-600 mt-1">{item.notes}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                          <div>
                            <p className="text-xs text-gray-600">Colis récupéré</p>
                            <p className="text-sm font-medium">{formatDate(transaction.pickedUpAt)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Colis livré</p>
                            <p className="text-sm font-medium">{formatDate(transaction.deliveredAt)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Paiement libéré</p>
                            <p className="text-sm font-medium">{formatDate(transaction.paymentReleasedAt)}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
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
        <span className="px-4 py-2">Page {currentPage} sur {totalPages}</span>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};