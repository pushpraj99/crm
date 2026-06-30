import React from 'react';
import { Phone, Mail, Calendar, FileText } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const ActivityKanban = ({ activities = [] }) => {
  const columns = [
    { id: 'call', name: 'Calls 📞', icon: Phone, color: 'text-sky-500 border-sky-500/25 bg-sky-500/5' },
    { id: 'email', name: 'Emails ✉️', icon: Mail, color: 'text-amber-500 border-amber-500/25 bg-amber-500/5' },
    { id: 'meeting', name: 'Meetings 📅', icon: Calendar, color: 'text-emerald-500 border-emerald-500/25 bg-emerald-500/5' },
    { id: 'note', name: 'Notes & Others 📝', icon: FileText, color: 'text-indigo-500 border-indigo-500/25 bg-indigo-500/5' },
  ];

  // Group activities by type
  const grouped = activities.reduce((acc, act) => {
    let type = act.type?.toLowerCase() || 'note';
    if (type !== 'call' && type !== 'email' && type !== 'meeting') {
      type = 'note';
    }
    if (!acc[type]) acc[type] = [];
    acc[type].push(act);
    return acc;
  }, { call: [], email: [], meeting: [], note: [] });

  return (
    <div
      className="rounded-2xl p-5 flex flex-col space-y-4"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
          Recent Activities Kanban Board
        </h3>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Activities categorized by communication channels
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((col) => {
          const Icon = col.icon;
          const items = (grouped[col.id] || []).slice(0, 4); // Limit to top 4 recent items per column

          return (
            <div
              key={col.id}
              className={`rounded-xl border p-3 flex flex-col space-y-3 min-h-[160px] ${col.color}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-1 border-b border-current/10">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" />
                  {col.name}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-current/10">
                  {items.length}
                </span>
              </div>

              {/* Column Items */}
              <div className="flex-1 space-y-2 overflow-y-auto max-h-[220px] pr-0.5">
                {items.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-[10px] text-center opacity-60 py-4">
                    No recent records
                  </div>
                ) : (
                  items.map((act) => (
                    <div
                      key={act._id}
                      className="p-2.5 rounded-lg border text-[11px] space-y-1.5 transition-all hover:scale-[1.01]"
                      style={{
                        background: 'var(--bg-surface)',
                        borderColor: 'var(--border)',
                        color: 'var(--text-primary)',
                        boxShadow: 'var(--shadow-card)',
                      }}
                    >
                      <p className="font-semibold leading-tight line-clamp-2">
                        {act.description || act.title}
                      </p>
                      <div className="flex items-center justify-between text-[9px] opacity-75">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 truncate max-w-[80px]">
                          {act.customerId?.name || 'Customer'}
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>
                          {formatDate(act.performedAt || act.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityKanban;
