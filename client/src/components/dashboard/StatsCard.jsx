import React from 'react';

const StatsCard = ({ title, value, icon: Icon, description, trend, trendType = 'up' }) => {
  return (
    <div className="glass rounded-2xl p-6 flex flex-col transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-brand-500/5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-400">{title}</span>
        <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-brand-400">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            trendType === 'up' 
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
          }`}>
            {trend}
          </span>
        )}
      </div>

      {description && (
        <span className="mt-2 text-xs text-slate-500">{description}</span>
      )}
    </div>
  );
};

export default StatsCard;
