import React, { useState, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { X, Edit } from 'lucide-react';
import QuickEditCustomerModal from '../customers/QuickEditCustomerModal';

const LeadForm = ({ lead, onSubmit, onClose }) => {
  const { customers, user } = useCRM();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'web',
    status: 'new',
    assignedTo: '',
    customerId: ''
  });
  const [errors, setErrors] = useState({});
  const [showEditCustomer, setShowEditCustomer] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        source: lead.source || 'web',
        status: lead.status || 'new',
        assignedTo: lead.assignedTo || '',
        customerId: lead.customerId?._id || lead.customerId || ''
      });
    }
  }, [lead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Lead name is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      customerId: formData.customerId || null
    });
  };


  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">
            {lead ? 'Edit Lead' : 'Add New Lead'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold th-text-secondary">Lead Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Acme Tech Solutions"
                className={`w-full rounded-xl px-4 py-2.5 text-sm outline-none th-input ${errors.name ? 'border-rose-500/50 focus:ring-rose-500/20' : ''
                  }`}
              />
              {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold th-text-secondary">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. info@acmetech.com"
                className={`w-full rounded-xl px-4 py-2.5 text-sm outline-none th-input ${errors.email ? 'border-rose-500/50 focus:ring-rose-500/20' : ''
                  }`}
              />
              {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-semibold th-text-secondary">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +1 555-0144"
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none th-input"
              />
            </div>

            {/* Source */}
            <div className="space-y-1">
              <label className="text-xs font-semibold th-text-secondary">Lead Source</label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none th-input cursor-pointer"
              >
                <option value="web">Web</option>
                <option value="referral">Referral</option>
                <option value="cold-call">Cold Call</option>
                <option value="social">Social</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="text-xs font-semibold th-text-secondary">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none th-input cursor-pointer"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            {/* Assigned To */}
            <div className="space-y-1">
              <label className="text-xs font-semibold th-text-secondary">Assigned Agent</label>
              <input
                type="text"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                placeholder="e.g. Agent Smith"
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none th-input"
              />
            </div>

            {/* Connected Customer */}
            <div className="space-y-1">
              <label className="text-xs font-semibold th-text-secondary">Associated Customer (Optional)</label>
              <div className="flex gap-2">
                <select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none th-input cursor-pointer"
                >
                  <option value="">None</option>
                  {customers.map(c => (
                    <option key={c._id} value={c._id}>{c.name} ({c.company || 'Private'})</option>
                  ))}
                </select>
                {formData.customerId && (
                  <button
                    type="button"
                    onClick={() => setShowEditCustomer(true)}
                    title="Edit Customer Information"
                    className="p-2.5 rounded-xl border th-border bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/40 dark:hover:bg-brand-950 text-brand-500 flex items-center justify-center transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold border th-border th-text-secondary bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-colors shadow-lg shadow-brand-600/15"
            >
              {lead ? 'Save Changes' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>

      {showEditCustomer && (
        <QuickEditCustomerModal
          customerId={formData.customerId}
          onClose={() => setShowEditCustomer(false)}
        />
      )}
    </div>
  );
};

export default LeadForm;
