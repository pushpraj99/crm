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
  LogOut,
  Crown,
  UserCircle,
  ClipboardList,
  ShieldCheck,
} from 'lucide-react';

/* ─── Admin / Manager: full CRM access ─── */
const ADMIN_NAV = [
  { id: 'dashboard',  name: 'Dashboard',  icon: LayoutDashboard },
  { id: 'customers',  name: 'Customers',  icon: Users },
  { id: 'leads',      name: 'Leads',      icon: Target },
  { id: 'deals',      name: 'Deals',      icon: Briefcase },
  { id: 'activities', name: 'Activities', icon: History },
];

/* ─── Agent / Viewer: only personal workspace ─── */
const STAFF_NAV = [
  { id: 'dashboard',  name: 'My Dashboard', icon: LayoutDashboard },
  { id: 'leads',      name: 'My Leads',     icon: Target },
  { id: 'deals',      name: 'My Deals',     icon: Briefcase },
  { id: 'activities', name: 'My Tasks',     icon: ClipboardList },
];

const NavBtn = ({ item, active, onClick }) => {
  const Icon = item.icon;
  return (
    <button
      onClick={() => onClick(item.id)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
        active
          ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {item.name}
    </button>
  );
};

const Sidebar = () => {
  const { currentPage, setCurrentPage, user, triggerLogout } = useCRM();
  const isAdmin = user?.role === 'admin' || user?.role === 'manager';
  const nav = isAdmin ? ADMIN_NAV : STAFF_NAV;

  const initials = user?.name
    ? user.name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const ROLE_BADGE = {
    admin:   { label: 'Administrator', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    manager: { label: 'Manager',       color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    agent:   { label: 'Agent',         color: '#818cf8', bg: 'rgba(129,140,248,0.12)' },
    viewer:  { label: 'Viewer',        color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
  };
  const badge = ROLE_BADGE[user?.role] ?? { label: user?.role ?? '', color: 'var(--text-muted)', bg: 'transparent' };

  return (
    <aside
      className="th-sidebar w-64 border-r flex flex-col h-screen fixed left-0 top-0 z-30"
      style={{ borderColor: 'var(--border)' }}
    >
      {/* ── Brand + Portal Badge ── */}
      <div className="h-16 flex items-center px-5 gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-md shadow-brand-500/20 shrink-0">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-base tracking-wide" style={{ color: 'var(--text-primary)' }}>
            Smart <span style={{ color: 'var(--accent)' }}>CRM</span>
          </span>
          <span
            className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md w-fit"
            style={{ background: badge.bg, color: badge.color }}
          >
            {isAdmin ? '⚡ Admin Portal' : '👤 Staff Portal'}
          </span>
        </div>
      </div>

      {/* ── Main Nav ── */}
      <nav className="flex-1 px-3 pt-4 pb-2 space-y-1 overflow-y-auto">

        {/* Section label */}
        <p className="text-[9px] font-bold uppercase tracking-widest px-2 pb-2" style={{ color: 'var(--text-muted)' }}>
          {isAdmin ? 'Management' : 'My Workspace'}
        </p>

        {nav.map(item => (
          <NavBtn
            key={item.id}
            item={item}
            active={currentPage === item.id || (item.id === 'customers' && currentPage === 'customer-details')}
            onClick={setCurrentPage}
          />
        ))}

        {/* ── Administration section — admin only ── */}
        {isAdmin && (
          <>
            <p className="text-[9px] font-bold uppercase tracking-widest px-2 pt-4 pb-2" style={{ color: 'var(--text-muted)' }}>
              Administration
            </p>
            <button
              onClick={() => setCurrentPage('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                currentPage === 'settings'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'hover:bg-amber-500/10 hover:text-amber-500'
              }`}
              style={{ color: currentPage === 'settings' ? 'white' : '#f59e0b' }}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              Team & System
            </button>
          </>
        )}

        {/* ── Profile / Settings — staff only ── */}
        {!isAdmin && (
          <>
            <p className="text-[9px] font-bold uppercase tracking-widest px-2 pt-4 pb-2" style={{ color: 'var(--text-muted)' }}>
              Account
            </p>
            <button
              onClick={() => setCurrentPage('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                currentPage === 'settings'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
              }`}
            >
              <UserCircle className="w-4 h-4 shrink-0" />
              My Profile
            </button>
          </>
        )}
      </nav>

      {/* ── Footer: User Card ── */}
      <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
        <div
          className="flex items-center gap-3 p-2.5 rounded-xl"
          style={{ background: badge.bg }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: badge.bg, border: `1.5px solid ${badge.color}`, color: badge.color }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              {user?.name || 'User'}
            </p>
            <div className="flex items-center gap-1">
              {isAdmin && <Crown className="w-3 h-3 shrink-0" style={{ color: badge.color }} />}
              <p className="text-[10px] font-bold truncate" style={{ color: badge.color }}>
                {badge.label}
              </p>
            </div>
          </div>
          <button
            onClick={triggerLogout}
            title="Log Out"
            className="p-1.5 rounded-lg transition-colors hover:text-red-500 hover:bg-red-500/10"
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
