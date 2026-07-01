import React, { useState } from 'react';
import { useLeads } from '../../hooks/useLeads';
import { useCRM } from '../../context/CRMContext';
import LeadCard from './LeadCard';
import { Search, Plus, Filter } from 'lucide-react';

const LeadList = ({ onAddLead, onEditLead, onDeleteLead }) => {
  const { leads, loading } = useLeads();
  const { user } = useCRM();
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');

  const isStaff = user?.role === 'agent' || user?.role === 'viewer';

  // Filter leads first if user is standard staff
  const targetLeads = isStaff
    ? leads.filter(l => l.assignedTo && user?.name && l.assignedTo.trim().toLowerCase() === user.name.trim().toLowerCase())
    : leads;

  const filteredLeads = targetLeads.filter(lead => {
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
      <div className="th-surface rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 border th-border">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search leads by name, email, agent..."
            className="w-full rounded-xl pl-10 pr-4 py-2 text-sm font-medium outline-none th-input"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Source filter */}
          <div 
            className="flex items-center gap-2 border th-border rounded-xl px-3 py-1.5"
            style={{ backgroundColor: 'var(--bg-elevated)' }}
          >
            <Filter className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="bg-transparent text-sm th-text-secondary focus:outline-none cursor-pointer"
            >
              <option value="">All Sources</option>
              <option value="web">Web</option>
              <option value="referral">Referral</option>
              <option value="cold-call">Cold Call</option>
              <option value="social">Social</option>
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
        <div className="flex justify-center items-center py-20 th-text-muted text-sm">
          Loading leads...
        </div>
      ) : leads.length === 0 ? (
        <div className="th-surface rounded-2xl p-12 text-center th-text-secondary text-sm border th-border">
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
                <div className="flex items-center justify-between border-b th-border pb-2 px-1">
                  <span className="text-sm font-bold th-text-primary capitalize">
                    {statusDisplayNames[status]}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded th-badge-accent">
                    {statusLeads.length}
                  </span>
                </div>
                
                {/* Column Items */}
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {statusLeads.length === 0 ? (
                    <div className="border border-dashed th-border rounded-xl p-6 text-center text-xs th-text-muted">
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
