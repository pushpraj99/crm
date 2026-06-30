import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import * as customerService from '../services/customerService';
import * as leadService from '../services/leadService';
import * as dealService from '../services/dealService';
import * as activityService from '../services/activityService';
import * as authService from '../services/authService';
import * as notificationService from '../services/notificationService';

const CRMContext = createContext();

export const CRMProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [customersPagination, setCustomersPagination] = useState({});
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Logout confirmation modal
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Theme
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });
  // Brand accent color
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('accentColor') || 'blue');

  useEffect(() => {
    if (isDark) { document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark'); }
    else        { document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light'); }
  }, [isDark]);

  // Apply accent colors dynamically to root
  useEffect(() => {
    const root = document.documentElement;
    const accentMap = {
      blue:     { light: '#0276cd', dark: '#38b0fa', softLight: '#e0effe', softDark: '#082a4a' },
      teal:     { light: '#0d9488', dark: '#2dd4bf', softLight: '#f0fdfa', softDark: '#042f2e' },
      emerald:  { light: '#059669', dark: '#34d399', softLight: '#ecfdf5', softDark: '#064e3b' },
      purple:   { light: '#7c3aed', dark: '#a78bfa', softLight: '#f5f3ff', softDark: '#2e1065' },
      amber:    { light: '#d97706', dark: '#fbbf24', softLight: '#fefbeb', softDark: '#451a03' },
      rose:     { light: '#e11d48', dark: '#fb7185', softLight: '#fff1f2', softDark: '#4c0519' }
    };

    const active = accentMap[accentColor] || accentMap.blue;
    const primaryAccent = isDark ? active.dark : active.light;
    const softAccent = isDark ? active.softDark : active.softLight;

    root.style.setProperty('--accent', primaryAccent);
    root.style.setProperty('--accent-soft', softAccent);
  }, [accentColor, isDark]);

  const toggleTheme = useCallback(() => setIsDark(prev => !prev), []);

  const changeAccentColor = useCallback((color) => {
    setAccentColor(color);
    localStorage.setItem('accentColor', color);
  }, []);

  // ──────── DATA FETCHING ────────
  const fetchCustomers = async (params = {}) => {
    try {
      setLoading(true);
      const res = await customerService.getCustomers(params);
      if (res.success) { setCustomers(res.data.customers); setCustomersPagination(res.data.pagination); }
      setError(null);
    } catch (err) { setError(err.response?.data?.message || 'Error loading customers'); }
    finally { setLoading(false); }
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await leadService.getLeads();
      if (res.success) setLeads(res.data);
      setError(null);
    } catch (err) { setError(err.response?.data?.message || 'Error loading leads'); }
    finally { setLoading(false); }
  };

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const res = await dealService.getDeals();
      if (res.success) setDeals(res.data);
      setError(null);
    } catch (err) { setError(err.response?.data?.message || 'Error loading deals'); }
    finally { setLoading(false); }
  };

  const fetchActivities = async (params = {}) => {
    try {
      setLoading(true);
      const res = await activityService.getActivities(params);
      if (res.success) setActivities(res.data);
      setError(null);
    } catch (err) { setError(err.response?.data?.message || 'Error loading activities'); }
    finally { setLoading(false); }
  };

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      if (res.success) setNotifications(res.data);
    } catch (err) {
      console.error('Error loading notifications:', err.message);
    }
  };

  const markNotificationRead = async (id) => {
    try {
      const res = await notificationService.markAsRead(id);
      if (res.success) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      }
    } catch (err) {
      console.error('Error marking notification read:', err.message);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      const res = await notificationService.markAllRead();
      if (res.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error('Error marking all read:', err.message);
    }
  };

  const loadAllData = async () => {
    if (!localStorage.getItem('token')) return;
    setLoading(true);
    try {
      await Promise.all([
        fetchCustomers({ page: 1, limit: 100 }),
        fetchLeads(),
        fetchDeals(),
        fetchActivities({ limit: 100 }),
        fetchNotifications()
      ]);
    } catch (err) { console.error('Error loading CRM data:', err.message); }
    finally { setLoading(false); }
  };

  // ──────── AUTH ────────
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.success) {
            setUser(res.data);
            setIsAuthenticated(true);
            await Promise.all([
              customerService.getCustomers({ page: 1, limit: 100 }).then(r => r.success && setCustomers(r.data.customers)),
              leadService.getLeads().then(r => r.success && setLeads(r.data)),
              dealService.getDeals().then(r => r.success && setDeals(r.data)),
              activityService.getActivities({ limit: 100 }).then(r => r.success && setActivities(r.data)),
              notificationService.getNotifications().then(r => r.success && setNotifications(r.data))
            ]);
            setCurrentPage('dashboard');
          } else {
            localStorage.removeItem('token');
            setCurrentPage('landing');
          }
        } catch (err) {
          console.error('Auto login check failed:', err.message);
          localStorage.removeItem('token');
          setCurrentPage('landing');
        }
      } else { setCurrentPage('landing'); }
      setAuthLoading(false);
    };
    checkAuth();
  }, []);

  const loginUser = async (email, password) => {
    try {
      setLoading(true); setError(null);
      const res = await authService.login(email, password);
      if (res.success) {
        localStorage.setItem('token', res.token);
        setUser(res.data);
        setIsAuthenticated(true);
        setCurrentPage('dashboard');
        await loadAllData();
      }
      return res;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed';
      setError(errMsg); throw new Error(errMsg);
    } finally { setLoading(false); }
  };

  const registerUser = async (name, email, password) => {
    try {
      setLoading(true); setError(null);
      const res = await authService.register(name, email, password);
      if (res.success) {
        localStorage.setItem('token', res.token);
        setUser(res.data);
        setIsAuthenticated(true);
        setCurrentPage('dashboard');
        await loadAllData();
      }
      return res;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed';
      setError(errMsg); throw new Error(errMsg);
    } finally { setLoading(false); }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setUser(null); setIsAuthenticated(false);
    setCustomers([]); setLeads([]); setDeals([]); setActivities([]); setNotifications([]);
    setShowLogoutConfirm(false);
    setCurrentPage('landing');
  };

  const triggerLogout = () => setShowLogoutConfirm(true);

  // ──────── CUSTOMER CRUD ────────
  const triggerCreateCustomer = async (data) => { const res = await customerService.createCustomer(data); await loadAllData(); return res; };
  const triggerUpdateCustomer = async (id, data) => { const res = await customerService.updateCustomer(id, data); await loadAllData(); return res; };
  const triggerDeleteCustomer = async (id) => { const res = await customerService.deleteCustomer(id); await loadAllData(); return res; };

  // ──────── LEAD CRUD ────────
  const triggerCreateLead = async (data) => { const res = await leadService.createLead(data); await loadAllData(); return res; };
  const triggerUpdateLead = async (id, data) => { const res = await leadService.updateLead(id, data); await loadAllData(); return res; };
  const triggerDeleteLead = async (id) => { const res = await leadService.deleteLead(id); await loadAllData(); return res; };

  // ──────── DEAL CRUD ────────
  const triggerCreateDeal = async (data) => { const res = await dealService.createDeal(data); await loadAllData(); return res; };
  const triggerUpdateDeal = async (id, data) => { const res = await dealService.updateDeal(id, data); await loadAllData(); return res; };
  const triggerDeleteDeal = async (id) => { const res = await dealService.deleteDeal(id); await loadAllData(); return res; };

  // ──────── ACTIVITY CRUD ────────
  const triggerLogActivity = async (data) => { const res = await activityService.logActivity(data); await loadAllData(); return res; };
  const triggerUpdateActivity = async (id, data) => { const res = await activityService.updateActivity(id, data); await loadAllData(); return res; };
  const triggerDeleteActivity = async (id) => { const res = await activityService.deleteActivity(id); await loadAllData(); return res; };

  return (
    <CRMContext.Provider value={{
      // Data
      customers, customersPagination, leads, deals, activities, notifications,
      loading, error,
      // Navigation
      currentPage, setCurrentPage,
      selectedCustomerId, setSelectedCustomerId,
      // Data ops
      fetchCustomers, fetchLeads, fetchDeals, fetchActivities, fetchNotifications, loadAllData,
      markNotificationRead, markAllNotificationsRead,
      // Customer
      createCustomer: triggerCreateCustomer,
      updateCustomer: triggerUpdateCustomer,
      deleteCustomer: triggerDeleteCustomer,
      // Lead
      createLead: triggerCreateLead,
      updateLead: triggerUpdateLead,
      deleteLead: triggerDeleteLead,
      // Deal
      createDeal: triggerCreateDeal,
      updateDeal: triggerUpdateDeal,
      deleteDeal: triggerDeleteDeal,
      // Activity
      logActivity: triggerLogActivity,
      updateActivity: triggerUpdateActivity,
      deleteActivity: triggerDeleteActivity,
      // Auth
      user, isAuthenticated, authLoading,
      login: loginUser,
      register: registerUser,
      logout: logoutUser,
      triggerLogout,
      showLogoutConfirm, setShowLogoutConfirm,
      // Theme
      isDark, toggleTheme,
      accentColor, changeAccentColor
    }}>
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => useContext(CRMContext);
