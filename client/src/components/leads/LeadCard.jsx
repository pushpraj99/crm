import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { getStatusBadgeClass } from '../../utils/helpers';
import { Mail, Phone, User, Globe, Edit, Trash2 } from 'lucide-react';

const LeadCard = ({ lead, onEdit, onDelete }) => {
  const { updateLead } = useCRM();

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateLead(lead._id, { status: newStatus });
    } catch (error) {
      console.error('Failed to update lead status:', error);
    }
  };

  return (
    <div className="glass border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-full transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-brand-500/5">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-white text-base truncate">{lead.name}</h4>
            <div className="flex items-center gap-1.5 mt-1 text-slate-400 text-xs">
              <Globe className="w-3.5 h-3.5" />
              <span className="truncate">Source: {lead.source}</span>
            </div>
          </div>
          <span className={getStatusBadgeClass(lead.status)}>{lead.status}</span>
        </div>

        {/* Contact details */}
        <div className="space-y-2 text-xs text-slate-400 border-t border-slate-800/60 pt-3">
          {lead.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate">{lead.email}</span>
            </div>
          )}
          {lead.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>{lead.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span className="truncate">Assigned: {lead.assignedTo || 'Unassigned'}</span>
          </div>
          {lead.customerId && (
            <div className="mt-1 flex items-center gap-1">
              <span className="text-[10px] bg-brand-500/10 text-brand-400 px-1.5 py-0.5 rounded border border-brand-500/20">
                Connected Customer
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer controls */}
      <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 flex-1">
          {lead.status === 'new' && (
            <button
              onClick={() => handleStatusUpdate('contacted')}
              className="flex-1 text-[10px] font-semibold py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              Contact
            </button>
          )}
          {(lead.status === 'new' || lead.status === 'contacted') && (
            <>
              <button
                onClick={() => handleStatusUpdate('qualified')}
                className="flex-1 text-[10px] font-semibold py-1 rounded bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-400 transition-colors"
              >
                Qualify
              </button>
              <button
                onClick={() => handleStatusUpdate('lost')}
                className="flex-1 text-[10px] font-semibold py-1 rounded bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-400 transition-colors"
              >
                Lost
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => onEdit(lead)} className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(lead._id)} className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
