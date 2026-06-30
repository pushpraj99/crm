import React from 'react';
import { formatDate } from '../../utils/helpers';
import { Phone, Mail, FileText, Calendar, User } from 'lucide-react';

const ActivityFeed = ({ activities = [], showCustomerInfo = false }) => {
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
      <div className="glass rounded-xl p-8 text-center text-slate-500 text-sm">
        No activities logged.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activities.map((activity, index) => {
        const config = getActivityIcon(activity.type);
        const IconComponent = config.icon;
        
        return (
          <div key={activity._id || index} className="flex gap-4 relative group">
            {/* Line between nodes */}
            {index !== activities.length - 1 && (
              <span className="absolute left-[18px] top-9 bottom-[-24px] w-[2px] bg-slate-800" />
            )}
            
            {/* Icon Container */}
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${config.color} shadow-sm z-10`}>
              <IconComponent className="w-4 h-4" />
            </div>

            {/* Activity details */}
            <div className="flex-1 min-w-0 glass border border-slate-800/80 rounded-xl p-4 transition-colors hover:bg-slate-900/20">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">
                    {activity.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-650" />
                      Logged by {activity.performedBy || 'System'}
                    </span>
                    {showCustomerInfo && activity.customerId && (
                      <>
                        <span className="text-slate-700">•</span>
                        <span className="text-brand-400 font-medium">
                          {activity.customerId.name || 'Customer'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <span className="text-xs text-slate-500 flex-shrink-0 whitespace-nowrap">
                  {formatDate(activity.performedAt)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityFeed;
