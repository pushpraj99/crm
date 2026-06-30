import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import ActivityFeed from '../components/activities/ActivityFeed';
import ActivityForm from '../components/activities/ActivityForm';
import { Search, Plus } from 'lucide-react';

const Activities = () => {
  const { activities, logActivity, loading } = useCRM();
  const [searchTerm, setSearchTerm] = useState('');
  const [showLogForm, setShowLogForm] = useState(false);

  const filteredActivities = activities.filter(activity => {
    const descMatch = activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const customerMatch = activity.customerId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const userMatch = activity.performedBy?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const typeMatch = activity.type?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    return descMatch || customerMatch || userMatch || typeMatch;
  });

  const handleLogSubmit = async (data) => {
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
      <div className="glass rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800/80">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search activities by description, customer, user..."
            className="w-full bg-slate-950/60 border border-slate-800 focus:border-brand-500 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
        </div>

        <button
          onClick={() => setShowLogForm(prev => !prev)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-brand-600/15"
        >
          <Plus className="w-4 h-4" />
          Log Communication
        </button>
      </div>

      {showLogForm && (
        <div className="max-w-xl">
          <ActivityForm 
            onSubmit={handleLogSubmit} 
            onClose={() => setShowLogForm(false)} 
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-400 text-sm">
          Loading history logs...
        </div>
      ) : (
        <ActivityFeed 
          activities={filteredActivities} 
          showCustomerInfo={true} 
        />
      )}
    </div>
  );
};

export default Activities;
