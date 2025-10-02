import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';

interface WithdrawalRequest {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  swiftBic?: string;
  iban?: string;
  notes?: string;
  status: string;
  createdAt: string;
}

export const WithdrawalDetails: React.FC = () => {
  const { withdrawalId } = useParams<{ withdrawalId: string }>();
  const navigate = useNavigate();
  const [withdrawal, setWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchWithdrawalDetails();
  }, [withdrawalId]);

  const fetchWithdrawalDetails = async () => {
    try {
      setLoading(true);
      console.log('Fetching withdrawal ID:', withdrawalId);
      const response = await adminAPI.getWithdrawalDetails(Number(withdrawalId));
      console.log('Response complète:', response);
      console.log('Data reçue:', response.data);
      setWithdrawal(response.data.data);
    } catch (error) {
      console.error('Erreur chargement détails:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('Confirmer que le virement a été effectué ?')) {
      return;
    }

    try {
      setProcessing(true);
      await adminAPI.approveWithdrawal(Number(withdrawalId));
      alert('Demande approuvée avec succès');
      navigate(-1);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erreur lors de l\'approbation');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt('Raison du rejet:');
    if (!reason) return;

    try {
      setProcessing(true);
      await adminAPI.rejectWithdrawal(Number(withdrawalId), reason);
      alert('Demande rejetée');
      navigate(-1);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erreur lors du rejet');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  if (!withdrawal) {
    return <div className="text-center py-8">Demande non trouvée</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Retour
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          Détails de la demande de retrait #{withdrawalId}
        </h2>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Informations utilisateur */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            Informations utilisateur
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nom</p>
              <p className="font-medium">{withdrawal.userName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{withdrawal.userEmail}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Montant demandé</p>
              <p className="text-2xl font-bold text-green-600">
                {Number(withdrawal.amount).toFixed(2)}€
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date de demande</p>
              <p className="font-medium">
                {new Date(withdrawal.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </div>

        {/* Coordonnées bancaires */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            Coordonnées bancaires
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nom de la banque</p>
              <p className="font-medium">{withdrawal.bankName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Titulaire du compte</p>
              <p className="font-medium">{withdrawal.accountHolder}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Numéro de compte (RIB)</p>
              <p className="font-mono bg-gray-100 px-3 py-2 rounded">
                {withdrawal.accountNumber}
              </p>
            </div>
            {withdrawal.iban && (
              <div>
                <p className="text-sm text-gray-600">IBAN</p>
                <p className="font-mono bg-gray-100 px-3 py-2 rounded">
                  {withdrawal.iban}
                </p>
              </div>
            )}
            {withdrawal.swiftBic && (
              <div>
                <p className="text-sm text-gray-600">SWIFT/BIC</p>
                <p className="font-mono bg-gray-100 px-3 py-2 rounded">
                  {withdrawal.swiftBic}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {withdrawal.notes && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Notes</h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded">
              {withdrawal.notes}
            </p>
          </div>
        )}

        {/* Actions */}
        {withdrawal.status === 'pending' && (
          <div className="flex space-x-4 pt-4 border-t">
            <button
              onClick={handleReject}
              disabled={processing}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
            >
              Rejeter
            </button>
            <button
              onClick={handleApprove}
              disabled={processing}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              Marquer comme effectué
            </button>
          </div>
        )}

        {withdrawal.status !== 'pending' && (
          <div className="text-center py-4">
            <span className={`px-4 py-2 rounded-full ${
              withdrawal.status === 'approved' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              Statut: {withdrawal.status === 'approved' ? 'Approuvé' : 'Rejeté'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};