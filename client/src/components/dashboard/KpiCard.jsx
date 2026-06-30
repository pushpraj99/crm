import React from 'react';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

const KpiCard = ({ title, value, icon: Icon, description, trend, trendType = 'up', onClick, accentColor, accentBg, gradientFrom, gradientTo }) => {
  const isUp = trendType === 'up';

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      }`}
      style={{
        background: `linear-gradient(135deg, ${gradientFrom || 'var(--bg-surface)'} 0%, ${gradientTo || 'var(--bg-elevated)'} 100%)`,
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
      }}
    >
      {/* Decorative orb */}
      <div
        className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 pointer-events-none"
        style={{ background: accentColor || 'var(--accent)' }}
      />

      {/* Header Row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: accentColor || 'var(--accent)' }}>
          {title}
        </span>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: accentBg || 'var(--accent-soft)', color: accentColor || 'var(--accent)' }}
        >
          <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
        </div>
      </div>

      {/* Value + Trend */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {value}
        </span>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
              isUp
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-red-500/10 text-red-600 dark:text-red-400'
            }`}
          >
            {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {description}
        </span>
        {onClick && (
          <ArrowRight
            className="w-3.5 h-3.5 opacity-40 shrink-0"
            style={{ color: accentColor || 'var(--accent)' }}
          />
        )}
      </div>
    </div>
  );
};

export default KpiCard;
