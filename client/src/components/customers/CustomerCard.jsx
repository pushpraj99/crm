import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { getStatusBadgeClass } from '../../utils/helpers';
import { Building2, Mail, Phone, ChevronRight } from 'lucide-react';

const CustomerCard = ({ customer }) => {
  const { setCurrentPage, setSelectedCustomerId } = useCRM();

  const handleViewDetails = () => {
    setSelectedCustomerId(customer._id);
    setCurrentPage('customer-details');
  };

  return (
    <div className="glass rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-brand-500/5 flex flex-col justify-between h-full border border-slate-800/80">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h4 
              className="text-base font-bold text-white truncate hover:text-brand-400 cursor-pointer" 
              onClick={handleViewDetails}
            >
              {customer.name}
            </h4>
            {customer.company && (
              <div className="flex items-center gap-1.5 mt-1 text-slate-400 text-xs">
                <Building2 className="w-3.5 h-3.5" />
                <span className="truncate">{customer.company}</span>
              </div>
            )}
          </div>
          <span className={getStatusBadgeClass(customer.status)}>
            {customer.status}
          </span>
        </div>

        {/* Contact info */}
        <div className="mt-6 space-y-2.5">
          <div className="flex items-center gap-2.5 text-xs text-slate-400">
            <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span className="truncate">{customer.email}</span>
          </div>
          {customer.phone && (
            <div className="flex items-center gap-2.5 text-xs text-slate-400">
              <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span>{customer.phone}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {customer.tags && customer.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-6">
            {customer.tags.map((tag, idx) => (
              <span 
                key={idx} 
                className="bg-slate-800 text-slate-400 border border-slate-700/50 px-2 py-0.5 rounded text-[10px] font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleViewDetails}
        className="mt-6 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-brand-400 hover:text-brand-300 transition-colors border border-slate-700/40"
      >
        View Profile
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default CustomerCard;
