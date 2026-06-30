import React, { useState, useEffect } from 'react';
import { useCustomers } from '../../hooks/useCustomers';
import CustomerCard from './CustomerCard';
import { Search, Plus, SlidersHorizontal, ChevronLeft, ChevronRight, Grid, List, Building2, Mail, Phone, Eye } from 'lucide-react';
import { getStatusBadgeClass } from '../../utils/helpers';
import { useCRM } from '../../context/CRMContext';

const CustomerList = ({ onAddCustomer, onEditCustomer }) => {
  const { customers, customersPagination, loading, fetchCustomers } = useCustomers();
  const { setCurrentPage, setSelectedCustomerId } = useCRM();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // grid, list

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers({
        search: searchTerm,
        status: statusFilter,
        page: currentPageNum,
        limit: 8
      });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, statusFilter, currentPageNum]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (customersPagination.pages || 1)) {
      setCurrentPageNum(newPage);
    }
  };

  const handleViewDetails = (id) => {
    setSelectedCustomerId(id);
    setCurrentPage('customer-details');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search and Filter Panel */}
      <div className="th-surface rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPageNum(1); }}
            placeholder="Search by name, email, company..."
            className="w-full rounded-xl pl-10 pr-4 py-2 text-sm font-medium outline-none th-input"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Status Filter */}
          <div className="flex items-center gap-2 rounded-xl px-3 py-1.5" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <SlidersHorizontal className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPageNum(1); }}
              className="bg-transparent text-sm focus:outline-none cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="prospect">Prospect</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="rounded-xl p-1 flex gap-1" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-brand-600 text-white' : ''}`} style={viewMode !== 'grid' ? { color: 'var(--text-muted)' } : {}}>
              <Grid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-brand-600 text-white' : ''}`} style={viewMode !== 'list' ? { color: 'var(--text-muted)' } : {}}>
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Add Customer */}
          <button onClick={onAddCustomer} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-brand-600/15">
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Loading / Empty / Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-sm" style={{ color: 'var(--text-muted)' }}>Fetching customers...</div>
      ) : customers.length === 0 ? (
        <div className="th-surface rounded-2xl p-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No customers found matching your search.</div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {customers.map((customer) => <CustomerCard key={customer._id} customer={customer} />)}
        </div>
      ) : (
        <div className="th-surface rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-semibold uppercase tracking-wider" style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer._id} className="th-row-hover text-sm" style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                    <td className="px-6 py-4 font-semibold" style={{ color: 'var(--text-primary)' }}>{customer.name}</td>
                    <td className="px-6 py-4">
                      {customer.company ? (
                        <div className="flex items-center gap-1.5"><Building2 className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /><span>{customer.company}</span></div>
                      ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5"><Mail className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /><span>{customer.email}</span></div>
                    </td>
                    <td className="px-6 py-4">
                      {customer.phone ? (
                        <div className="flex items-center gap-1.5"><Phone className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /><span>{customer.phone}</span></div>
                      ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadgeClass(customer.status)}>{customer.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleViewDetails(customer._id)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--accent)', border: '1px solid var(--border)' }}>
                        <Eye className="w-3.5 h-3.5" />View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && customersPagination.pages > 1 && (
        <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Page <strong style={{ color: 'var(--text-primary)' }}>{customersPagination.page}</strong> of <strong style={{ color: 'var(--text-primary)' }}>{customersPagination.pages}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button onClick={() => handlePageChange(currentPageNum - 1)} disabled={currentPageNum === 1} className="p-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => handlePageChange(currentPageNum + 1)} disabled={currentPageNum === customersPagination.pages} className="p-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
