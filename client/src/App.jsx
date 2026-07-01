import React from 'react';
import { CRMProvider, useCRM } from './context/CRMContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerDetails from './pages/CustomerDetails';
import Leads from './pages/Leads';
import Deals from './pages/Deals';
import Activities from './pages/Activities';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import Login from './pages/Login';

const AppContent = () => {
  const { currentPage, isAuthenticated, authLoading } = useCRM();

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-secondary)' }}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/20 mb-2">
          <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
        </div>
        <p className="text-sm font-medium animate-pulse">Loading CRM system...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (currentPage === 'login-admin') {
      return <Login portal="admin" />;
    }
    if (currentPage === 'login-agent' || currentPage === 'login') {
      return <Login portal="agent" />;
    }
    return <Landing />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'customers':
        return <Customers />;
      case 'customer-details':
        return <CustomerDetails />;
      case 'leads':
        return <Leads />;
      case 'deals':
        return <Deals />;
      case 'activities':
        return <Activities />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return <Layout>{renderPage()}</Layout>;
};

const App = () => {
  return (
    <CRMProvider>
      <AppContent />
    </CRMProvider>
  );
};

export default App;

