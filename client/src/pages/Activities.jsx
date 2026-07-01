import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import ActivityTable from '../components/activities/ActivityTable';
import ActivityForm from '../components/activities/ActivityForm';
import { Search, Plus, SlidersHorizontal } from 'lucide-react';
import { confirmAction } from '../utils/alerts';

const Activities = () => {
  const { activities, logActivity, deleteActivity, loading, user } = useCRM();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [showLogForm, setShowLogForm] = useState(false);

  const isStaff = user?.role === 'agent' || user?.role === 'viewer';

  // Filter activities first if user is standard staff
  const targetActivities = isStaff
    ? activities.filter(act => act.performedBy && user?.name && act.performedBy.trim().toLowerCase() === user.name.trim().toLowerCase())
    : activities;

  // Filters logic
  const filteredActivities = targetActivities.filter(act => {
    const descMatch = (act.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const titleMatch = (act.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const userMatch = (act.performedBy || '').toLowerCase().includes(searchTerm.toLowerCase());
    const nameMatch = (act.contactName || act.customerId?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const companyMatch = (act.company || act.customerId?.company || '').toLowerCase().includes(searchTerm.toLowerCase());
    const textMatches = descMatch || titleMatch || userMatch || nameMatch || companyMatch;

    const matchesCategory = categoryFilter ? act.category === categoryFilter : true;
    const matchesPriority = priorityFilter ? act.priority === priorityFilter : true;
    const matchesStatus = statusFilter ? act.status === statusFilter : true;

    return textMatches && matchesCategory && matchesPriority && matchesStatus;
  });

  const handleOpenAdd = () => {
    setShowLogForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmAction(
      'Delete Activity?',
      'Are you sure you want to permanently delete this activity log?',
      'Yes, delete'
    );
    if (confirmed) {
      try {
        await deleteActivity(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      await logActivity(data);
      setShowLogForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search and Action header */}
      <div className="th-surface rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search activities by title, contact, desc..."
            className="w-full rounded-xl pl-10 pr-4 py-2 text-sm font-medium outline-none th-input"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Category */}
          <div className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 border th-border" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <span className="text-[10px] font-bold uppercase th-text-muted">Cat</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-xs th-text-secondary focus:outline-none cursor-pointer"
            >
              <option value="">All</option>
              <option value="sales">Sales</option>
              <option value="support">Support</option>
              <option value="marketing">Marketing</option>
              <option value="internal">Internal</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Priority */}
          <div className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 border th-border" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <span className="text-[10px] font-bold uppercase th-text-muted">Pri</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent text-xs th-text-secondary focus:outline-none cursor-pointer"
            >
              <option value="">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 border th-border" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <span className="text-[10px] font-bold uppercase th-text-muted">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs th-text-secondary focus:outline-none cursor-pointer"
            >
              <option value="">All</option>
              <option value="planned">Planned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-brand-600/15"
          >
            <Plus className="w-4 h-4" />
            Log Activity
          </button>
        </div>
      </div>

      {showLogForm && (
        <div className="max-w-xl mx-auto">
          <ActivityForm
            onSubmit={handleFormSubmit}
            onClose={() => setShowLogForm(false)}
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20 text-sm th-text-secondary">
          Loading history logs...
        </div>
      ) : (
        <ActivityTable
          activities={filteredActivities}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Activities;
