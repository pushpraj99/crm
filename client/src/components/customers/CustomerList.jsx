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
      <div className="glass rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800/80">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPageNum(1);
            }}
            placeholder="Search by name, email, company..."
            className="w-full bg-slate-950/60 border border-slate-800 focus:border-brand-500 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-800 rounded-xl px-3 py-1.5">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPageNum(1);
              }}
              className="bg-transparent text-sm text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-slate-900">All Statuses</option>
              <option value="active" className="bg-slate-900">Active</option>
              <option value="inactive" className="bg-slate-900">Inactive</option>
              <option value="prospect" className="bg-slate-900">Prospect</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-1 flex gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Add Customer */}
          <button
            onClick={onAddCustomer}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-brand-600/15"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-400 text-sm">
          Fetching customers...
        </div>
      ) : customers.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center text-slate-500 text-sm border border-slate-800/80">
          No customers found matching your search.
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {customers.map((customer) => (
            <CustomerCard key={customer._id} customer={customer} />
          ))}
        </div>
      ) : (
        /* List / Table Layout */
        <div className="glass rounded-2xl overflow-hidden border border-slate-800/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {customers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-slate-900/30 transition-colors text-sm text-slate-300">
                    <td className="px-6 py-4 font-semibold text-white">{customer.name}</td>
                    <td className="px-6 py-4">
                      {customer.company ? (
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-slate-500" />
                          <span>{customer.company}</span>
                        </div>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-slate-500" />
                        <span>{customer.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {customer.phone ? (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-4 h-4 text-slate-500" />
                          <span>{customer.phone}</span>
                        </div>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadgeClass(customer.status)}>{customer.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleViewDetails(customer._id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-400 text-xs font-semibold border border-slate-700/60 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && customersPagination.pages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <span className="text-xs text-slate-500">
            Showing Page <strong className="text-slate-300">{customersPagination.page}</strong> of <strong className="text-slate-300">{customersPagination.pages}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPageNum - 1)}
              disabled={currentPageNum === 1}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(currentPageNum + 1)}
              disabled={currentPageNum === customersPagination.pages}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
