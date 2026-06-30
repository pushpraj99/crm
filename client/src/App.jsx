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

const AppContent = () => {
  const { currentPage } = useCRM();

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
