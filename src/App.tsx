import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Users } from './pages/Users';
import { Trips } from './pages/Trips';
import { Transactions } from './pages/Transactions';
import { WalletStats } from './pages/WalletStats';
import { DZDWallets } from './pages/DZDWallets';
import { UserWalletHistory } from './pages/UserWalletHistory';
import { WithdrawalDetails } from './pages/WithdrawalDetails';
import { UserWithdrawals } from './pages/UserWithdrawals';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route  path="/users"  element={
             <ProtectedRoute>
              <Layout>
              <Users />
              </Layout>
            </ProtectedRoute>
           }
         />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />  
          <Route
  path="/trips"
  element={
    <ProtectedRoute>
      <Layout>
        <Trips />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/transactions"
  element={
    <ProtectedRoute>
      <Layout>
        <Transactions />
      </Layout>
    </ProtectedRoute>
  }
  />
  <Route
            path="/wallet/stats"
            element={
              <ProtectedRoute>
                <Layout>
                  <WalletStats />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/wallet/dzd"
            element={
              <ProtectedRoute>
                <Layout>
                  <DZDWallets />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
  path="/wallet/user/:userId"
  element={
    <ProtectedRoute>
      <Layout>
        <UserWalletHistory />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/users/:userId/withdrawals"
  element={
    <ProtectedRoute>
      <Layout>
        <UserWithdrawals />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/wallet/withdrawal-details/:withdrawalId"
  element={
    <ProtectedRoute>
      <Layout>
        <WithdrawalDetails />
      </Layout>
    </ProtectedRoute>
  }
/>
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>

    
  );
}

export default App;