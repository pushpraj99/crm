import React, { useState, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { X, Loader2 } from 'lucide-react';

const QuickEditCustomerModal = ({ customerId, onClose, onSaved }) => {
  const { customers, updateCustomer } = useCRM();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'prospect',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const customer = customers.find(c => c._id === customerId);
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        company: customer.company || '',
        status: customer.status || 'prospect',
        notes: customer.notes || ''
      });
    }
  }, [customerId, customers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await updateCustomer(customerId, formData);
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md th-surface rounded-2xl shadow-2xl overflow-hidden animate-fade-in border th-border">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b th-border">
          <h3 className="text-base font-bold th-text-primary">
            Edit Associated Customer
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:th-text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold th-text-secondary block mb-1">Customer Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl px-3.5 py-2 text-sm outline-none th-input"
              />
            </div>

            <div>
              <label className="text-xs font-semibold th-text-secondary block mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl px-3.5 py-2 text-sm outline-none th-input"
              />
            </div>

            <div>
              <label className="text-xs font-semibold th-text-secondary block mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-xl px-3.5 py-2 text-sm outline-none th-input"
              />
            </div>

            <div>
              <label className="text-xs font-semibold th-text-secondary block mb-1">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full rounded-xl px-3.5 py-2 text-sm outline-none th-input"
              />
            </div>

            <div>
              <label className="text-xs font-semibold th-text-secondary block mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl px-3.5 py-2 text-sm outline-none th-input cursor-pointer"
              >
                <option value="prospect">Prospect</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold th-text-secondary block mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="2"
                className="w-full rounded-xl px-3.5 py-2 text-sm outline-none th-input resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t th-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold th-border th-text-secondary bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-colors shadow-lg shadow-brand-600/10 flex items-center gap-1.5"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickEditCustomerModal;
