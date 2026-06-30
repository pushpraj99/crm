import { useCRM } from '../context/CRMContext';

export const useCustomers = () => {
  const {
    customers,
    customersPagination,
    loading,
    error,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer
  } = useCRM();

  return {
    customers,
    customersPagination,
    loading,
    error,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer
  };
};
