import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { LogOut, X } from 'lucide-react';

const LogoutConfirmModal = () => {
  const { showLogoutConfirm, setShowLogoutConfirm, logout } = useCRM();

  if (!showLogoutConfirm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => setShowLogoutConfirm(false)}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-sm th-surface rounded-2xl p-6 shadow-2xl animate-fade-in z-10 border border-slate-200 dark:border-slate-800">
        <button 
          onClick={() => setShowLogoutConfirm(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          <div className="w-12 h-12 rounded-full bg-red-500/10 dark:bg-red-500/20 text-red-500 flex items-center justify-center mb-4">
            <LogOut className="w-6 h-6" />
          </div>
          
          <h3 className="text-lg font-bold th-text-primary mb-2">
            Confirm Logout
          </h3>
          <p className="text-sm th-text-secondary mb-6">
            Are you sure you want to log out of Smart CRM?
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="flex-1 px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all duration-150 th-border th-text-secondary bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              No
            </button>
            <button
              onClick={logout}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm shadow-lg shadow-red-600/15 transition-all duration-150"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
