import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { ChevronLeft, ChevronRight, Edit, Trash2, Calendar, Building2 } from 'lucide-react';

const DealKanban = ({ deals = [], onEditDeal, onDeleteDeal }) => {
  const { updateDeal } = useCRM();

  const stages = ['prospecting', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];
  const stageDisplayNames = {
    prospecting: 'Prospecting',
    proposal: 'Proposal',
    negotiation: 'Negotiation',
    'closed-won': 'Closed Won',
    'closed-lost': 'Closed Lost'
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'closed-won':
        return 'border-t-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10';
      case 'closed-lost':
        return 'border-t-rose-500 bg-rose-500/5 dark:bg-rose-500/10';
      case 'negotiation':
        return 'border-t-amber-500 bg-amber-500/5 dark:bg-amber-500/10';
      case 'proposal':
        return 'border-t-brand-500 bg-brand-500/5 dark:bg-brand-500/10';
      case 'prospecting':
      default:
        return 'border-t-slate-500 bg-slate-500/5 dark:bg-slate-500/10';
    }
  };

  const moveDeal = async (dealId, currentStage, direction) => {
    const currentIndex = stages.indexOf(currentStage);
    let newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < stages.length) {
      const newStage = stages[newIndex];
      try {
        await updateDeal(dealId, { stage: newStage });
      } catch (err) {
        console.error('Failed to move deal:', err);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 items-start overflow-x-auto pb-4">
      {stages.map(stage => {
        const stageDeals = deals.filter(d => d.stage === stage);
        const stageValueSum = stageDeals.reduce((sum, d) => sum + d.value, 0);

        return (
          <div 
            key={stage} 
            className="flex flex-col gap-4 min-w-[220px] th-surface border th-border rounded-2xl p-4"
            style={{ backgroundColor: 'var(--bg-surface)' }}
          >
            {/* Column Header */}
            <div className="space-y-1.5 pb-2 border-b th-border">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold th-text-primary tracking-wide">
                  {stageDisplayNames[stage]}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded th-badge-accent">
                  {stageDeals.length}
                </span>
              </div>
              <div className="text-xs font-bold text-brand-600 dark:text-brand-400">
                {formatCurrency(stageValueSum)}
              </div>
            </div>

            {/* Column Cards */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {stageDeals.length === 0 ? (
                <div className="border border-dashed th-border rounded-xl p-8 text-center text-xs th-text-muted">
                  No deals
                </div>
              ) : (
                stageDeals.map(deal => (
                  <div 
                    key={deal._id} 
                    className={`th-surface border th-border border-t-2 rounded-xl p-4 space-y-3 shadow-md relative group ${getStageColor(stage)}`}
                  >
                    <div>
                      <h5 className="text-sm font-bold th-text-primary tracking-tight">{deal.title}</h5>
                      {deal.customerId && (
                        <div className="flex items-center gap-1.5 mt-1 th-text-secondary text-[11px]">
                          <Building2 className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                          <span className="truncate">{deal.customerId.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-brand-600 dark:text-brand-400">{formatCurrency(deal.value)}</span>
                      {deal.expectedCloseDate && (
                        <div className="flex items-center gap-1 text-[10px] th-text-secondary">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(deal.expectedCloseDate)}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions and Movement arrows */}
                    <div className="flex justify-between items-center pt-2 border-t th-border mt-2">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => onEditDeal(deal)}
                          className="p-1 text-slate-400 hover:th-text-primary rounded transition-colors"
                          title="Edit Deal"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => onDeleteDeal(deal._id)}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                          title="Delete Deal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Direction Arrows */}
                      <div className="flex items-center gap-1">
                        <button
                          disabled={stages.indexOf(stage) === 0}
                          onClick={() => moveDeal(deal._id, stage, -1)}
                          className="p-1 text-slate-400 hover:th-text-primary rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={stages.indexOf(stage) === stages.length - 1}
                          onClick={() => moveDeal(deal._id, stage, 1)}
                          className="p-1 text-slate-400 hover:th-text-primary rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DealKanban;
