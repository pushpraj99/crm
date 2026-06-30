import React from 'react';
import { formatDate } from '../../utils/helpers';
import { Phone, Mail, FileText, Calendar } from 'lucide-react';

const RecentActivity = ({ activities = [] }) => {
  const getActivityConfig = (type) => {
    switch (type?.toLowerCase()) {
      case 'call':    return { icon: Phone,    bg: '#0ea5e920', color: '#0ea5e9', border: '#0ea5e930' };
      case 'email':   return { icon: Mail,     bg: '#f59e0b20', color: '#f59e0b', border: '#f59e0b30' };
      case 'meeting': return { icon: Calendar, bg: '#10b98120', color: '#10b981', border: '#10b98130' };
      default:        return { icon: FileText, bg: '#a855f720', color: '#a855f7', border: '#a855f730' };
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="th-surface rounded-2xl p-6 h-full flex flex-col justify-center items-center text-sm" style={{ color: 'var(--text-muted)' }}>
        <FileText className="w-8 h-8 mb-3 opacity-30" />
        No recent activities logged.
      </div>
    );
  }

  return (
    <div className="th-surface rounded-2xl p-6 flex flex-col h-full">
      <h3 className="text-sm font-bold uppercase tracking-wider mb-6" style={{ color: 'var(--text-muted)' }}>
        Recent Activity
      </h3>
      <div className="space-y-5 overflow-y-auto max-h-[360px] pr-1">
        {activities.slice(0, 5).map((activity, index) => {
          const config = getActivityConfig(activity.type);
          const IconComponent = config.icon;

          return (
            <div key={activity._id || index} className="flex gap-4 relative group">
              {/* Timeline line */}
              {index !== Math.min(activities.length, 5) - 1 && (
                <span
                  className="absolute left-[17px] top-9 bottom-[-20px] w-[1px]"
                  style={{ backgroundColor: 'var(--border)' }}
                />
              )}

              {/* Icon */}
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: config.bg, color: config.color, border: `1px solid ${config.border}` }}
              >
                <IconComponent className="w-3.5 h-3.5" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {activity.description}
                  </p>
                  <span className="text-xs flex-shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {formatDate(activity.performedAt)}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-2">
                  {activity.customerId && (
                    <span className="text-xs font-medium truncate" style={{ color: 'var(--accent)' }}>
                      {activity.customerId.name || 'Customer'}
                    </span>
                  )}
                  {activity.customerId && (
                    <span style={{ color: 'var(--border-strong)' }}>·</span>
                  )}
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    By {activity.performedBy || 'System'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;
