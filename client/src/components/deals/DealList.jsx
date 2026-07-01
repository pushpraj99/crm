import React, { useState } from 'react';
import { useDeals } from '../../hooks/useDeals';
import DealKanban from './DealKanban';
import { Search, Plus } from 'lucide-react';

const DealList = ({ onAddDeal, onEditDeal, onDeleteDeal }) => {
  const { deals, loading } = useDeals();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDeals = deals.filter(deal => {
    const titleMatch = deal.title.toLowerCase().includes(searchTerm.toLowerCase());
    const customerMatch = deal.customerId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    return titleMatch || customerMatch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search and Action Bar */}
      <div className="th-surface rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 border th-border">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search deals by title or customer..."
            className="w-full rounded-xl pl-10 pr-4 py-2 text-sm font-medium outline-none th-input"
          />
        </div>

        <button
          onClick={onAddDeal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-brand-600/15"
        >
          <Plus className="w-4 h-4" />
          New Deal
        </button>
      </div>

      {/* Kanban Pipeline View */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-400 text-sm">
          Loading deals...
        </div>
      ) : (
        <DealKanban 
          deals={filteredDeals} 
          onEditDeal={onEditDeal} 
          onDeleteDeal={onDeleteDeal} 
        />
      )}
    </div>
  );
};

export default DealList;
