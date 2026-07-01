import React, { useState, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { getCustomerById } from '../../services/customerService';
import { getStatusBadgeClass, formatCurrency, formatDate } from '../../utils/helpers';
import { 
  Building2, Mail, Phone, Calendar, ArrowLeft, Edit, Trash2, 
  Plus, History, Briefcase, Target, Send
} from 'lucide-react';
import ActivityFeed from '../activities/ActivityFeed';
import ActivityForm from '../activities/ActivityForm';
import SendEmailModal from './SendEmailModal';

const CustomerDetail = ({ customerId, onBack, onEdit, onDelete }) => {
  const { logActivity } = useCRM();
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [activeTab, setActiveTab] = useState('activities'); // activities, deals, leads
  const [showEmailModal, setShowEmailModal] = useState(false);

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
      <div className="flex justify-center items-center py-12 th-text-muted text-sm">
        Loading customer profile...
      </div>
    );
  }

  if (error || !detailData) {
    return (
      <div className="th-surface rounded-2xl p-8 text-center space-y-4 border th-border">
        <p className="text-rose-450 font-medium">{error || 'Failed to load customer profile.'}</p>
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
        className="inline-flex items-center gap-2 text-sm font-semibold th-text-secondary hover:th-text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Customers
      </button>

      {/* Profile Header */}
      <div className="th-surface rounded-2xl p-6 border th-border flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-brand-500/10">
            {customer.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold th-text-primary">{customer.name}</h2>
              <span className={getStatusBadgeClass(customer.status)}>{customer.status}</span>
            </div>
            {customer.company && (
              <div className="flex items-center gap-1.5 mt-1 th-text-secondary text-sm">
                <Building2 className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <span>{customer.company}</span>
              </div>
            )}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {customer.tags?.map((tag, idx) => (
                <span key={idx} className="th-badge-accent px-2 py-0.5 rounded text-xs font-semibold">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Info and Actions */}
        <div className="flex flex-col md:items-end gap-4 w-full md:w-auto">
          <div className="flex flex-wrap gap-x-6 gap-y-2 th-text-secondary text-xs">
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              {customer.email}
              <button
                onClick={() => setShowEmailModal(true)}
                title={`Send email to ${customer.email}`}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors hover:text-white"
                style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--border)' }}
              >
                <Send className="w-3 h-3" /> Send Email
              </button>
            </span>
            {customer.phone && (
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                {customer.phone}
              </span>
            )}
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              Joined {formatDate(customer.createdAt)}
            </span>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={() => onEdit(customer)}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border th-border th-text-secondary bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit Profile
            </button>
            <button 
              onClick={() => onDelete(customer._id)}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-colors border border-rose-500/20"
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
          <div className="th-surface rounded-2xl p-6 space-y-4 border th-border">
            <h3 className="text-sm font-bold th-text-primary uppercase tracking-wider">Internal Notes</h3>
            <p 
              className="text-sm th-text-secondary leading-relaxed whitespace-pre-line p-4 rounded-xl border th-border"
              style={{ backgroundColor: 'var(--bg-elevated)' }}
            >
              {customer.notes || 'No notes added yet. Edit profile to write background details.'}
            </p>
          </div>

          <div className="th-surface rounded-2xl p-6 border th-border">
            <h3 className="text-sm font-bold th-text-primary uppercase tracking-wider mb-4">Pipeline Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div 
                className="p-4 rounded-xl border th-border"
                style={{ backgroundColor: 'var(--bg-elevated)' }}
              >
                <span className="text-xs th-text-muted block">Total Deals</span>
                <span className="text-lg font-bold th-text-primary mt-1 block">{deals.length}</span>
              </div>
              <div 
                className="p-4 rounded-xl border th-border"
                style={{ backgroundColor: 'var(--bg-elevated)' }}
              >
                <span className="text-xs th-text-muted block">Deals Value</span>
                <span className="text-lg font-bold text-brand-600 dark:text-brand-400 mt-1 block">
                  {formatCurrency(deals.reduce((sum, d) => sum + (d.stage === 'closed-won' || d.stage !== 'closed-lost' ? d.value : 0), 0))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Associated Activities, Deals, and Leads */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Navigation */}
          <div className="flex border-b th-border gap-6">
            <button 
              onClick={() => setActiveTab('activities')}
              className={`pb-3 font-semibold text-sm transition-colors relative ${
                activeTab === 'activities' ? 'th-text-primary' : 'th-text-secondary hover:th-text-primary'
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
                activeTab === 'deals' ? 'th-text-primary' : 'th-text-secondary hover:th-text-primary'
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
                activeTab === 'leads' ? 'th-text-primary' : 'th-text-secondary hover:th-text-primary'
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
                  <h4 className="text-sm font-bold th-text-muted uppercase tracking-wider">Communication Timeline</h4>
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
                <h4 className="text-sm font-bold th-text-muted uppercase tracking-wider">Customer Pipeline</h4>
                {deals.length === 0 ? (
                  <div className="th-surface border th-border rounded-xl p-8 text-center th-text-secondary text-sm">
                    No deals open for this customer.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {deals.map(deal => (
                      <div key={deal._id} className="th-surface border th-border p-5 rounded-xl space-y-3">
                        <div className="flex justify-between items-start">
                          <h5 className="font-bold th-text-primary">{deal.title}</h5>
                          <span className={getStatusBadgeClass(deal.stage)}>{deal.stage}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="th-text-muted">Value</span>
                          <span className="font-bold text-brand-600 dark:text-brand-400">{formatCurrency(deal.value)}</span>
                        </div>
                        {deal.expectedCloseDate && (
                          <div className="flex justify-between items-center text-xs th-text-muted border-t th-border pt-2">
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
                <h4 className="text-sm font-bold th-text-muted uppercase tracking-wider">Associated Leads</h4>
                {leads.length === 0 ? (
                  <div className="th-surface border th-border rounded-xl p-8 text-center th-text-secondary text-sm">
                    No leads associated with this customer.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leads.map(lead => (
                      <div key={lead._id} className="th-surface border th-border p-4 rounded-xl flex items-center justify-between">
                        <div className="space-y-1">
                          <h5 className="font-semibold th-text-primary text-sm">{lead.name}</h5>
                          <div className="flex gap-3 text-xs th-text-muted">
                            <span>Source: <strong className="th-text-secondary">{lead.source}</strong></span>
                            <span>Assigned: <strong className="th-text-secondary">{lead.assignedTo || 'Unassigned'}</strong></span>
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

      {showEmailModal && (
        <SendEmailModal
          customer={customer}
          onClose={() => setShowEmailModal(false)}
        />
      )}
    </div>
  );
};

export default CustomerDetail;
