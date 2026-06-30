import React, { useState } from 'react';
import { formatDate } from '../../utils/helpers';
import { Edit2, Trash2, Calendar, Phone, Mail, FileText, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { getStatusBadgeClass } from '../../utils/helpers';

const ActivityTable = ({ activities = [], onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Icons mapper
  const getActivityIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'call':    return <Phone className="w-3.5 h-3.5 text-sky-500" />;
      case 'email':   return <Mail className="w-3.5 h-3.5 text-amber-500" />;
      case 'meeting': return <Calendar className="w-3.5 h-3.5 text-emerald-500" />;
      default:        return <FileText className="w-3.5 h-3.5 text-purple-500" />;
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'bg-red-500/10 text-red-500 border border-red-500/20';
      case 'high':     return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      case 'medium':   return 'bg-sky-500/10 text-sky-500 border border-sky-500/20';
      case 'low':      
      default:         return 'bg-slate-500/10 text-slate-500 border border-slate-550/20';
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(activities.length / itemsPerPage) || 1;
  const paginatedActivities = activities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (activities.length === 0) {
    return (
      <div className="th-surface rounded-2xl p-12 text-center th-text-secondary text-sm">
        No activities found. Click "Log Communication" to add one.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="th-surface rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wider th-border th-text-muted" style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
                <th className="px-5 py-4">Title / Method</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Contact & Company</th>
                <th className="px-5 py-4">Priority</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedActivities.map((act) => (
                <tr key={act._id} className="th-row-hover text-sm border-b th-border" style={{ color: 'var(--text-secondary)' }}>
                  {/* Title & Type */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center border th-border bg-slate-50 dark:bg-slate-900">
                        {getActivityIcon(act.type)}
                      </div>
                      <div>
                        <p className="font-semibold th-text-primary truncate max-w-[200px]" title={act.title || act.description}>
                          {act.title || act.description}
                        </p>
                        <p className="text-[10px] uppercase tracking-wide th-text-muted">
                          {act.type}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-4">
                    <span className="text-xs font-medium capitalize th-text-primary">
                      {act.category || 'Other'}
                    </span>
                  </td>

                  {/* Contact & Company */}
                  <td className="px-5 py-4">
                    {act.contactName ? (
                      <div>
                        <p className="font-semibold th-text-primary">{act.contactName}</p>
                        {act.company && <p className="text-xs th-text-muted">{act.company}</p>}
                      </div>
                    ) : act.customerId?.name ? (
                      <div>
                        <p className="font-semibold th-text-primary">{act.customerId.name}</p>
                        {act.customerId.company && <p className="text-xs th-text-muted">{act.customerId.company}</p>}
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  {/* Priority */}
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getPriorityBadgeClass(act.priority)}`}>
                      {act.priority || 'medium'}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                      act.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                      act.status === 'planned' ? 'bg-sky-500/10 text-sky-500 border border-sky-500/20' :
                      act.status === 'in-progress' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                      'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                    }`}>
                      {act.status || 'completed'}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4 text-xs th-text-muted">
                    {formatDate(act.activityDate || act.performedAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(act)}
                        className="p-1.5 rounded-lg border th-border bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 hover:th-text-primary transition-colors"
                        title="Edit Activity"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(act._id)}
                        className="p-1.5 rounded-lg border border-red-500/10 hover:border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-red-500 transition-colors"
                        title="Delete Activity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs th-text-muted">
            Page <strong className="th-text-primary">{currentPage}</strong> of <strong className="th-text-primary">{totalPages}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border th-border bg-transparent hover:bg-slate-100 dark:hover:bg-slate-850 disabled:opacity-40 disabled:cursor-not-allowed text-slate-400"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border th-border bg-transparent hover:bg-slate-100 dark:hover:bg-slate-850 disabled:opacity-40 disabled:cursor-not-allowed text-slate-400"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityTable;
