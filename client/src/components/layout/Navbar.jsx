import React, { useState, useEffect, useRef } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Bell, Sun, Moon, Check, CheckSquare } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const Navbar = () => {
  const { 
    currentPage, 
    isDark, 
    toggleTheme, 
    notifications = [], 
    markNotificationRead, 
    markAllNotificationsRead 
  } = useCRM();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':        return 'Dashboard';
      case 'customers':        return 'Customers';
      case 'customer-details': return 'Customer Profile';
      case 'leads':            return 'Lead Management';
      case 'deals':            return 'Deal Pipeline';
      case 'activities':       return 'Activity History';
      case 'settings':         return 'Settings';
      default:                 return 'Smart CRM';
    }
  };

  const getPageSubtitle = () => {
    switch (currentPage) {
      case 'dashboard':        return 'Overview of your business pipeline';
      case 'customers':        return 'Manage and view customer records';
      case 'customer-details': return 'Detailed customer profile and history';
      case 'leads':            return 'Track and nurture your leads';
      case 'deals':            return 'Monitor deals and close rates';
      case 'activities':       return 'Activity and interaction log';
      case 'settings':         return 'System configuration and data';
      default:                 return '';
    }
  };

  return (
    <header
      className="th-navbar h-16 border-b flex items-center justify-between px-8 sticky top-0 z-20"
      style={{ borderColor: 'var(--border)' }}
    >
      {/* Page Title */}
      <div>
        <h1 className="text-lg font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
          {getPageTitle()}
        </h1>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {getPageSubtitle()}
        </p>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative p-2 rounded-xl transition-colors hover:bg-[var(--bg-hover)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 flex items-center justify-center bg-indigo-600 text-white font-extrabold text-[9px] rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div 
              className="absolute right-0 mt-2 w-80 rounded-2xl th-surface shadow-lg z-50 overflow-hidden animate-scale-in"
              style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)' }}
            >
              <div className="p-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={() => {
                      markAllNotificationsRead();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n._id} 
                      className={`p-3 border-b text-xs flex items-start gap-2.5 transition-colors hover:bg-[var(--bg-hover)] ${!n.isRead ? 'bg-[var(--bg-elevated)]' : ''}`}
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className={`font-semibold ${!n.isRead ? 'text-[var(--text-primary)] font-bold' : 'text-[var(--text-secondary)]'}`}>
                            {n.title}
                          </span>
                          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                            {formatDate(n.createdAt)}
                          </span>
                        </div>
                        <p className="line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                          {n.message}
                        </p>
                      </div>

                      {!n.isRead && (
                        <button 
                          onClick={() => markNotificationRead(n._id)}
                          className="p-1 rounded-lg hover:bg-emerald-500/10 text-emerald-500 shrink-0"
                          title="Mark as read"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all duration-200"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)'
          }}
        >
          {isDark ? (
            <><Sun className="w-4 h-4 text-amber-400" /><span className="hidden sm:inline text-xs">Light</span></>
          ) : (
            <><Moon className="w-4 h-4 text-brand-600" /><span className="hidden sm:inline text-xs">Dark</span></>
          )}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
