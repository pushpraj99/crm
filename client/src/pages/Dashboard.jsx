import React from 'react';
import { useCRM } from '../context/CRMContext';
import AdminDashboard from './AdminDashboard';
import StaffDashboard from './StaffDashboard';

const Dashboard = () => {
  const { user } = useCRM();
  const isAdminOrManager = user?.role === 'admin' || user?.role === 'manager';
  return isAdminOrManager ? <AdminDashboard /> : <StaffDashboard />;
};

export default Dashboard;
