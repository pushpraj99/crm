import React, { useState } from 'react';
import { useLeads } from '../../hooks/useLeads';
import LeadCard from './LeadCard';
import { Search, Plus, Filter } from 'lucide-react';

const LeadList = ({ onAddLead, onEditLead, onDeleteLead }) => {
  const { leads, loading } = useLeads();
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.assignedTo && lead.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSource = sourceFilter ? lead.source === sourceFilter : true;
    return matchesSearch && matchesSource;
  });

  const statuses = ['new', 'contacted', 'qualified', 'lost'];
  const getLeadsByStatus = (status) => {
    return filteredLeads.filter(l => l.status === status);
  };

  const statusDisplayNames = {
    new: 'New Leads',
    contacted: 'Contacted',
    qualified: 'Qualified',
    lost: 'Lost / Closed'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search and Filters */}
      <div className="glass rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800/80">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search leads by name, email, agent..."
            className="w-full bg-slate-950/60 border border-slate-800 focus:border-brand-500 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Source filter */}
          <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-800 rounded-xl px-3 py-1.5">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="bg-transparent text-sm text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-slate-900">All Sources</option>
              <option value="web" className="bg-slate-900">Web</option>
              <option value="referral" className="bg-slate-900">Referral</option>
              <option value="cold-call" className="bg-slate-900">Cold Call</option>
              <option value="social" className="bg-slate-900">Social</option>
            </select>
          </div>

          <button
            onClick={onAddLead}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-brand-600/15"
          >
            <Plus className="w-4 h-4" />
            Add Lead
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-400 text-sm">
          Loading leads...
        </div>
      ) : leads.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center text-slate-500 text-sm border border-slate-800/80">
          No leads registered. Click "Add Lead" to get started!
        </div>
      ) : (
        /* Status Columns */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {statuses.map(status => {
            const statusLeads = getLeadsByStatus(status);
            return (
              <div key={status} className="flex flex-col gap-4">
                {/* Column Title */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 px-1">
                  <span className="text-sm font-bold text-slate-200 capitalize">
                    {statusDisplayNames[status]}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-855 text-slate-400 border border-slate-700/50">
                    {statusLeads.length}
                  </span>
                </div>
                
                {/* Column Items */}
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {statusLeads.length === 0 ? (
                    <div className="border border-dashed border-slate-800 rounded-xl p-6 text-center text-xs text-slate-600">
                      Empty
                    </div>
                  ) : (
                    statusLeads.map(lead => (
                      <LeadCard 
                        key={lead._id} 
                        lead={lead} 
                        onEdit={onEditLead} 
                        onDelete={onDeleteLead}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LeadList;
