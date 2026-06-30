import React, { useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2.5 rounded-xl text-xs shadow-lg min-w-[130px]"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        color: 'var(--text-primary)',
      }}
    >
      <p className="font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span style={{ color: 'var(--text-muted)' }}>{entry.name}:</span>
          <span className="font-semibold ml-auto">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const SalesTrendChart = ({ deals = [], leads = [] }) => {
  const now = new Date();

  const monthlyData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const month = d.getMonth();
      const year = d.getFullYear();

      const monthDeals = deals.filter(deal => {
        if (!deal.createdAt) return false;
        const dd = new Date(deal.createdAt);
        return dd.getMonth() === month && dd.getFullYear() === year;
      });

      const monthLeads = leads.filter(lead => {
        if (!lead.createdAt) return false;
        const ld = new Date(lead.createdAt);
        return ld.getMonth() === month && ld.getFullYear() === year;
      });

      const revenue = monthDeals
        .filter(d => d.stage === 'closed-won')
        .reduce((sum, d) => sum + (d.value || 0), 0);

      return {
        month: MONTH_NAMES[month],
        Leads: monthLeads.length,
        Deals: monthDeals.length,
        Revenue: Math.round(revenue / 1000), // in K
      };
    });
  }, [deals, leads]);

  return (
    <div
      className="rounded-2xl p-5 flex flex-col h-full"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          Sales & Lead Trend
        </h3>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Last 6 months — Leads, Deals & Revenue (K)
        </p>
      </div>

      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--border)"
              strokeOpacity={0.6}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: 'var(--text-muted)', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 500 }}>
                  {value}
                </span>
              )}
            />
            <Bar dataKey="Leads" fill="#818cf8" radius={[6, 6, 0, 0]} barSize={16} />
            <Bar dataKey="Deals" fill="#a78bfa" radius={[6, 6, 0, 0]} barSize={16} />
            <Line
              type="monotone"
              dataKey="Revenue"
              stroke="#34d399"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#34d399', strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesTrendChart;
