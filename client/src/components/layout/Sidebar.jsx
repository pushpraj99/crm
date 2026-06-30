import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  Briefcase, 
  History, 
  Settings,
  TrendingUp,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const { currentPage, setCurrentPage, user, triggerLogout } = useCRM();

  const menuItems = [
    { id: 'dashboard',  name: 'Dashboard',  icon: LayoutDashboard },
    { id: 'customers',  name: 'Customers',  icon: Users },
    { id: 'leads',      name: 'Leads',      icon: Target },
    { id: 'deals',      name: 'Deals',      icon: Briefcase },
    { id: 'activities', name: 'Activities', icon: History },
    { id: 'settings',   name: 'Settings',   icon: Settings },
  ];

  const initials = user?.name
    ? user.name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <aside
      className="th-sidebar w-64 border-r flex flex-col h-screen fixed left-0 top-0 z-30"
      style={{ borderColor: 'var(--border)' }}
    >
      {/* Brand */}
      <div className="h-16 flex items-center px-6 gap-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-md shadow-brand-500/20 shrink-0">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg tracking-wide" style={{ color: 'var(--text-primary)' }}>
          Smart <span style={{ color: 'var(--accent)' }}>CRM</span>
        </span>
      </div>

      {/* Nav label */}
      <div className="px-6 pt-6 pb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Navigation
        </span>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-3 pb-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id || (item.id === 'customers' && currentPage === 'customer-details');
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                  : ''
              }`}
              style={!isActive ? {
                color: 'var(--text-secondary)',
              } : {}}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Footer / User */}
      <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3 p-2 rounded-xl" style={{ color: 'var(--text-primary)' }}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-brand-600 dark:text-brand-400"
            style={{ backgroundColor: 'var(--accent-soft)', border: '1px solid var(--border-strong)' }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user?.name || 'User'}</p>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user?.email || ''}</p>
          </div>
          <button
            onClick={triggerLogout}
            title="Log Out"
            className="p-1.5 rounded-lg transition-colors hover:text-red-500"
            style={{ color: 'var(--text-muted)' }}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
