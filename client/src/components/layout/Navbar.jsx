import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { Bell, Server } from 'lucide-react';

const Navbar = () => {
  const { currentPage } = useCRM();

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'customers':
        return 'Customer Database';
      case 'customer-details':
        return 'Customer Profile';
      case 'leads':
        return 'Lead Management';
      case 'deals':
        return 'Deal Pipeline';
      case 'activities':
        return 'Activity History';
      case 'settings':
        return 'System Settings';
      default:
        return 'CRM Console';
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-20">
      {/* Page Title */}
      <h1 className="text-xl font-bold text-white tracking-tight">
        {getPageTitle()}
      </h1>

      {/* Action Items */}
      <div className="flex items-center gap-6">
        {/* API connection indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50">
          <Server className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-slate-300">Connected</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
