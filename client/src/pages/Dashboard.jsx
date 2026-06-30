import React from 'react';
import { useCRM } from '../context/CRMContext';
import KpiCard from '../components/dashboard/KpiCard';
import ActivityKanban from '../components/dashboard/ActivityKanban';
import LeadStatusPieChart from '../components/dashboard/LeadStatusPieChart';
import SalesTrendChart from '../components/dashboard/SalesTrendChart';
import { Users, Target, CircleDollarSign, Award } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const Dashboard = () => {
  const { customers, leads, deals, activities, user, setCurrentPage } = useCRM();

  // Calculations with user-requested fallback values for beautiful demo
  const totalCustomers = customers.length || 4;
  const activeLeads = leads.filter(l => l.status !== 'lost').length || 3;

  const rawDealsValue = deals.reduce((sum, d) => d.stage !== 'closed-lost' ? sum + d.value : sum, 0);
  const activeDealsValue = rawDealsValue || 475000;

  const wonCount = deals.filter(d => d.stage === 'closed-won').length;
  const lostCount = deals.filter(d => d.stage === 'closed-lost').length;
  const totalClosed = wonCount + lostCount;
  const winRate = totalClosed > 0 ? Math.round((wonCount / totalClosed) * 100) : 100;

  const pipelineStages = [
    { label: 'Prospecting', id: 'prospecting', color: '#818cf8' },
    { label: 'Proposal', id: 'proposal', color: '#a78bfa' },
    { label: 'Negotiation', id: 'negotiation', color: '#fb923c' },
    { label: 'Won', id: 'closed-won', color: '#34d399' },
    { label: 'Lost', id: 'closed-lost', color: '#f87171' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="th-surface rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Welcome, {user?.name || 'Administrator'}! 👋
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Everything you need to manage your customers and grow your business.
          </p>
        </div>
        {/* Decorative gradient orb */}
        <div
          className="absolute right-0 top-0 w-64 h-full rounded-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, transparent, var(--accent-glow))',
            opacity: 0.8
          }}
        />
      </div>

      {/* Row 2: Recent Activities Kanban Board */}
      <div className="cursor-pointer animate-fade-in" onClick={() => setCurrentPage('activities')}>
        <ActivityKanban activities={activities} />
      </div>

      {/* Row 3: Side-by-Side Charts & Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Pie Chart and KPI Cards below it */}
        <div className="space-y-6 flex flex-col">
          {/* Interactive Pie Chart */}
          <LeadStatusPieChart leads={leads} />

          {/* KPI Cards (Grid layout directly below Pie Chart) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <KpiCard
              title="Total Customers"
              value={totalCustomers}
              icon={Users}
              description="Total active records in CRM"
              trend="+4.8%"
              trendType="up"
              accentColor="#818cf8"
              accentBg="rgba(129,140,248,0.12)"
              onClick={() => setCurrentPage('customers')}
            />
            <KpiCard
              title="Active Leads"
              value={activeLeads}
              icon={Target}
              description="Leads currently in pipeline"
              trend="+12%"
              trendType="up"
              accentColor="#a78bfa"
              accentBg="rgba(167,139,250,0.12)"
              onClick={() => setCurrentPage('leads')}
            />
            <KpiCard
              title="Pipeline Value"
              value={formatCurrency(activeDealsValue)}
              icon={CircleDollarSign}
              description="Value of all active deals"
              trend="+8.2%"
              trendType="up"
              accentColor="#34d399"
              accentBg="rgba(52,211,153,0.12)"
              onClick={() => setCurrentPage('deals')}
            />
            <KpiCard
              title="Win Rate"
              value={`${winRate}%`}
              icon={Award}
              description="Ratio of closed-won deals"
              trend="+2.5%"
              trendType="up"
              accentColor="#fb923c"
              accentBg="rgba(251,146,60,0.12)"
              onClick={() => setCurrentPage('deals')}
            />
          </div>
        </div>

        {/* Right Column: Monthly Sales/Lead Trend Chart (Stretches to column height) */}
        <div className="h-full flex flex-col">
          <SalesTrendChart deals={deals} leads={leads} />
        </div>
      </div>

      {/* Row 4: Pipeline Health (shifted downward at bottom) */}
      <div
        className="rounded-2xl p-6 flex flex-col"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div className="mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
            Pipeline Health Stage Overview
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Status of all current deal pipeline stages
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {pipelineStages.map(stage => {
            const count = deals.filter(d => d.stage === stage.id).length;
            const pct = deals.length > 0 ? Math.round((count / deals.length) * 100) : 0;
            return (
              <div
                key={stage.id}
                className="p-4 rounded-xl border flex flex-col justify-between space-y-3"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}
              >
                <div className="flex justify-between text-xs font-semibold">
                  <span style={{ color: 'var(--text-secondary)' }}>{stage.label}</span>
                  <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{count}</span>
                </div>
                <div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: stage.color }}
                    />
                  </div>
                  <span className="text-[10px] mt-1.5 block" style={{ color: 'var(--text-muted)' }}>
                    {pct}% of pipeline
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
