export const formatCurrency = (value) => {
  if (value === undefined || value === null) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'qualified':
    case 'closed-won':
      return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-xs font-medium';
    case 'inactive':
    case 'lost':
    case 'closed-lost':
      return 'bg-rose-500/15 text-rose-400 border border-rose-500/30 px-2.5 py-0.5 rounded-full text-xs font-medium';
    case 'prospect':
    case 'contacted':
    case 'proposal':
    case 'negotiation':
      return 'bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-xs font-medium';
    case 'new':
    case 'prospecting':
    default:
      return 'bg-brand-500/15 text-brand-400 border border-brand-500/30 px-2.5 py-0.5 rounded-full text-xs font-medium';
  }
};
