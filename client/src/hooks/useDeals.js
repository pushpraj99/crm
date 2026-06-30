import { useCRM } from '../context/CRMContext';

export const useDeals = () => {
  const {
    deals,
    loading,
    error,
    fetchDeals,
    createDeal,
    updateDeal,
    deleteDeal
  } = useCRM();

  return {
    deals,
    loading,
    error,
    fetchDeals,
    createDeal,
    updateDeal,
    deleteDeal
  };
};
