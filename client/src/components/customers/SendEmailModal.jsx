import React, { useState } from 'react';
import { X, Mail, Send, RefreshCw, User, MessageSquare } from 'lucide-react';
import { sendCustomerEmail } from '../../services/customerService';
import { showSuccess, showError } from '../../utils/alerts';

const SendEmailModal = ({ customer, onClose }) => {
  const [formData, setFormData] = useState({
    subject: '',
    body: ''
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim()) { setError('Subject is required'); return; }
    if (!formData.body.trim()) { setError('Message body is required'); return; }

    try {
      setSending(true);
      setError('');
      const res = await sendCustomerEmail(customer._id, {
        to: customer.email,
        subject: formData.subject,
        body: formData.body,
        customerName: customer.name
      });
      if (res.success) {
        setSent(true);
        showSuccess('Email Sent', `Email delivered to ${customer.email}`);
        setTimeout(() => onClose(), 1800);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send email. Check SMTP settings.';
      setError(msg);
      showError('Email Failed', msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg th-surface border th-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b th-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-md shadow-brand-500/20">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold th-text-primary">Send Email</h3>
              <p className="text-xs th-text-muted">Compose a message to this contact</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 th-text-muted hover:th-text-primary">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">

            {/* To: field (read-only) */}
            <div className="space-y-1">
              <label className="text-xs font-bold th-text-secondary uppercase tracking-wider">To</label>
              <div
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border th-border text-sm"
                style={{ backgroundColor: 'var(--bg-elevated)' }}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-brand-600 dark:text-brand-400 shrink-0" style={{ backgroundColor: 'var(--accent-soft)' }}>
                  {customer.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <span className="font-semibold th-text-primary text-xs">{customer.name}</span>
                  <span className="th-text-muted text-xs ml-2">&lt;{customer.email}&gt;</span>
                </div>
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1">
              <label className="text-xs font-bold th-text-secondary uppercase tracking-wider">Subject *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Follow-up on your proposal"
                className={`w-full rounded-xl px-3.5 py-2.5 text-sm outline-none th-input ${error && !formData.subject ? 'border-rose-500/50' : ''}`}
                disabled={sending || sent}
                autoFocus
              />
            </div>

            {/* Message Body */}
            <div className="space-y-1">
              <label className="text-xs font-bold th-text-secondary uppercase tracking-wider">Message *</label>
              <textarea
                name="body"
                value={formData.body}
                onChange={handleChange}
                rows={7}
                placeholder={`Dear ${customer.name},\n\nI wanted to follow up on...`}
                className={`w-full rounded-xl px-3.5 py-2.5 text-sm outline-none th-input resize-none ${error && !formData.body ? 'border-rose-500/50' : ''}`}
                disabled={sending || sent}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
                {error}
              </div>
            )}

            {/* Success */}
            {sent && (
              <div className="p-3 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl font-semibold flex items-center gap-2">
                <Send className="w-3.5 h-3.5" />
                Email sent successfully to {customer.email}!
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t th-border flex items-center justify-between gap-3 shrink-0" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <p className="text-[10px] th-text-muted">
              Sent via your configured SMTP server
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={sending}
                className="px-4 py-2 rounded-xl text-xs font-semibold border th-border th-text-secondary bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending || sent}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-colors shadow-lg shadow-brand-600/15 disabled:opacity-50"
              >
                {sending ? (
                  <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Sending...</>
                ) : sent ? (
                  <><Send className="w-3.5 h-3.5" /> Sent!</>
                ) : (
                  <><Send className="w-3.5 h-3.5" /> Send Email</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendEmailModal;
