import React, { useState, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { X } from 'lucide-react';

const DealForm = ({ deal, onSubmit, onClose }) => {
  const { customers } = useCRM();
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    stage: 'prospecting',
    customerId: '',
    expectedCloseDate: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title || '',
        value: deal.value || '',
        stage: deal.stage || 'prospecting',
        customerId: deal.customerId?._id || deal.customerId || '',
        expectedCloseDate: deal.expectedCloseDate ? deal.expectedCloseDate.split('T')[0] : '',
        notes: deal.notes || ''
      });
    }
  }, [deal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Deal title is required';
    if (!formData.value || parseFloat(formData.value) < 0) {
      newErrors.value = 'A valid positive value is required';
    }
    if (!formData.customerId) newErrors.customerId = 'Associated customer is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      value: parseFloat(formData.value)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">
            {deal ? 'Edit Deal' : 'Create New Deal'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-slate-400">Deal Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Enterprise License Expansion"
                className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all ${
                  errors.title ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-800 focus:border-brand-500'
                }`}
              />
              {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
            </div>

            {/* Value */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Deal Value (USD) *</label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                placeholder="e.g. 15000"
                className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all ${
                  errors.value ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-800 focus:border-brand-500'
                }`}
              />
              {errors.value && <p className="text-xs text-rose-400 mt-1">{errors.value}</p>}
            </div>

            {/* Customer select */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Customer *</label>
              <select
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all ${
                  errors.customerId ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-800 focus:border-brand-500'
                }`}
              >
                <option value="">Select Customer</option>
                {customers.map(c => (
                  <option key={c._id} value={c._id}>{c.name} ({c.company || 'Private'})</option>
                ))}
              </select>
              {errors.customerId && <p className="text-xs text-rose-400 mt-1">{errors.customerId}</p>}
            </div>

            {/* Stage */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Pipeline Stage</label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
              >
                <option value="prospecting">Prospecting</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="closed-won">Closed Won</option>
                <option value="closed-lost">Closed Lost</option>
              </select>
            </div>

            {/* Expected Close Date */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Expected Close Date</label>
              <input
                type="date"
                name="expectedCloseDate"
                value={formData.expectedCloseDate}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-slate-400">Deal Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Include specifications, key decisions, or updates about this deal..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all resize-none"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-colors shadow-lg shadow-brand-600/15"
            >
              {deal ? 'Save Changes' : 'Create Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DealForm;
