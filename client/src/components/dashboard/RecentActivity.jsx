import React from 'react';
import { formatDate } from '../../utils/helpers';
import { Phone, Mail, FileText, Calendar } from 'lucide-react';

const RecentActivity = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'call':
        return { icon: Phone, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' };
      case 'email':
        return { icon: Mail, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
      case 'meeting':
        return { icon: Calendar, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
      case 'note':
      default:
        return { icon: FileText, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 h-full flex flex-col justify-center items-center text-slate-500 text-sm">
        No recent activities logged.
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 flex flex-col h-full">
      <h3 className="text-lg font-bold text-white mb-6">Recent System Activity</h3>
      <div className="space-y-6 overflow-y-auto max-h-[360px] pr-2">
        {activities.slice(0, 5).map((activity, index) => {
          const config = getActivityIcon(activity.type);
          const IconComponent = config.icon;
          
          return (
            <div key={activity._id || index} className="flex gap-4 relative group">
              {/* Line between nodes */}
              {index !== activities.slice(0, 5).length - 1 && (
                <span className="absolute left-[18px] top-9 bottom-[-24px] w-[2px] bg-slate-800" />
              )}
              
              {/* Icon Container */}
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${config.color} shadow-sm`}>
                <IconComponent className="w-4 h-4" />
              </div>

              {/* Activity Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white truncate">
                    {activity.description}
                  </p>
                  <span className="text-xs text-slate-500 flex-shrink-0">
                    {formatDate(activity.performedAt)}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  {activity.customerId && (
                    <span className="text-xs text-brand-400 hover:underline truncate">
                      {activity.customerId.name || 'Customer'}
                    </span>
                  )}
                  {activity.customerId && <span className="text-slate-700">•</span>}
                  <span className="text-xs text-slate-400">By {activity.performedBy || 'System'}</span>
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
