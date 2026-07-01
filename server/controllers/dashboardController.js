const Deal     = require('../models/Deal');
const Lead     = require('../models/Lead');
const Customer = require('../models/Customer');
const Activity = require('../models/Activity');

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const PIPELINE_STAGES = [
  { id: 'prospecting',  label: 'Prospecting',  color: '#818cf8' },
  { id: 'proposal',     label: 'Proposal',      color: '#a78bfa' },
  { id: 'negotiation',  label: 'Negotiation',   color: '#fb923c' },
  { id: 'closed-won',   label: 'Won',           color: '#34d399' },
  { id: 'closed-lost',  label: 'Lost',          color: '#f87171' },
];

// ─────────────────────────────────────────
// GET /api/dashboard/stats
// Returns all data needed for every dashboard component
// ─────────────────────────────────────────
const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();

    // ── Fetch all raw data in parallel ──
    const [customers, leads, deals, activities] = await Promise.all([
      Customer.find().lean(),
      Lead.find().lean(),
      Deal.find().populate('customerId', 'name company').lean(),
      Activity.find()
        .populate('customerId', 'name')
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    // ─────────────────────────────────────
    // 1. KPI CARDS
    // ─────────────────────────────────────
    const totalCustomers   = customers.length;
    const activeLeads      = leads.filter(l => l.status !== 'lost').length;
    const activeDealsValue = deals
      .filter(d => d.stage !== 'closed-lost')
      .reduce((s, d) => s + (d.value || 0), 0);
    const wonCount   = deals.filter(d => d.stage === 'closed-won').length;
    const lostCount  = deals.filter(d => d.stage === 'closed-lost').length;
    const totalClosed = wonCount + lostCount;
    const winRate    = totalClosed > 0 ? Math.round((wonCount / totalClosed) * 100) : 0;
    const wonRevenue = deals
      .filter(d => d.stage === 'closed-won')
      .reduce((s, d) => s + (d.value || 0), 0);

    // ─────────────────────────────────────
    // 2. LEAD STATUS PIE CHART
    //    LeadStatusPieChart expects: leads[]
    //    We return pre-grouped distribution
    // ─────────────────────────────────────
    const leadStatusMap = {};
    leads.forEach(l => {
      const status = l.status || 'new';
      leadStatusMap[status] = (leadStatusMap[status] || 0) + 1;
    });
    const leadStatusDistribution = Object.entries(leadStatusMap).map(([status, count]) => ({
      status,
      count,
    }));

    // ─────────────────────────────────────
    // 3. SALES & LEAD TREND CHART
    //    SalesTrendChart expects: deals[], leads[]
    //    We pre-compute 6-month monthly data
    // ─────────────────────────────────────
    const salesTrend = Array.from({ length: 6 }, (_, i) => {
      const d  = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const mo = d.getMonth(), yr = d.getFullYear();

      const monthDeals = deals.filter(dl => {
        if (!dl.createdAt) return false;
        const dd = new Date(dl.createdAt);
        return dd.getMonth() === mo && dd.getFullYear() === yr;
      });
      const monthLeads = leads.filter(l => {
        if (!l.createdAt) return false;
        const ld = new Date(l.createdAt);
        return ld.getMonth() === mo && ld.getFullYear() === yr;
      });
      const revenue = monthDeals
        .filter(d => d.stage === 'closed-won')
        .reduce((s, d) => s + (d.value || 0), 0);

      return {
        month:   MONTHS[mo],
        Leads:   monthLeads.length,
        Deals:   monthDeals.length,
        Revenue: Math.round(revenue / 1000), // in thousands
      };
    });

    // ─────────────────────────────────────
    // 4. ACTIVITY KANBAN
    //    ActivityKanban expects: activities[]
    //    We return recent activities grouped by type
    // ─────────────────────────────────────
    const activityTypes = ['call', 'email', 'meeting', 'note'];
    const activityKanban = {};
    activityTypes.forEach(type => {
      activityKanban[type] = activities
        .filter(a => {
          const t = (a.type || '').toLowerCase();
          if (type === 'note') return !['call','email','meeting'].includes(t);
          return t === type;
        })
        .slice(0, 5)
        .map(a => ({
          _id:         a._id,
          type:        a.type,
          description: a.description || a.title,
          performedAt: a.performedAt || a.createdAt,
          customerId:  a.customerId,
          performedBy: a.performedBy,
        }));
    });

    // ─────────────────────────────────────
    // 5. PIPELINE HEALTH
    //    Shows count + value + pct per stage
    // ─────────────────────────────────────
    const totalDeals = Math.max(deals.length, 1);
    const pipelineHealth = PIPELINE_STAGES.map(stage => {
      const stageDeals = deals.filter(d => d.stage === stage.id);
      const count = stageDeals.length;
      const value = stageDeals.reduce((s, d) => s + (d.value || 0), 0);
      const pct   = Math.round((count / totalDeals) * 100);
      return {
        id:    stage.id,
        label: stage.label,
        color: stage.color,
        count,
        value,
        pct,
      };
    });

    // ─────────────────────────────────────
    // 6. RECENT ACTIVITIES (timeline list)
    // ─────────────────────────────────────
    const recentActivities = activities.slice(0, 8).map(a => ({
      _id:         a._id,
      type:        a.type,
      description: a.description || a.title,
      performedAt: a.performedAt || a.createdAt,
      performedBy: a.performedBy,
      status:      a.status,
      customerId:  a.customerId
        ? { _id: a.customerId._id, name: a.customerId.name }
        : null,
    }));

    // ─────────────────────────────────────
    // 7. RECENT DEALS (list panel)
    // ─────────────────────────────────────
    const recentDeals = deals
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6)
      .map(d => ({
        _id:      d._id,
        title:    d.title,
        value:    d.value,
        stage:    d.stage,
        createdAt:d.createdAt,
        customer: d.customerId ? { name: d.customerId.name, company: d.customerId.company } : null,
      }));

    // ─────────────────────────────────────
    // Compose response
    // ─────────────────────────────────────
    res.status(200).json({
      success: true,
      data: {
        // KPI cards
        kpi: {
          totalCustomers,
          activeLeads,
          totalLeads: leads.length,
          activeDealsValue,
          wonRevenue,
          wonCount,
          lostCount,
          winRate,
          totalDeals: deals.length,
        },

        // Lead Status Pie Chart
        leadStatusDistribution,

        // Sales & Lead Trend Chart (6-month)
        salesTrend,

        // Activity Kanban (grouped by type)
        activityKanban,
        // All recent activities for timeline
        recentActivities,

        // Pipeline Health bars
        pipelineHealth,

        // Recent Deals list
        recentDeals,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
