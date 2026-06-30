import React, { useState, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { getCustomerById } from '../../services/customerService';
import { getStatusBadgeClass, formatCurrency, formatDate } from '../../utils/helpers';
import { 
  Building2, Mail, Phone, Calendar, ArrowLeft, Edit, Trash2, 
  Plus, History, Briefcase, Target 
} from 'lucide-react';
import ActivityFeed from '../activities/ActivityFeed';
import ActivityForm from '../activities/ActivityForm';

const CustomerDetail = ({ customerId, onBack, onEdit, onDelete }) => {
  const { logActivity } = useCRM();
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [activeTab, setActiveTab] = useState('activities'); // activities, deals, leads

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await getCustomerById(customerId);
      if (res.success) {
        setDetailData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading profile details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchDetails();
    }
  }, [customerId]);

  const handleAddActivity = async (activityData) => {
    try {
      await logActivity({
        ...activityData,
        customerId
      });
      setShowActivityForm(false);
      fetchDetails();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 text-slate-400 text-sm">
        Loading customer profile...
      </div>
    );
  }

  if (error || !detailData) {
    return (
      <div className="glass rounded-2xl p-8 text-center space-y-4">
        <p className="text-rose-400 font-medium">{error || 'Failed to load customer profile.'}</p>
        <button onClick={onBack} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  const { customer, activities, deals, leads } = detailData;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Customers
      </button>

      {/* Profile Header */}
      <div className="glass rounded-2xl p-6 border border-slate-800/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-brand-500/10">
            {customer.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white">{customer.name}</h2>
              <span className={getStatusBadgeClass(customer.status)}>{customer.status}</span>
            </div>
            {customer.company && (
              <div className="flex items-center gap-1.5 mt-1 text-slate-400 text-sm">
                <Building2 className="w-4 h-4" />
                <span>{customer.company}</span>
              </div>
            )}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {customer.tags?.map((tag, idx) => (
                <span key={idx} className="bg-slate-800 text-slate-400 border border-slate-700/50 px-2 py-0.5 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Info and Actions */}
        <div className="flex flex-col md:items-end gap-4 w-full md:w-auto">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-slate-400 text-xs">
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-500" />
              {customer.email}
            </span>
            {customer.phone && (
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500" />
                {customer.phone}
              </span>
            )}
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              Joined {formatDate(customer.createdAt)}
            </span>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={() => onEdit(customer)}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors border border-slate-750"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit Profile
            </button>
            <button 
              onClick={() => onDelete(customer._id)}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors border border-rose-500/20"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Profile
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Notes & Quick Stats */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Internal Notes</h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/40 p-4 rounded-xl border border-slate-850">
              {customer.notes || 'No notes added yet. Edit profile to write background details.'}
            </p>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Pipeline Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                <span className="text-xs text-slate-500 block">Total Deals</span>
                <span className="text-lg font-bold text-white mt-1 block">{deals.length}</span>
              </div>
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                <span className="text-xs text-slate-500 block">Deals Value</span>
                <span className="text-lg font-bold text-brand-400 mt-1 block">
                  {formatCurrency(deals.reduce((sum, d) => sum + (d.stage === 'closed-won' || d.stage !== 'closed-lost' ? d.value : 0), 0))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Associated Activities, Deals, and Leads */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-800 gap-6">
            <button 
              onClick={() => setActiveTab('activities')}
              className={`pb-3 font-semibold text-sm transition-colors relative ${
                activeTab === 'activities' ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <History className="w-4 h-4" />
                Activities ({activities.length})
              </span>
              {activeTab === 'activities' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />}
            </button>
            <button 
              onClick={() => setActiveTab('deals')}
              className={`pb-3 font-semibold text-sm transition-colors relative ${
                activeTab === 'deals' ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Deals ({deals.length})
              </span>
              {activeTab === 'deals' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />}
            </button>
            <button 
              onClick={() => setActiveTab('leads')}
              className={`pb-3 font-semibold text-sm transition-colors relative ${
                activeTab === 'leads' ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Leads ({leads.length})
              </span>
              {activeTab === 'leads' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />}
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === 'activities' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Communication Timeline</h4>
                  <button 
                    onClick={() => setShowActivityForm(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Log Activity
                  </button>
                </div>

                {showActivityForm && (
                  <ActivityForm 
                    onSubmit={handleAddActivity}
                    onClose={() => setShowActivityForm(false)}
                  />
                )}

                <ActivityFeed activities={activities} />
              </div>
            )}

            {activeTab === 'deals' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Customer Pipeline</h4>
                {deals.length === 0 ? (
                  <div className="glass rounded-xl p-8 text-center text-slate-500 text-sm">
                    No deals open for this customer.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {deals.map(deal => (
                      <div key={deal._id} className="glass border border-slate-800/80 p-5 rounded-xl space-y-3">
                        <div className="flex justify-between items-start">
                          <h5 className="font-bold text-white">{deal.title}</h5>
                          <span className={getStatusBadgeClass(deal.stage)}>{deal.stage}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Value</span>
                          <span className="font-bold text-brand-400">{formatCurrency(deal.value)}</span>
                        </div>
                        {deal.expectedCloseDate && (
                          <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-800 pt-2">
                            <span>Close Date</span>
                            <span>{formatDate(deal.expectedCloseDate)}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'leads' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Associated Leads</h4>
                {leads.length === 0 ? (
                  <div className="glass rounded-xl p-8 text-center text-slate-500 text-sm">
                    No leads associated with this customer.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leads.map(lead => (
                      <div key={lead._id} className="glass border border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
                        <div className="space-y-1">
                          <h5 className="font-semibold text-white text-sm">{lead.name}</h5>
                          <div className="flex gap-3 text-xs text-slate-400">
                            <span>Source: <strong className="text-slate-300">{lead.source}</strong></span>
                            <span>Assigned: <strong className="text-slate-300">{lead.assignedTo || 'Unassigned'}</strong></span>
                          </div>
                        </div>
                        <span className={getStatusBadgeClass(lead.status)}>{lead.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
