import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { X } from 'lucide-react';

const ActivityForm = ({ customerId, onSubmit, onClose }) => {
  const { customers } = useCRM();
  const [formData, setFormData] = useState({
    type: 'call',
    description: '',
    performedBy: 'Admin User',
    customerId: customerId || ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.description.trim()) newErrors.description = 'Activity details are required';
    if (!formData.customerId) newErrors.customerId = 'Associated customer is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="glass border border-slate-800/80 rounded-2xl p-5 space-y-4 animate-fade-in">
      <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Log Communication Activity</h4>
        {onClose && (
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Type select */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Method</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
          >
            <option value="call">📞 Phone Call</option>
            <option value="email">✉️ Email Message</option>
            <option value="meeting">🤝 Conference / Meeting</option>
            <option value="note">📝 System Note</option>
          </select>
        </div>

        {/* Customer select if not defined */}
        {!customerId && (
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Customer *</label>
            <select
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              className={`w-full bg-slate-950 border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all ${
                errors.customerId ? 'border-rose-500/50' : 'border-slate-800 focus:border-brand-500'
              }`}
            >
              <option value="">Select Customer</option>
              {customers.map(c => (
                <option key={c._id} value={c._id}>{c.name} ({c.company || 'Private'})</option>
              ))}
            </select>
            {errors.customerId && <p className="text-[10px] text-rose-400 mt-1">{errors.customerId}</p>}
          </div>
        )}

        {/* Performed by */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Logged By</label>
          <input
            type="text"
            name="performedBy"
            value={formData.performedBy}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
        </div>

        {/* Description */}
        <div className="space-y-1 md:col-span-3">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Communication Details *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="2"
            placeholder="e.g. Left a VM regarding expansion packages, follow up scheduled next Monday."
            className={`w-full bg-slate-950 border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all resize-none ${
              errors.description ? 'border-rose-500/50' : 'border-slate-800 focus:border-brand-500'
            }`}
          />
          {errors.description && <p className="text-[10px] text-rose-400 mt-1">{errors.description}</p>}
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-2">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-colors shadow-lg shadow-brand-600/15"
        >
          Log Communication
        </button>
      </div>
    </form>
  );
};

export default ActivityForm;
