import React, { useState, useEffect, useCallback } from 'react';
import { useCRM } from '../context/CRMContext';
import KpiCard from '../components/dashboard/KpiCard';
import LeadStatusPieChart from '../components/dashboard/LeadStatusPieChart';
import ActivityKanban from '../components/dashboard/ActivityKanban';
import { Users, Target, CircleDollarSign, Award, RefreshCw, Calendar } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { getDashboardStats } from '../services/dashboardService';

/* ─── Small skeleton shimmer for loading state ─── */
const Skeleton = ({ className = '' }) => (
  <div
    className={`rounded-xl animate-pulse ${className}`}
    style={{ background: 'var(--bg-elevated)' }}
  />
);

const StaffDashboard = () => {
  const { customers, leads, deals, activities, user, setCurrentPage } = useCRM();

  /* ────────── API state ────────── */
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getDashboardStats();
      if (res?.success) setStats(res.data);
      else setError('Could not load dashboard data.');
    } catch (err) {
      console.warn('[StaffDashboard] API fetch failed, using local data:', err.message);
      setError('Using cached data — server unreachable.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  /* ────────── Filter logic for user's assigned leads, deals, activities ────────── */
  const myLeads = leads.filter(l => 
    l.assignedTo && 
    user?.name && 
    l.assignedTo.trim().toLowerCase() === user.name.trim().toLowerCase()
  );
  const myActiveLeads = myLeads.filter(l => l.status !== 'lost');

  const myDeals = deals.filter(d => 
    d.assignedTo && 
    user?.name && 
    d.assignedTo.trim().toLowerCase() === user.name.trim().toLowerCase()
  );

  const myActivities = activities.filter(act => 
    act.performedBy && 
    user?.name && 
    act.performedBy.trim().toLowerCase() === user.name.trim().toLowerCase()
  );

  /* ────────── Resolve KPI values (computed locally for staff data isolation) ────────── */
  const totalCustomers   = customers.length;
  const activeLeadsVal   = myActiveLeads.length;
  const activeDealsValue = myDeals.reduce((s, d) => d.stage !== 'closed-lost' ? s + (d.value || 0) : s, 0);
  const winRate          = (() => {
    const w = myDeals.filter(d => d.stage === 'closed-won').length;
    const l = myDeals.filter(d => d.stage === 'closed-lost').length;
    return (w + l) > 0 ? Math.round((w / (w + l)) * 100) : 0;
  })();

  const pipelineStages = [
    { id: 'prospecting', label: 'Prospecting', color: '#818cf8', count: 0, pct: 0 },
    { id: 'proposal', label: 'Proposal', color: '#a78bfa', count: 0, pct: 0 },
    { id: 'negotiation', label: 'Negotiation', color: '#fb923c', count: 0, pct: 0 },
    { id: 'closed-won', label: 'Won', color: '#34d399', count: 0, pct: 0 },
    { id: 'closed-lost', label: 'Lost', color: '#f87171', count: 0, pct: 0 },
  ];

  const resolvedPipeline = pipelineStages.map(stage => {
    const stagDeals = myDeals.filter(d => d.stage === stage.id);
    const count = stagDeals.length;
    const pct = myDeals.length > 0 ? Math.round((count / myDeals.length) * 100) : 0;
    return { ...stage, count, pct };
  });

  return (
    <div className="space-y-6">

      {/* ── Welcome Banner ── */}
      <div className="th-surface rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              Welcome, {user?.name || 'User'}! 👋
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Everything you need to manage your assigned leads and close deals.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {error && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(251,146,60,0.15)', color: '#fb923c' }}>
                {error}
              </span>
            )}
            <button
              onClick={fetchStats}
              disabled={loading}
              title="Refresh dashboard"
              className="p-2 rounded-xl transition-colors"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div
          className="absolute right-0 top-0 w-64 h-full rounded-2xl pointer-events-none"
          style={{ background: 'linear-gradient(135deg, transparent, var(--accent-glow))', opacity: 0.8 }}
        />
      </div>

      {/* ── Activity Kanban ── */}
      <div className="cursor-pointer animate-fade-in" onClick={() => setCurrentPage('activities')}>
        {loading
          ? <Skeleton className="h-60 w-full" />
          : <ActivityKanban activities={myActivities} />
        }
      </div>

      {/* ── Charts + KPI Cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Column: Pie Chart + KPI Cards */}
        <div className="space-y-6 flex flex-col">
          {loading
            ? <Skeleton className="h-80 w-full" />
            : <LeadStatusPieChart leads={myLeads} />
          }

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loading ? (
              <>
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
              </>
            ) : (
              <>
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
                  title="My Assigned Leads"
                  value={activeLeadsVal}
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
              </>
            )}
          </div>
        </div>

        {/* Right Column: My Assigned Leads list */}
        <div className="rounded-2xl p-6 flex flex-col min-h-[460px]" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>My Assigned Leads List</h3>
            <button onClick={() => setCurrentPage('leads')} className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>View All →</button>
          </div>
          
          {myActiveLeads.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 py-8">
              <Target className="w-8 h-8 opacity-30" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No active leads assigned to you.</p>
            </div>
          ) : (
            <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
              {myActiveLeads.slice(0, 6).map(lead => (
                <div key={lead._id} className="flex items-center justify-between p-3.5 rounded-xl border th-border" style={{ background: 'var(--bg-elevated)' }}>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{lead.name}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{lead.source} · {lead.email || 'No email'}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${lead.status === 'qualified' ? 'bg-emerald-500/10 text-emerald-500' : lead.status === 'contacted' ? 'bg-sky-500/10 text-sky-500' : 'bg-brand-500/10 text-brand-500'}`}>
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ── Pipeline Health Overview ── */}
      <div
        className="rounded-2xl p-6 flex flex-col"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
              Pipeline Health Stage Overview
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Status of all current deal pipeline stages
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-20" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {resolvedPipeline.map(stage => (
              <div
                key={stage.id}
                className="p-4 rounded-xl border flex flex-col justify-between space-y-3"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}
              >
                <div className="flex justify-between text-xs font-semibold">
                  <span style={{ color: 'var(--text-secondary)' }}>{stage.label}</span>
                  <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{stage.count}</span>
                </div>
                <div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(stage.pct, stage.count > 0 ? 4 : 0)}%`, backgroundColor: stage.color }}
                    />
                  </div>
                  <span className="text-[10px] mt-1.5 block" style={{ color: 'var(--text-muted)' }}>
                    {stage.pct}% of pipeline
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default StaffDashboard;
