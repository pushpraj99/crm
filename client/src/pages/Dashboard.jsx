import React from 'react';
import { useCRM } from '../context/CRMContext';
import StatsCard from '../components/dashboard/StatsCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import { Users, Target, CircleDollarSign, CheckSquare } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const Dashboard = () => {
  const { customers, leads, deals, activities } = useCRM();

  const totalCustomers = customers.length;
  const activeLeads = leads.filter(l => l.status !== 'lost').length;
  const activeDealsValue = deals.reduce((sum, d) => d.stage !== 'closed-lost' ? sum + d.value : sum, 0);

  const wonCount = deals.filter(d => d.stage === 'closed-won').length;
  const lostCount = deals.filter(d => d.stage === 'closed-lost').length;
  const totalClosed = wonCount + lostCount;
  const winRate = totalClosed > 0 ? Math.round((wonCount / totalClosed) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass rounded-3xl p-8 relative overflow-hidden border border-slate-800/80">
        <div className="relative z-10 space-y-2">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome back, Admin!</h2>
          <p className="text-slate-400 text-sm max-w-xl">
            Here is a high-level view of your current business pipeline, customer database health, and recent activities.
          </p>
        </div>
        <div className="absolute right-[-40px] top-[-40px] w-48 h-48 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute left-[-20px] bottom-[-20px] w-32 h-32 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Customers" 
          value={totalCustomers} 
          icon={Users} 
          description="Total active records in CRM"
          trend="+4.8%" 
          trendType="up"
        />
        <StatsCard 
          title="Active Leads" 
          value={activeLeads} 
          icon={Target} 
          description="Leads currently in pipeline"
          trend="+12%" 
          trendType="up"
        />
        <StatsCard 
          title="Total Deals Value" 
          value={formatCurrency(activeDealsValue)} 
          icon={CircleDollarSign} 
          description="Value of active deals"
          trend="+8.2%" 
          trendType="up"
        />
        <StatsCard 
          title="Win Rate" 
          value={`${winRate}%`} 
          icon={CheckSquare} 
          description="Ratio of closed won deals"
          trend="+2.5%" 
          trendType="up"
        />
      </div>

      {/* Main Grid: Recent Activity & Pipeline Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities Feed */}
        <div className="lg:col-span-2">
          <RecentActivity activities={activities} />
        </div>

        {/* Quick summary card */}
        <div className="glass rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Pipeline Health</h3>
            <p className="text-xs text-slate-400">
              Overview of stages for your currently opened deals in the pipeline.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Prospecting</span>
                <span className="font-semibold text-white">{deals.filter(d => d.stage === 'prospecting').length} deals</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Proposal</span>
                <span className="font-semibold text-white">{deals.filter(d => d.stage === 'proposal').length} deals</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Negotiation</span>
                <span className="font-semibold text-white">{deals.filter(d => d.stage === 'negotiation').length} deals</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Won</span>
                <span className="font-semibold text-emerald-400">{deals.filter(d => d.stage === 'closed-won').length} deals</span>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-800 pt-4 flex justify-between items-center text-xs text-slate-500">
            <span>Last synchronized</span>
            <span>Just now</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
