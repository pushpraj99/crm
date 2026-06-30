import React, { useState, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { X } from 'lucide-react';

const ActivityForm = ({ activity, customerId, onSubmit, onClose }) => {
  const { customers } = useCRM();
  const [formData, setFormData] = useState({
    title: '',
    category: 'sales',
    type: 'call',
    contactName: '',
    company: '',
    priority: 'medium',
    status: 'completed',
    activityDate: new Date().toISOString().split('T')[0],
    description: '',
    customerId: customerId || ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (activity) {
      setFormData({
        title: activity.title || '',
        category: activity.category || 'sales',
        type: activity.type || 'call',
        contactName: activity.contactName || '',
        company: activity.company || '',
        priority: activity.priority || 'medium',
        status: activity.status || 'completed',
        activityDate: activity.activityDate ? activity.activityDate.split('T')[0] : new Date().toISOString().split('T')[0],
        description: activity.description || '',
        customerId: activity.customerId?._id || activity.customerId || ''
      });
    } else if (customerId) {
      setFormData(prev => ({ ...prev, customerId }));
    }
  }, [activity, customerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="th-surface rounded-2xl p-6 space-y-4 animate-fade-in">
      <div className="flex justify-between items-center pb-2 border-b th-border">
        <h4 className="text-sm font-bold th-text-primary uppercase tracking-wider">
          {activity ? 'Edit Activity Details' : 'Log New Activity'}
        </h4>
        {onClose && (
          <button type="button" onClick={onClose} className="text-slate-400 hover:th-text-primary transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-[10px] font-bold th-text-secondary uppercase tracking-wider">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Sales Follow-up Call"
            className={`w-full rounded-xl px-3.5 py-2 text-sm outline-none th-input ${
              errors.title ? 'border-rose-500/50' : ''
            }`}
          />
          {errors.title && <p className="text-[10px] text-rose-450">{errors.title}</p>}
        </div>

        {/* Category */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold th-text-secondary uppercase tracking-wider">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-xl px-3.5 py-2 text-sm outline-none th-input cursor-pointer"
          >
            <option value="sales">Sales</option>
            <option value="support">Support</option>
            <option value="marketing">Marketing</option>
            <option value="internal">Internal</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Type */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold th-text-secondary uppercase tracking-wider">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full rounded-xl px-3.5 py-2 text-sm outline-none th-input cursor-pointer"
          >
            <option value="call">📞 Phone Call</option>
            <option value="email">✉️ Email Message</option>
            <option value="meeting">🤝 Meeting</option>
            <option value="note">📝 Note</option>
          </select>
        </div>

        {/* Contact Name */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold th-text-secondary uppercase tracking-wider">Contact Name</label>
          <input
            type="text"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            placeholder="e.g. John Connor"
            className="w-full rounded-xl px-3.5 py-2 text-sm outline-none th-input"
          />
        </div>

        {/* Company */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold th-text-secondary uppercase tracking-wider">Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            placeholder="e.g. Cyberdyne Systems"
            className="w-full rounded-xl px-3.5 py-2 text-sm outline-none th-input"
          />
        </div>

        {/* Priority */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold th-text-secondary uppercase tracking-wider">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full rounded-xl px-3.5 py-2 text-sm outline-none th-input cursor-pointer"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        {/* Status */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold th-text-secondary uppercase tracking-wider">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-xl px-3.5 py-2 text-sm outline-none th-input cursor-pointer"
          >
            <option value="planned">Planned</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Date */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold th-text-secondary uppercase tracking-wider">Activity Date</label>
          <input
            type="date"
            name="activityDate"
            value={formData.activityDate}
            onChange={handleChange}
            className="w-full rounded-xl px-3.5 py-2 text-sm outline-none th-input cursor-pointer"
          />
        </div>

        {/* Associated Customer select */}
        {!customerId && (
          <div className="space-y-1">
            <label className="text-[10px] font-bold th-text-secondary uppercase tracking-wider">Associated Customer</label>
            <select
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              className="w-full rounded-xl px-3.5 py-2 text-sm outline-none th-input cursor-pointer"
            >
              <option value="">Select Customer (Optional)</option>
              {customers.map(c => (
                <option key={c._id} value={c._id}>{c.name} ({c.company || 'Private'})</option>
              ))}
            </select>
          </div>
        )}

        {/* Description */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-[10px] font-bold th-text-secondary uppercase tracking-wider">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Provide communication details and notes..."
            className={`w-full rounded-xl px-3.5 py-2 text-sm outline-none th-input resize-none ${
              errors.description ? 'border-rose-500/50' : ''
            }`}
          />
          {errors.description && <p className="text-[10px] text-rose-455">{errors.description}</p>}
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-2 border-t th-border">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold border th-border th-text-secondary bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-colors shadow-lg shadow-brand-600/15"
        >
          {activity ? 'Save Changes' : 'Log Activity'}
        </button>
      </div>
    </form>
  );
};

export default ActivityForm;
