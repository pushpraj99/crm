import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  Briefcase, 
  History, 
  Settings,
  TrendingUp
} from 'lucide-react';

const Sidebar = () => {
  const { currentPage, setCurrentPage } = useCRM();

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'leads', name: 'Leads', icon: Target },
    { id: 'deals', name: 'Deals', icon: Briefcase },
    { id: 'activities', name: 'Activities', icon: History },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-30">
      {/* Brand logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-md shadow-brand-500/20">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold text-lg bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-wide">
          Smart CRM
        </span>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id || (item.id === 'customers' && currentPage === 'customer-details');
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/15'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-brand-400 font-bold text-sm">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Admin User</p>
            <p className="text-xs text-slate-500 truncate">admin@smartcrm.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
