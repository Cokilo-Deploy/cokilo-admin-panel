import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  verificationStatus: string;
  isActive: boolean;
  createdAt: string;
}

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers(currentPage, search);
      setUsers(response.data.data.users);
      setTotalPages(response.data.data.pagination.pages);
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId: number, action: string) => {
    try {
      await adminAPI.updateUserStatus(userId, action);
      fetchUsers();
      alert(`Action ${action} effectuée avec succès`);
    } catch (error) {
      alert('Erreur lors de l\'action');
    }
  };

  const handleDelete = async (userId: number) => {
  if (!window.confirm('⚠️ ATTENTION : Supprimer définitivement cet utilisateur ?\n\n• Toutes ses données seront effacées\n• Son compte Stripe sera supprimé\n• Ses données Identity seront expurgées\n\nCette action est IRRÉVERSIBLE.')) {
    return;
  }

  try {
    await adminAPI.deleteUser(userId);
    alert('✅ Utilisateur supprimé complètement');
    fetchUsers();
  } catch (error) {
    alert('❌ Erreur lors de la suppression');
  }
};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Utilisateurs</h2>
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.verificationStatus === 'verified' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.verificationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => handleAction(user.id, 'verify')}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Vérifier
                      </button>
                      <button
  onClick={() => handleAction(user.id, user.isActive ? 'block' : 'unblock')}
  className={user.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}
>
  {user.isActive ? 'Bloquer' : 'Débloquer'}
</button>
<button
  onClick={() => handleDelete(user.id)}
  className="text-red-800 hover:text-red-900 font-semibold"
>
  Supprimer
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