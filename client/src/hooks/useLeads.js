import { useCRM } from '../context/CRMContext';

export const useLeads = () => {
  const {
    leads,
    loading,
    error,
    fetchLeads,
    createLead,
    updateLead,
    deleteLead
  } = useCRM();

  return {
    leads,
    loading,
    error,
    fetchLeads,
    createLead,
    updateLead,
    deleteLead
  };
};
