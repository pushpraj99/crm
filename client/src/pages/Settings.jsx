import React, { useState, useEffect } from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  User, Shield, Palette, Database, History, Sparkles, RefreshCw, 
  Download, Upload, Check, AlertTriangle, Eye, EyeOff, Lock, Mail, ShieldAlert
} from 'lucide-react';
import { 
  getLoginHistory, changePassword, changeEmail, updatePasswordPolicy 
} from '../services/authService';
import { 
  exportData, importData, downloadBackup, getStats 
} from '../services/settingsService';
import { formatDate } from '../utils/helpers';

const Settings = () => {
  const { 
    createCustomer, createLead, createDeal, logActivity, loadAllData, 
    isDark, toggleTheme, accentColor, changeAccentColor, activities 
  } = useCRM();

  // Tabs
  const [activeTab, setActiveTab] = useState('general'); // general, appearance, security, logs, data

  // State: Seeding
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState('');

  // State: Stats
  const [stats, setStats] = useState({ customers: 0, leads: 0, deals: 0, activities: 0 });
  const [statsLoading, setStatsLoading] = useState(false);

  // State: Security
  const [loginHistory, setLoginHistory] = useState([]);
  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwShow, setPwShow] = useState(false);

  const [emailNew, setEmailNew] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const [emailError, setEmailError] = useState('');

  const [policyMinLength, setPolicyMinLength] = useState(6);
  const [policyNumbers, setPolicyNumbers] = useState(false);
  const [policySpecial, setPolicySpecial] = useState(false);
  const [policySuccess, setPolicySuccess] = useState(false);

  // State: Data management
  const [importMode, setImportMode] = useState('merge');
  const [importResult, setImportResult] = useState(null);
  const [importError, setImportError] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);

  // Accent options
  const accentOptions = [
    { name: 'Sleek Blue',  value: 'blue',  colorClass: 'bg-blue-600' },
    { name: 'Vibrant Teal',value: 'teal',  colorClass: 'bg-teal-650' },
    { name: 'Emerald',     value: 'emerald',colorClass: 'bg-emerald-600' },
    { name: 'Royal Purple',value: 'purple',colorClass: 'bg-purple-600' },
    { name: 'Hot Amber',   value: 'amber', colorClass: 'bg-amber-500' },
    { name: 'Sunset Rose', value: 'rose',  colorClass: 'bg-rose-500' }
  ];

  // Fetch security history/stats
  useEffect(() => {
    if (activeTab === 'security') {
      fetchHistory();
    }
    if (activeTab === 'general' || activeTab === 'data') {
      fetchStatsData();
    }
  }, [activeTab]);

  const fetchHistory = async () => {
    try {
      const res = await getLoginHistory();
      if (res.success) setLoginHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStatsData = async () => {
    try {
      setStatsLoading(true);
      const res = await getStats();
      if (res.success) setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Seed data
  const seedMockData = async () => {
    try {
      setSeeding(true);
      setSeedResult('Seeding CRM environment...');
      const c1 = await createCustomer({ name: 'Sarah Connor', email: 'sarah.c@cyberdyne.com', phone: '+1 555-800-1011', company: 'Cyberdyne Systems', status: 'active', notes: 'Defense Systems point-of-contact.' });
      const c2 = await createCustomer({ name: 'Bruce Wayne', email: 'bruce@waynecorp.com', phone: '+1 555-1939-0527', company: 'Wayne Enterprises', status: 'active', notes: 'Satellite logistics proposal interest.' });
      const c3 = await createCustomer({ name: 'Tony Stark', email: 'tony@starkindustries.com', phone: '+1 555-0808-1963', company: 'Stark Industries', status: 'prospect', notes: 'Exploring licensing models.' });
      
      await createLead({ name: 'Pepper Potts', email: 'pepper@starkindustries.com', phone: '+1 555-0808-1964', source: 'web', status: 'new', customerId: c3.data?._id });
      await createLead({ name: 'John Connor', email: 'john.c@cyberdyne.com', phone: '+1 555-800-1012', source: 'referral', status: 'contacted', customerId: c1.data?._id });

      if (c1.data) await createDeal({ title: 'Defense Systems Integration', value: 250000, stage: 'negotiation', customerId: c1.data._id, notes: 'Awaiting client security sign-off.' });
      if (c2.data) await createDeal({ title: 'Satellite Hardware Expansion', value: 85000, stage: 'proposal', customerId: c2.data._id, notes: 'Awaiting feedback from Gotham Towers.' });

      setSeedResult('Mock dataset seeded successfully!');
      await loadAllData();
      fetchStatsData();
    } catch (err) {
      setSeedResult(`Failed to seed data: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  // Change Password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');
    if (pwNew !== pwConfirm) {
      setPwError('New passwords do not match');
      return;
    }
    try {
      const res = await changePassword(pwCurrent, pwNew);
      if (res.success) {
        setPwSuccess('Password updated successfully');
        setPwCurrent('');
        setPwNew('');
        setPwConfirm('');
      }
    } catch (err) {
      setPwError(err.response?.data?.message || 'Password update failed');
    }
  };

  // Change Email
  const handleEmailChange = async (e) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess('');
    try {
      const res = await changeEmail(emailNew, emailPassword);
      if (res.success) {
        setEmailSuccess('Email address changed successfully');
        setEmailNew('');
        setEmailPassword('');
      }
    } catch (err) {
      setEmailError(err.response?.data?.message || 'Email change failed');
    }
  };

  // Password Policy
  const handlePolicySave = async (e) => {
    e.preventDefault();
    setPolicySuccess(false);
    try {
      const res = await updatePasswordPolicy({
        minLength: policyMinLength,
        requireNumbers: policyNumbers,
        requireSpecialChars: policySpecial
      });
      if (res.success) setPolicySuccess(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Export data
  const triggerExport = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smart-crm-export-${Date.now()}.json`;
      a.click();
    } catch (err) {
      alert('Export failed: ' + err.message);
    }
  };

  // Backup data
  const triggerBackup = async () => {
    try {
      setBackupLoading(true);
      const data = await downloadBackup();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smart-crm-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    } catch (err) {
      alert('Backup failed: ' + err.message);
    } finally {
      setBackupLoading(false);
    }
  };

  // File Upload / Import JSON
  const handleImportFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImportError(null);
    setImportResult(null);
    setImportLoading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target.result);
        const bundle = json.data ? json.data : json;
        const res = await importData(bundle, importMode);
        if (res.success) {
          setImportResult(res.data);
          await loadAllData();
          fetchStatsData();
        }
      } catch (err) {
        setImportError(err.response?.data?.message || 'Invalid JSON format or import error');
      } finally {
        setImportLoading(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Redesigned Tab Header */}
      <div className="flex border-b th-border overflow-x-auto gap-6 whitespace-nowrap">
        <button onClick={() => setActiveTab('general')} className={`pb-3 font-semibold text-sm transition-colors relative flex items-center gap-2 ${activeTab === 'general' ? 'th-text-primary' : 'th-text-secondary hover:th-text-primary'}`}>
          <User className="w-4 h-4" /> General
          {activeTab === 'general' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-full" />}
        </button>
        <button onClick={() => setActiveTab('appearance')} className={`pb-3 font-semibold text-sm transition-colors relative flex items-center gap-2 ${activeTab === 'appearance' ? 'th-text-primary' : 'th-text-secondary hover:th-text-primary'}`}>
          <Palette className="w-4 h-4" /> Appearance
          {activeTab === 'appearance' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-full" />}
        </button>
        <button onClick={() => setActiveTab('security')} className={`pb-3 font-semibold text-sm transition-colors relative flex items-center gap-2 ${activeTab === 'security' ? 'th-text-primary' : 'th-text-secondary hover:th-text-primary'}`}>
          <Shield className="w-4 h-4" /> Security
          {activeTab === 'security' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-full" />}
        </button>
        <button onClick={() => setActiveTab('logs')} className={`pb-3 font-semibold text-sm transition-colors relative flex items-center gap-2 ${activeTab === 'logs' ? 'th-text-primary' : 'th-text-secondary hover:th-text-primary'}`}>
          <History className="w-4 h-4" /> Activity Logs
          {activeTab === 'logs' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-full" />}
        </button>
        <button onClick={() => setActiveTab('data')} className={`pb-3 font-semibold text-sm transition-colors relative flex items-center gap-2 ${activeTab === 'data' ? 'th-text-primary' : 'th-text-secondary hover:th-text-primary'}`}>
          <Database className="w-4 h-4" /> Data Management
          {activeTab === 'data' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-full" />}
        </button>
      </div>

      {/* ──────────────── TAB: GENERAL ──────────────── */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {/* CRM Overview */}
          <div className="th-surface rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold th-text-primary">Smart CRM Overview</h3>
            <p className="text-sm th-text-secondary leading-relaxed">
              Your localized instance of Smart CRM is up-to-date and configured properly.
            </p>
            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <span className="text-[10px] uppercase font-bold th-text-muted">Database Server</span>
                <p className="text-xs font-semibold th-text-primary mt-0.5">MongoDB Connected</p>
              </div>
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <span className="text-[10px] uppercase font-bold th-text-muted">Vite Build Env</span>
                <p className="text-xs font-semibold th-text-primary mt-0.5">Development</p>
              </div>
            </div>
          </div>

          {/* Database seeding */}
          <div className="th-surface rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold th-text-primary">CRM Seeding Engine</h3>
            <p className="text-sm th-text-secondary">
              Seed a professional mock sales pipeline to test deal charts and statistics instantly.
            </p>
            <div className="pt-2">
              <button
                onClick={seedMockData}
                disabled={seeding}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold text-sm transition-colors shadow-lg shadow-brand-600/15"
              >
                {seeding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {seeding ? 'Seeding Mock Environment...' : 'Seed Professional Dataset'}
              </button>
              {seedResult && (
                <p className="text-xs text-center italic py-2 rounded-xl mt-3" style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                  {seedResult}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── TAB: APPEARANCE ──────────────── */}
      {activeTab === 'appearance' && (
        <div className="th-surface rounded-2xl p-6 space-y-6 animate-fade-in max-w-2xl">
          <div>
            <h3 className="text-base font-bold th-text-primary">Theme Mode Configuration</h3>
            <p className="text-xs th-text-muted mt-1">Configure light or premium dark visual layouts</p>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border th-border" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <div>
              <p className="text-sm font-semibold th-text-primary">Dark Mode Appearance</p>
              <p className="text-xs th-text-muted">Uses premium deep navy styles for comfortable workspace use</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                isDark ? 'bg-brand-600' : 'bg-slate-350 dark:bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  isDark ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Accent Color Selection */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold th-text-primary">Accent Theme Palette</h4>
            <p className="text-xs th-text-muted">Choose your default CRM highlights</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {accentOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => changeAccentColor(opt.value)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    accentColor === opt.value 
                      ? 'th-border-strong bg-slate-50 dark:bg-slate-900 shadow-sm'
                      : 'th-border bg-transparent'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${opt.colorClass}`} />
                  <span className="th-text-primary">{opt.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── TAB: SECURITY ──────────────── */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Form Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Change Password */}
            <div className="th-surface rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-600" />
                <h3 className="text-base font-bold th-text-primary">Change Workspace Password</h3>
              </div>
              {pwSuccess && <p className="text-xs text-emerald-500 font-semibold">{pwSuccess}</p>}
              {pwError && <p className="text-xs text-rose-500 font-semibold">{pwError}</p>}
              <form onSubmit={handlePasswordChange} className="space-y-3 pt-1">
                <input
                  type={pwShow ? 'text' : 'password'}
                  placeholder="Current Password"
                  required
                  value={pwCurrent}
                  onChange={(e) => setPwCurrent(e.target.value)}
                  className="w-full rounded-xl px-3.5 py-2 text-sm outline-none th-input"
                />
                <input
                  type={pwShow ? 'text' : 'password'}
                  placeholder="New Password"
                  required
                  value={pwNew}
                  onChange={(e) => setPwNew(e.target.value)}
                  className="w-full rounded-xl px-3.5 py-2 text-sm outline-none th-input"
                />
                <div className="flex gap-2">
                  <input
                    type={pwShow ? 'text' : 'password'}
                    placeholder="Confirm New Password"
                    required
                    value={pwConfirm}
                    onChange={(e) => setPwConfirm(e.target.value)}
                    className="flex-1 rounded-xl px-3.5 py-2 text-sm outline-none th-input"
                  />
                  <button
                    type="button"
                    onClick={() => setPwShow(!pwShow)}
                    className="px-3 rounded-xl border th-border th-text-secondary bg-transparent text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {pwShow ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-colors">
                  Update Password
                </button>
              </form>
            </div>

            {/* Change Email */}
            <div className="th-surface rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-600" />
                <h3 className="text-base font-bold th-text-primary">Change Email Address</h3>
              </div>
              {emailSuccess && <p className="text-xs text-emerald-500 font-semibold">{emailSuccess}</p>}
              {emailError && <p className="text-xs text-rose-500 font-semibold">{emailError}</p>}
              <form onSubmit={handleEmailChange} className="space-y-3 pt-1">
                <input
                  type="email"
                  placeholder="New Email Address"
                  required
                  value={emailNew}
                  onChange={(e) => setEmailNew(e.target.value)}
                  className="w-full rounded-xl px-3.5 py-2 text-sm outline-none th-input"
                />
                <input
                  type="password"
                  placeholder="Verify Account Password"
                  required
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                  className="w-full rounded-xl px-3.5 py-2 text-sm outline-none th-input"
                />
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-colors">
                  Update Account Email
                </button>
              </form>
            </div>

            {/* Login History */}
            <div className="th-surface rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold th-text-primary">Recent Authentication History</h3>
              <p className="text-xs th-text-muted">Displays last logins for security monitoring</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="th-text-muted border-b th-border">
                      <th className="py-2 pb-3">IP Address</th>
                      <th className="py-2 pb-3">Device / User Agent</th>
                      <th className="py-2 pb-3 text-right">Login Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginHistory.map((lh, idx) => (
                      <tr key={lh._id || idx} className="th-text-secondary border-b th-border last:border-0 hover:bg-slate-50/40 dark:hover:bg-slate-900/40">
                        <td className="py-3.5 font-semibold th-text-primary">{lh.ip}</td>
                        <td className="py-3.5 max-w-[200px] truncate" title={lh.userAgent}>{lh.userAgent}</td>
                        <td className="py-3.5 text-right th-text-muted">{formatDate(lh.loginAt)}</td>
                      </tr>
                    ))}
                    {loginHistory.length === 0 && (
                      <tr>
                        <td colSpan="3" className="py-4 text-center th-text-muted">No history logged yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Side: Password Policy */}
          <div className="space-y-6">
            <div className="th-surface rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-brand-650" />
                <h3 className="text-sm font-bold th-text-primary uppercase tracking-wider">Password Policy Settings</h3>
              </div>
              <p className="text-xs th-text-muted leading-relaxed">
                Enforce standard workspace complexity requirements for all users.
              </p>
              {policySuccess && <p className="text-xs text-emerald-500 font-semibold">Policy saved successfully</p>}
              
              <form onSubmit={handlePolicySave} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold th-text-secondary block">Minimum Length</label>
                  <input
                    type="number"
                    min="6"
                    max="30"
                    value={policyMinLength}
                    onChange={(e) => setPolicyMinLength(parseInt(e.target.value))}
                    className="w-full rounded-xl px-3 py-1.5 text-sm outline-none th-input"
                  />
                </div>

                <label className="flex items-center justify-between p-3 rounded-xl border th-border" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                  <div>
                    <p className="text-xs font-semibold th-text-primary">Require Numbers</p>
                    <p className="text-[10px] th-text-muted">Requires 0-9 digits</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={policyNumbers}
                    onChange={(e) => setPolicyNumbers(e.target.checked)}
                    className="rounded text-brand-600 focus:ring-brand-500/50 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border th-border" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                  <div>
                    <p className="text-xs font-semibold th-text-primary">Require Special Character</p>
                    <p className="text-[10px] th-text-muted">Requires e.g. @, #, $, *</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={policySpecial}
                    onChange={(e) => setPolicySpecial(e.target.checked)}
                    className="rounded text-brand-600 focus:ring-brand-500/50 cursor-pointer"
                  />
                </label>

                <button type="submit" className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-colors">
                  Save Policy Parameters
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── TAB: LOGS ──────────────── */}
      {activeTab === 'logs' && (
        <div className="th-surface rounded-2xl p-6 space-y-4 animate-fade-in">
          <div>
            <h3 className="text-base font-bold th-text-primary font-sans">CRM System Audit Logs</h3>
            <p className="text-xs th-text-muted">Complete timeline history logs for tracking sales activities and client communications</p>
          </div>
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="th-text-muted border-b th-border">
                  <th className="py-2 pb-3">Type</th>
                  <th className="py-2 pb-3">Action Description</th>
                  <th className="py-2 pb-3">Logged By</th>
                  <th className="py-2 pb-3 text-right">Audit Date</th>
                </tr>
              </thead>
              <tbody>
                {activities.slice(0, 30).map((act, index) => (
                  <tr key={act._id || index} className="border-b th-border last:border-0 hover:bg-slate-50/40 dark:hover:bg-slate-900/40 th-text-secondary">
                    <td className="py-3">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        act.type === 'call' ? 'bg-sky-500/10 text-sky-500' :
                        act.type === 'email' ? 'bg-amber-500/10 text-amber-500' :
                        act.type === 'meeting' ? 'bg-emerald-500/10 text-emerald-500' :
                        'bg-purple-500/10 text-purple-500'
                      }`}>
                        {act.type}
                      </span>
                    </td>
                    <td className="py-3 font-semibold th-text-primary max-w-[300px] truncate" title={act.description}>
                      {act.title || act.description}
                    </td>
                    <td className="py-3">{act.performedBy || 'System'}</td>
                    <td className="py-3 text-right th-text-muted">{formatDate(act.performedAt)}</td>
                  </tr>
                ))}
                {activities.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-8 text-center th-text-muted text-xs">No audit logs registered yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ──────────────── TAB: DATA MANAGEMENT ──────────────── */}
      {activeTab === 'data' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {/* Export Data */}
          <div className="th-surface rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold th-text-primary">Export CRM Records</h3>
            <p className="text-sm th-text-secondary leading-relaxed">
              Export all customer profiles, deal pipelines, communications, and logs to a standardized JSON schema bundle.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={triggerExport}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-brand-600/10"
              >
                <Download className="w-4 h-4" /> Export CRM Dataset
              </button>
              <button
                onClick={triggerBackup}
                disabled={backupLoading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border th-border th-text-secondary bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition-colors"
              >
                {backupLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                Download Backup Bundle
              </button>
            </div>
          </div>

          {/* Import & Restore */}
          <div className="th-surface rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold th-text-primary">Import & Restore Engine</h3>
            <p className="text-sm th-text-secondary">
              Upload a valid JSON database schema. Set merge mode or full restoration.
            </p>
            
            <div className="space-y-4 pt-2">
              {/* Import Mode Select */}
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs th-text-secondary cursor-pointer">
                  <input
                    type="radio"
                    name="importMode"
                    value="merge"
                    checked={importMode === 'merge'}
                    onChange={() => setImportMode('merge')}
                    className="text-brand-600 focus:ring-brand-500"
                  />
                  <span>Merge with existing records</span>
                </label>
                <label className="flex items-center gap-2 text-xs th-text-secondary cursor-pointer">
                  <input
                    type="radio"
                    name="importMode"
                    value="replace"
                    checked={importMode === 'replace'}
                    onChange={() => setImportMode('replace')}
                    className="text-brand-600 focus:ring-brand-500"
                  />
                  <span className="flex items-center gap-1 text-rose-500 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" /> Full Overwrite / Restore
                  </span>
                </label>
              </div>

              {/* Uploader Input */}
              <div className="relative border-2 border-dashed th-border rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50/20 dark:bg-slate-900/20 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                <Upload className="w-8 h-8 th-text-muted mb-2" />
                <p className="text-xs th-text-secondary font-medium">Click to select or drag backup JSON file</p>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  disabled={importLoading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {/* Result alerts */}
              {importLoading && (
                <div className="flex items-center gap-2 text-xs th-text-secondary">
                  <RefreshCw className="w-4 h-4 animate-spin text-brand-600" />
                  <span>Processing database validation rules...</span>
                </div>
              )}
              {importError && (
                <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
                  {importError}
                </div>
              )}
              {importResult && (
                <div className="p-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 space-y-2">
                  <p className="text-xs text-emerald-500 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> CRM Restored / Imported Successfully
                  </p>
                  <div className="grid grid-cols-4 gap-2 text-[10px] th-text-secondary font-semibold">
                    <div>Customers: {importResult.customers}</div>
                    <div>Leads: {importResult.leads}</div>
                    <div>Deals: {importResult.deals}</div>
                    <div>Activities: {importResult.activities}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
