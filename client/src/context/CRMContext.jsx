import React, { createContext, useState, useEffect, useContext } from 'react';
import * as customerService from '../services/customerService';
import * as leadService from '../services/leadService';
import * as dealService from '../services/dealService';
import * as activityService from '../services/activityService';

const CRMContext = createContext();

export const CRMProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [customersPagination, setCustomersPagination] = useState({});
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const fetchCustomers = async (params = {}) => {
    try {
      setLoading(true);
      const res = await customerService.getCustomers(params);
      if (res.success) {
        setCustomers(res.data.customers);
        setCustomersPagination(res.data.pagination);
      }
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading customers');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await leadService.getLeads();
      if (res.success) {
        setLeads(res.data);
      }
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading leads');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const res = await dealService.getDeals();
      if (res.success) {
        setDeals(res.data);
      }
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading deals');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await activityService.getActivities();
      if (res.success) {
        setActivities(res.data);
      }
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading activities');
    } finally {
      setLoading(false);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchCustomers({ page: 1, limit: 100 }),
      fetchLeads(),
      fetchDeals(),
      fetchActivities()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const triggerCreateCustomer = async (data) => {
    const res = await customerService.createCustomer(data);
    await loadAllData();
    return res;
  };

  const triggerUpdateCustomer = async (id, data) => {
    const res = await customerService.updateCustomer(id, data);
    await loadAllData();
    return res;
  };

  const triggerDeleteCustomer = async (id) => {
    const res = await customerService.deleteCustomer(id);
    await loadAllData();
    return res;
  };

  const triggerCreateLead = async (data) => {
    const res = await leadService.createLead(data);
    await loadAllData();
    return res;
  };

  const triggerUpdateLead = async (id, data) => {
    const res = await leadService.updateLead(id, data);
    await loadAllData();
    return res;
  };

  const triggerDeleteLead = async (id) => {
    const res = await leadService.deleteLead(id);
    await loadAllData();
    return res;
  };

  const triggerCreateDeal = async (data) => {
    const res = await dealService.createDeal(data);
    await loadAllData();
    return res;
  };

  const triggerUpdateDeal = async (id, data) => {
    const res = await dealService.updateDeal(id, data);
    await loadAllData();
    return res;
  };

  const triggerDeleteDeal = async (id) => {
    const res = await dealService.deleteDeal(id);
    await loadAllData();
    return res;
  };

  const triggerLogActivity = async (data) => {
    const res = await activityService.logActivity(data);
    await loadAllData();
    return res;
  };

  return (
    <CRMContext.Provider value={{
      customers,
      customersPagination,
      leads,
      deals,
      activities,
      loading,
      error,
      currentPage,
      setCurrentPage,
      selectedCustomerId,
      setSelectedCustomerId,
      fetchCustomers,
      fetchLeads,
      fetchDeals,
      fetchActivities,
      loadAllData,
      createCustomer: triggerCreateCustomer,
      updateCustomer: triggerUpdateCustomer,
      deleteCustomer: triggerDeleteCustomer,
      createLead: triggerCreateLead,
      updateLead: triggerUpdateLead,
      deleteLead: triggerDeleteLead,
      createDeal: triggerCreateDeal,
      updateDeal: triggerUpdateDeal,
      deleteDeal: triggerDeleteDeal,
      logActivity: triggerLogActivity
    }}>
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => useContext(CRMContext);
