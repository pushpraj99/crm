import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import LogoutConfirmModal from './LogoutConfirmModal';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* Sidebar - fixed */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pl-64 min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--bg-base)' }}>
          <div className="max-w-7xl mx-auto px-6 py-6 md:px-8 md:py-7 animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <LogoutConfirmModal />
    </div>
  );
};

export default Layout;
