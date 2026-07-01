import React, { useState, useEffect, useCallback } from 'react';
import { useCRM } from '../context/CRMContext';
import {
  User, Shield, Database, History, Mail, Lock, Eye, EyeOff,
  ShieldAlert, Check, AlertTriangle, RefreshCw, Download, Upload,
  Sparkles, Users, UserPlus, Trash2, ChevronDown, X, BadgeCheck
} from 'lucide-react';
import {
  getLoginHistory, changePassword, changeEmail, updatePasswordPolicy
} from '../services/authService';
import {
  exportData, importData, downloadBackup, getStats,
  getSmtpSettings, saveSmtpSettings, testSmtpSettings
} from '../services/settingsService';
import {
  getMe, updateMe, getAllUsers, createUser, changeUserRole, deleteUser
} from '../services/userService';
import { formatDate } from '../utils/helpers';
import { showError, showSuccess } from '../utils/alerts';

/* ─── Shared input style ─── */
const inp = 'w-full rounded-xl px-3.5 py-2.5 text-sm outline-none th-input';
const btn = (color = 'brand') =>
  `inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 ${color === 'brand'
    ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/15'
    : 'border th-border th-text-secondary bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800'}`;

const ROLE_COLORS = {
  admin:   'bg-purple-500/10 text-purple-500',
  manager: 'bg-blue-500/10 text-blue-500',
  agent:   'bg-emerald-500/10 text-emerald-500',
  viewer:  'bg-slate-500/10 text-slate-400',
};

const Settings = () => {
  const {
    createCustomer, createLead, createDeal, loadAllData,
    activities, user: authUser
  } = useCRM();

  const [activeTab, setActiveTab] = useState('profile');

  /* ───── Profile State ───── */
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', department: '', bio: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  /* ───── Security State ───── */
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

  /* ───── Team State ───── */
  const [teamUsers, setTeamUsers] = useState([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', password: '', role: 'agent' });
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState('');

  /* ───── Data Management ───── */
  const [stats, setStats] = useState({ customers: 0, leads: 0, deals: 0, activities: 0 });
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState('');
  const [importMode, setImportMode] = useState('merge');
  const [importResult, setImportResult] = useState(null);
  const [importError, setImportError] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);

  /* ───── SMTP State ───── */
  const [smtpConfig, setSmtpConfig] = useState({ smtpHost: '', smtpPort: 587, smtpSecure: false, smtpUser: '', smtpPassword: '', smtpFromEmail: '' });
  const [smtpLoading, setSmtpLoading] = useState(false);
  const [smtpSuccess, setSmtpSuccess] = useState('');
  const [smtpError, setSmtpError] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState('');
  const [testError, setTestError] = useState('');

  /* ─── Load data when tab changes ─── */
  useEffect(() => {
    if (activeTab === 'profile') fetchProfile();
    if (activeTab === 'security') fetchHistory();
    if (activeTab === 'team') fetchTeam();
    if (activeTab === 'data') fetchStats();
    if (activeTab === 'smtp') fetchSmtpSettings();
  }, [activeTab]);

  /* ─── Profile ─── */
  const fetchProfile = async () => {
    try {
      const res = await getMe();
      if (res.success) {
        const u = res.data;
        setProfile({ name: u.name || '', email: u.email || '', phone: u.phone || '', department: u.department || '', bio: u.bio || '' });
      }
    } catch (e) { console.warn(e); }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileError(''); setProfileSuccess('');
    setProfileLoading(true);
    try {
      const res = await updateMe({ name: profile.name, phone: profile.phone, department: profile.department, bio: profile.bio });
      if (res.success) {
        setProfileSuccess('Profile updated successfully!');
        showSuccess('Saved', 'Your profile has been updated.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Update failed';
      setProfileError(msg);
      showError('Error', msg);
    } finally {
      setProfileLoading(false);
    }
  };

  /* ─── Team ─── */
  const fetchTeam = async () => {
    try {
      setTeamLoading(true);
      const res = await getAllUsers();
      if (res.success) setTeamUsers(res.data);
    } catch (e) { console.warn(e); }
    finally { setTeamLoading(false); }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await changeUserRole(userId, newRole);
      if (res.success) {
        setTeamUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
        showSuccess('Role Changed', `User role updated to ${newRole}`);
      }
    } catch (err) {
      showError('Error', err.response?.data?.message || 'Failed to change role');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Delete user "${userName}"? This cannot be undone.`)) return;
    try {
      const res = await deleteUser(userId);
      if (res.success) {
        setTeamUsers(prev => prev.filter(u => u._id !== userId));
        showSuccess('Deleted', `User "${userName}" has been removed.`);
      }
    } catch (err) {
      showError('Error', err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleInviteUser = async (e) => {
    e.preventDefault();
    setInviteError('');
    setInviteLoading(true);
    try {
      const res = await createUser(inviteForm);
      if (res.success) {
        setTeamUsers(prev => [res.data, ...prev]);
        setShowInvite(false);
        setInviteForm({ name: '', email: '', password: '', role: 'agent' });
        showSuccess('User Created', `"${res.data.name}" has been added to the team.`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create user';
      setInviteError(msg);
    } finally {
      setInviteLoading(false);
    }
  };

  /* ─── Security ─── */
  const fetchHistory = async () => {
    try {
      const res = await getLoginHistory();
      if (res.success) setLoginHistory(res.data);
    } catch (e) { console.warn(e); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError(''); setPwSuccess('');
    if (pwNew !== pwConfirm) { setPwError('New passwords do not match'); return; }
    try {
      const res = await changePassword(pwCurrent, pwNew);
      if (res.success) {
        setPwSuccess('Password updated successfully');
        setPwCurrent(''); setPwNew(''); setPwConfirm('');
      }
    } catch (err) { setPwError(err.response?.data?.message || 'Password update failed'); }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setEmailError(''); setEmailSuccess('');
    try {
      const res = await changeEmail(emailNew, emailPassword);
      if (res.success) {
        setEmailSuccess('Email address changed successfully');
        setEmailNew(''); setEmailPassword('');
      }
    } catch (err) { setEmailError(err.response?.data?.message || 'Email change failed'); }
  };

  const handlePolicySave = async (e) => {
    e.preventDefault();
    setPolicySuccess(false);
    try {
      const res = await updatePasswordPolicy({ minLength: policyMinLength, requireNumbers: policyNumbers, requireSpecialChars: policySpecial });
      if (res.success) setPolicySuccess(true);
    } catch (err) { console.error(err); }
  };

  /* ─── Data Management ─── */
  const fetchStats = async () => {
    try {
      const res = await getStats();
      if (res.success) setStats(res.data);
    } catch (e) { console.warn(e); }
  };

  const seedMockData = async () => {
    try {
      setSeeding(true); setSeedResult('Seeding CRM environment...');
      const c1 = await createCustomer({ name: 'Sarah Connor', email: 'sarah.c@cyberdyne.com', phone: '+1 555-800-1011', company: 'Cyberdyne Systems', status: 'active', notes: 'Defense Systems point-of-contact.' });
      const c2 = await createCustomer({ name: 'Bruce Wayne', email: 'bruce@waynecorp.com', phone: '+1 555-1939-0527', company: 'Wayne Enterprises', status: 'active', notes: 'Satellite logistics proposal interest.' });
      const c3 = await createCustomer({ name: 'Tony Stark', email: 'tony@starkindustries.com', phone: '+1 555-0808-1963', company: 'Stark Industries', status: 'prospect', notes: 'Exploring licensing models.' });
      await createLead({ name: 'Pepper Potts', email: 'pepper@starkindustries.com', phone: '+1 555-0808-1964', source: 'web', status: 'new', customerId: c3.data?._id });
      await createLead({ name: 'John Connor', email: 'john.c@cyberdyne.com', phone: '+1 555-800-1012', source: 'referral', status: 'contacted', customerId: c1.data?._id });
      if (c1.data) await createDeal({ title: 'Defense Systems Integration', value: 250000, stage: 'negotiation', customerId: c1.data._id, notes: 'Awaiting client security sign-off.' });
      if (c2.data) await createDeal({ title: 'Satellite Hardware Expansion', value: 85000, stage: 'proposal', customerId: c2.data._id, notes: 'Awaiting feedback from Gotham Towers.' });
      setSeedResult('Mock dataset seeded successfully!');
      await loadAllData(); fetchStats();
    } catch (err) { setSeedResult(`Failed: ${err.message}`); }
    finally { setSeeding(false); }
  };

  const triggerExport = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `smart-crm-export-${Date.now()}.json`; a.click();
    } catch (err) { showError('Export Failed', err.message); }
  };

  const triggerBackup = async () => {
    try {
      setBackupLoading(true);
      const data = await downloadBackup();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `smart-crm-backup-${new Date().toISOString().split('T')[0]}.json`; a.click();
    } catch (err) { showError('Backup Failed', err.message); }
    finally { setBackupLoading(false); }
  };

  const handleImportFile = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setImportError(null); setImportResult(null); setImportLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target.result);
        const bundle = json.data ? json.data : json;
        const res = await importData(bundle, importMode);
        if (res.success) { setImportResult(res.data); await loadAllData(); fetchStats(); }
      } catch (err) {
        setImportError(err.response?.data?.message || 'Invalid JSON format or import error');
      } finally { setImportLoading(false); }
    };
    reader.readAsText(file);
  };

  /* ─── SMTP ─── */
  const fetchSmtpSettings = async () => {
    try {
      setSmtpLoading(true); setSmtpError('');
      const res = await getSmtpSettings();
      if (res.success) setSmtpConfig(res.data);
    } catch (err) { setSmtpError(err.response?.data?.message || 'Failed to load SMTP settings'); }
    finally { setSmtpLoading(false); }
  };

  const handleSmtpChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSmtpConfig(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSmtpSave = async (e) => {
    e.preventDefault(); setSmtpSuccess(''); setSmtpError(''); setSmtpLoading(true);
    try {
      const res = await saveSmtpSettings(smtpConfig);
      if (res.success) { setSmtpSuccess('SMTP settings saved!'); setSmtpConfig(res.data); showSuccess('Saved', 'SMTP settings saved successfully!'); }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save';
      setSmtpError(msg); showError('Save Failed', msg);
    } finally { setSmtpLoading(false); }
  };

  const handleSendTestEmail = async (e) => {
    e.preventDefault(); setTestResult(''); setTestError(''); setTestLoading(true);
    try {
      const res = await testSmtpSettings(testEmail, smtpConfig);
      if (res.success) { setTestResult(res.message); showSuccess('Email Sent', res.message); }
    } catch (err) {
      const msg = err.response?.data?.message || 'Test failed';
      setTestError(msg); showError('Test Failed', msg);
    } finally { setTestLoading(false); }
  };

  /* ─── Tabs config ─── */
  const tabs = [
    { id: 'profile',  label: 'Profile',        icon: User },
    { id: 'team',     label: 'Team & Users',    icon: Users, adminOnly: true },
    { id: 'security', label: 'Security',        icon: Shield },
    { id: 'logs',     label: 'Activity Logs',   icon: History, adminOnly: true },
    { id: 'data',     label: 'Data Management', icon: Database, adminOnly: true },
    { id: 'smtp',     label: 'SMTP Settings',   icon: Mail, adminOnly: true },
  ].filter(t => !t.adminOnly || authUser?.role === 'admin' || authUser?.role === 'manager');

  const isAdmin = authUser?.role === 'admin';
  const userInitials = profile.name
    ? profile.name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <div className="space-y-6">
      {/* ── Tab Bar ── */}
      <div className="flex border-b th-border overflow-x-auto gap-1 whitespace-nowrap">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 pt-1 px-3 font-semibold text-sm transition-colors relative flex items-center gap-2 rounded-t-lg ${active ? 'th-text-primary' : 'th-text-secondary hover:th-text-primary'}`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
              {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-full" />}
            </button>
          );
        })}
      </div>

      {/* ──────────── PROFILE TAB ──────────── */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Avatar + identity card */}
          <div className="th-surface rounded-2xl p-6 flex flex-col items-center gap-4 text-center">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-extrabold text-white shrink-0 shadow-xl"
              style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa)' }}
            >
              {userInitials}
            </div>
            <div>
              <p className="font-bold text-lg th-text-primary">{profile.name || '—'}</p>
              <p className="text-xs th-text-muted mt-1">{profile.email}</p>
              <span className={`mt-2 inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${ROLE_COLORS[authUser?.role] || 'bg-slate-500/10 text-slate-400'}`}>
                <BadgeCheck className="w-3 h-3" /> {authUser?.role?.toUpperCase() || 'AGENT'}
              </span>
            </div>
            <div className="w-full border-t th-border pt-4 space-y-2 text-xs th-text-muted text-left">
              <div className="flex justify-between">
                <span>Department</span>
                <span className="th-text-primary font-semibold">{profile.department || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone</span>
                <span className="th-text-primary font-semibold">{profile.phone || 'Not set'}</span>
              </div>
            </div>
          </div>

          {/* Edit form */}
          <div className="lg:col-span-2 th-surface rounded-2xl p-6 space-y-5">
            <div>
              <h3 className="text-base font-bold th-text-primary">Edit Profile</h3>
              <p className="text-xs th-text-muted mt-1">Update your personal info synced to the CRM</p>
            </div>

            {profileSuccess && <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1"><Check className="w-3.5 h-3.5" />{profileSuccess}</p>}
            {profileError   && <p className="text-xs text-rose-500 font-semibold">{profileError}</p>}

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold th-text-secondary">Full Name</label>
                  <input className={inp} value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} placeholder="e.g. John Smith" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold th-text-secondary">Email Address <span className="th-text-muted">(read only)</span></label>
                  <input className={inp + ' opacity-60 cursor-not-allowed'} value={profile.email} readOnly />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold th-text-secondary">Phone Number</label>
                  <input className={inp} value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="e.g. +1 555-0100" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold th-text-secondary">Department</label>
                  <input className={inp} value={profile.department} onChange={e => setProfile(p => ({ ...p, department: e.target.value }))} placeholder="e.g. Sales, Engineering" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold th-text-secondary">Short Bio</label>
                  <textarea className={inp + ' resize-none'} rows={3} value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} placeholder="Tell the team a bit about yourself..." />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button type="submit" disabled={profileLoading} className={btn()}>
                  {profileLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────── TEAM & USERS TAB ──────────── */}
      {activeTab === 'team' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold th-text-primary">Team Members</h3>
              <p className="text-xs th-text-muted mt-0.5">{teamUsers.length} registered users in this CRM workspace</p>
            </div>
            {isAdmin && (
              <button onClick={() => setShowInvite(v => !v)} className={btn()}>
                <UserPlus className="w-4 h-4" /> Add User
              </button>
            )}
          </div>

          {/* Invite form */}
          {showInvite && (
            <div className="th-surface rounded-2xl p-6 space-y-4 border th-border animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold th-text-primary">Create New User</h4>
                <button onClick={() => setShowInvite(false)}><X className="w-4 h-4 th-text-muted" /></button>
              </div>
              {inviteError && <p className="text-xs text-rose-500 font-semibold">{inviteError}</p>}
              <form onSubmit={handleInviteUser} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold th-text-secondary">Full Name</label>
                  <input className={inp} value={inviteForm.name} onChange={e => setInviteForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Jane Smith" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold th-text-secondary">Email Address</label>
                  <input type="email" className={inp} value={inviteForm.email} onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))} placeholder="e.g. jane@company.com" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold th-text-secondary">Temporary Password</label>
                  <input type="password" className={inp} value={inviteForm.password} onChange={e => setInviteForm(f => ({ ...f, password: e.target.value }))} placeholder="Min 6 characters" required minLength={6} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold th-text-secondary">Role</label>
                  <select className={inp + ' cursor-pointer'} value={inviteForm.role} onChange={e => setInviteForm(f => ({ ...f, role: e.target.value }))}>
                    <option value="agent">Agent</option>
                    <option value="manager">Manager</option>
                    <option value="viewer">Viewer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="sm:col-span-2 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowInvite(false)} className={btn('outline')}>Cancel</button>
                  <button type="submit" disabled={inviteLoading} className={btn()}>
                    {inviteLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                    Create User
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Users table */}
          <div className="th-surface rounded-2xl overflow-hidden">
            {teamLoading ? (
              <div className="p-8 text-center th-text-muted text-sm">Loading team members...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b th-border" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                      <th className="px-5 py-3.5 text-xs font-bold th-text-muted uppercase tracking-wider">User</th>
                      <th className="px-5 py-3.5 text-xs font-bold th-text-muted uppercase tracking-wider">Email</th>
                      <th className="px-5 py-3.5 text-xs font-bold th-text-muted uppercase tracking-wider">Role</th>
                      <th className="px-5 py-3.5 text-xs font-bold th-text-muted uppercase tracking-wider">Joined</th>
                      {isAdmin && <th className="px-5 py-3.5 text-xs font-bold th-text-muted uppercase tracking-wider text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {teamUsers.map(u => {
                      const initials = u.name ? u.name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2) : '?';
                      const isSelf = u._id === authUser?._id;
                      return (
                        <tr key={u._id} className="border-b th-border last:border-0 hover:bg-slate-50/40 dark:hover:bg-slate-900/40 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa)' }}>
                                {initials}
                              </div>
                              <div>
                                <p className="font-semibold th-text-primary text-sm">{u.name} {isSelf && <span className="text-[10px] th-text-muted">(you)</span>}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 th-text-secondary text-xs">{u.email}</td>
                          <td className="px-5 py-4">
                            {isAdmin && !isSelf ? (
                              <select
                                value={u.role}
                                onChange={e => handleRoleChange(u._id, e.target.value)}
                                className="rounded-lg px-2 py-1 text-xs font-bold cursor-pointer border th-border th-input"
                              >
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="agent">Agent</option>
                                <option value="viewer">Viewer</option>
                              </select>
                            ) : (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${ROLE_COLORS[u.role] || ''}`}>
                                {u.role}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4 th-text-muted text-xs">{formatDate(u.createdAt)}</td>
                          {isAdmin && (
                            <td className="px-5 py-4 text-right">
                              {!isSelf ? (
                                <button
                                  onClick={() => handleDeleteUser(u._id, u.name)}
                                  className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400 transition-colors"
                                  title="Remove user"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              ) : (
                                <span className="text-[10px] th-text-muted">—</span>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                    {teamUsers.length === 0 && (
                      <tr><td colSpan={isAdmin ? 5 : 4} className="px-5 py-8 text-center th-text-muted text-xs">No users found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ──────────── SECURITY TAB ──────────── */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-2 space-y-6">
            {/* Change Password */}
            <div className="th-surface rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-600" />
                <h3 className="text-base font-bold th-text-primary">Change Password</h3>
              </div>
              {pwSuccess && <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1"><Check className="w-3.5 h-3.5" />{pwSuccess}</p>}
              {pwError   && <p className="text-xs text-rose-500 font-semibold">{pwError}</p>}
              <form onSubmit={handlePasswordChange} className="space-y-3 pt-1">
                <input type={pwShow ? 'text' : 'password'} placeholder="Current Password" required value={pwCurrent} onChange={e => setPwCurrent(e.target.value)} className={inp} />
                <input type={pwShow ? 'text' : 'password'} placeholder="New Password" required value={pwNew} onChange={e => setPwNew(e.target.value)} className={inp} />
                <div className="flex gap-2">
                  <input type={pwShow ? 'text' : 'password'} placeholder="Confirm New Password" required value={pwConfirm} onChange={e => setPwConfirm(e.target.value)} className={inp + ' flex-1'} />
                  <button type="button" onClick={() => setPwShow(!pwShow)} className="px-3 rounded-xl border th-border th-text-secondary bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    {pwShow ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button type="submit" className={btn()}>Update Password</button>
              </form>
            </div>

            {/* Change Email */}
            <div className="th-surface rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-600" />
                <h3 className="text-base font-bold th-text-primary">Change Email Address</h3>
              </div>
              {emailSuccess && <p className="text-xs text-emerald-500 font-semibold">{emailSuccess}</p>}
              {emailError   && <p className="text-xs text-rose-500 font-semibold">{emailError}</p>}
              <form onSubmit={handleEmailChange} className="space-y-3 pt-1">
                <input type="email" placeholder="New Email Address" required value={emailNew} onChange={e => setEmailNew(e.target.value)} className={inp} />
                <input type="password" placeholder="Confirm Account Password" required value={emailPassword} onChange={e => setEmailPassword(e.target.value)} className={inp} />
                <button type="submit" className={btn()}>Update Email</button>
              </form>
            </div>

            {/* Login History */}
            <div className="th-surface rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold th-text-primary">Recent Login History</h3>
              <p className="text-xs th-text-muted">Last 20 logins for security monitoring</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead><tr className="th-text-muted border-b th-border"><th className="py-2 pb-3">IP Address</th><th className="py-2 pb-3">Device</th><th className="py-2 pb-3 text-right">Date</th></tr></thead>
                  <tbody>
                    {loginHistory.map((lh, i) => (
                      <tr key={lh._id || i} className="th-text-secondary border-b th-border last:border-0 hover:bg-slate-50/30 dark:hover:bg-slate-900/30">
                        <td className="py-3 font-semibold th-text-primary">{lh.ip}</td>
                        <td className="py-3 max-w-[200px] truncate" title={lh.userAgent}>{lh.userAgent}</td>
                        <td className="py-3 text-right th-text-muted">{formatDate(lh.loginAt)}</td>
                      </tr>
                    ))}
                    {loginHistory.length === 0 && <tr><td colSpan="3" className="py-4 text-center th-text-muted">No history logged yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Password Policy */}
          <div className="th-surface rounded-2xl p-6 space-y-4 h-fit">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-bold th-text-primary uppercase tracking-wider">Password Policy</h3>
            </div>
            <p className="text-xs th-text-muted">Enforce security requirements for all workspace users.</p>
            {policySuccess && <p className="text-xs text-emerald-500 font-semibold">Policy saved</p>}
            <form onSubmit={handlePolicySave} className="space-y-4 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-semibold th-text-secondary block">Min Length</label>
                <input type="number" min="6" max="30" value={policyMinLength} onChange={e => setPolicyMinLength(parseInt(e.target.value))} className={inp} />
              </div>
              {[
                { label: 'Require Numbers', sub: '0–9 digits required', val: policyNumbers, set: setPolicyNumbers },
                { label: 'Require Special Chars', sub: 'e.g. @, #, $, *', val: policySpecial, set: setPolicySpecial },
              ].map(({ label, sub, val, set }) => (
                <label key={label} className="flex items-center justify-between p-3 rounded-xl border th-border cursor-pointer" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                  <div><p className="text-xs font-semibold th-text-primary">{label}</p><p className="text-[10px] th-text-muted">{sub}</p></div>
                  <input type="checkbox" checked={val} onChange={e => set(e.target.checked)} className="rounded text-brand-600 cursor-pointer" />
                </label>
              ))}
              <button type="submit" className={btn() + ' w-full'}>Save Policy</button>
            </form>
          </div>
        </div>
      )}

      {/* ──────────── ACTIVITY LOGS TAB ──────────── */}
      {activeTab === 'logs' && (
        <div className="th-surface rounded-2xl p-6 space-y-4 animate-fade-in">
          <div>
            <h3 className="text-base font-bold th-text-primary">CRM Audit Logs</h3>
            <p className="text-xs th-text-muted">Full timeline of tracked sales activities and communications</p>
          </div>
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead><tr className="th-text-muted border-b th-border"><th className="py-2 pb-3">Type</th><th className="py-2 pb-3">Description</th><th className="py-2 pb-3">Logged By</th><th className="py-2 pb-3 text-right">Date</th></tr></thead>
              <tbody>
                {activities.slice(0, 30).map((act, i) => (
                  <tr key={act._id || i} className="border-b th-border last:border-0 hover:bg-slate-50/40 dark:hover:bg-slate-900/40 th-text-secondary">
                    <td className="py-3">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${act.type === 'call' ? 'bg-sky-500/10 text-sky-500' : act.type === 'email' ? 'bg-amber-500/10 text-amber-500' : act.type === 'meeting' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-purple-500/10 text-purple-500'}`}>
                        {act.type}
                      </span>
                    </td>
                    <td className="py-3 font-semibold th-text-primary max-w-[300px] truncate" title={act.description}>{act.title || act.description}</td>
                    <td className="py-3">{act.performedBy || 'System'}</td>
                    <td className="py-3 text-right th-text-muted">{formatDate(act.performedAt)}</td>
                  </tr>
                ))}
                {activities.length === 0 && <tr><td colSpan="4" className="py-8 text-center th-text-muted">No audit logs yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ──────────── DATA MANAGEMENT TAB ──────────── */}
      {activeTab === 'data' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {/* Export */}
          <div className="th-surface rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold th-text-primary">Export CRM Records</h3>
            <p className="text-sm th-text-secondary leading-relaxed">Export all customers, deals, leads, and logs to a JSON bundle.</p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button onClick={triggerExport} className={btn()}><Download className="w-4 h-4" /> Export Dataset</button>
              <button onClick={triggerBackup} disabled={backupLoading} className={btn('outline')}>
                {backupLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />} Backup Bundle
              </button>
            </div>
          </div>

          {/* Import */}
          <div className="th-surface rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold th-text-primary">Import & Restore</h3>
            <p className="text-sm th-text-secondary">Upload a valid JSON database schema to restore data.</p>
            <div className="space-y-4 pt-2">
              <div className="flex gap-4">
                {['merge', 'replace'].map(mode => (
                  <label key={mode} className="flex items-center gap-2 text-xs th-text-secondary cursor-pointer">
                    <input type="radio" name="importMode" value={mode} checked={importMode === mode} onChange={() => setImportMode(mode)} className="text-brand-600" />
                    {mode === 'merge' ? 'Merge' : <span className="flex items-center gap-1 text-rose-500 font-semibold"><AlertTriangle className="w-3 h-3" />Overwrite</span>}
                  </label>
                ))}
              </div>
              <div className="relative border-2 border-dashed th-border rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-slate-50/20 dark:hover:bg-slate-900/30 transition-colors">
                <Upload className="w-8 h-8 th-text-muted mb-2" />
                <p className="text-xs th-text-secondary font-medium">Click to select or drag a backup JSON file</p>
                <input type="file" accept=".json" onChange={handleImportFile} disabled={importLoading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
              {importLoading && <div className="flex items-center gap-2 text-xs th-text-secondary"><RefreshCw className="w-4 h-4 animate-spin text-brand-600" /><span>Processing...</span></div>}
              {importError && <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">{importError}</div>}
              {importResult && (
                <div className="p-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 space-y-2">
                  <p className="text-xs text-emerald-500 font-bold flex items-center gap-1.5"><Check className="w-4 h-4" /> Imported Successfully</p>
                  <div className="grid grid-cols-4 gap-2 text-[10px] th-text-secondary font-semibold">
                    <div>Customers: {importResult.customers}</div><div>Leads: {importResult.leads}</div>
                    <div>Deals: {importResult.deals}</div><div>Activities: {importResult.activities}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Seed data */}
          <div className="th-surface rounded-2xl p-6 space-y-4 md:col-span-2">
            <h3 className="text-base font-bold th-text-primary">CRM Seeding Engine</h3>
            <p className="text-sm th-text-secondary">Seed a professional mock sales pipeline to populate charts and statistics for demo/testing.</p>
            <button onClick={seedMockData} disabled={seeding} className={btn() + ' min-w-48'}>
              {seeding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {seeding ? 'Seeding Environment...' : 'Seed Professional Dataset'}
            </button>
            {seedResult && <p className="text-xs italic py-2 px-3 rounded-xl" style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>{seedResult}</p>}
          </div>
        </div>
      )}

      {/* ──────────── SMTP TAB ──────────── */}
      {activeTab === 'smtp' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-2 th-surface rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold th-text-primary">SMTP Configuration</h3>
              <p className="text-xs th-text-muted mt-1">Configure credentials for outgoing system emails</p>
            </div>
            {smtpError   && <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">{smtpError}</div>}
            {smtpSuccess && <div className="p-3 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl font-semibold">{smtpSuccess}</div>}
            <form onSubmit={handleSmtpSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1"><label className="text-xs font-semibold th-text-secondary block">SMTP Host</label><input type="text" name="smtpHost" value={smtpConfig.smtpHost || ''} onChange={handleSmtpChange} placeholder="e.g. smtp.gmail.com" required className={inp} /></div>
                <div className="space-y-1"><label className="text-xs font-semibold th-text-secondary block">SMTP Port</label><input type="number" name="smtpPort" value={smtpConfig.smtpPort || ''} onChange={handleSmtpChange} placeholder="587 or 465" required className={inp} /></div>
                <div className="space-y-1"><label className="text-xs font-semibold th-text-secondary block">Username / Email</label><input type="text" name="smtpUser" value={smtpConfig.smtpUser || ''} onChange={handleSmtpChange} placeholder="user@gmail.com" required className={inp} /></div>
                <div className="space-y-1"><label className="text-xs font-semibold th-text-secondary block">Password / App Password</label><input type="password" name="smtpPassword" value={smtpConfig.smtpPassword || ''} onChange={handleSmtpChange} placeholder="Enter password" required className={inp} /></div>
                <div className="space-y-1 sm:col-span-2"><label className="text-xs font-semibold th-text-secondary block">From Address</label><input type="text" name="smtpFromEmail" value={smtpConfig.smtpFromEmail || ''} onChange={handleSmtpChange} placeholder="Smart CRM <noreply@smartcrm.com>" className={inp} /></div>
              </div>
              <label className="flex items-center justify-between p-3 rounded-xl border th-border" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                <div><p className="text-xs font-semibold th-text-primary">Use SSL/TLS</p><p className="text-[10px] th-text-muted">Enable secure TLS (required for port 465)</p></div>
                <input type="checkbox" name="smtpSecure" checked={smtpConfig.smtpSecure || false} onChange={handleSmtpChange} className="rounded text-brand-600 cursor-pointer" />
              </label>
              <div className="flex justify-end">
                <button type="submit" disabled={smtpLoading} className={btn()}>{smtpLoading && <RefreshCw className="w-4 h-4 animate-spin" />} Save Configuration</button>
              </div>
            </form>
          </div>

          <div className="th-surface rounded-2xl p-6 space-y-4 h-fit">
            <h3 className="text-sm font-bold th-text-primary uppercase tracking-wider">Test Integration</h3>
            <p className="text-xs th-text-muted">Send a test email to verify your SMTP configuration.</p>
            {testError  && <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">{testError}</div>}
            {testResult && <div className="p-3 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl font-medium">{testResult}</div>}
            <form onSubmit={handleSendTestEmail} className="space-y-4">
              <div className="space-y-1"><label className="text-xs font-semibold th-text-secondary block">Recipient Email</label><input type="email" value={testEmail} onChange={e => setTestEmail(e.target.value)} placeholder="receiver@domain.com" required className={inp} /></div>
              <button type="submit" disabled={testLoading} className={btn('outline') + ' w-full'}>
                {testLoading ? <><RefreshCw className="w-4 h-4 animate-spin" /><span>Sending...</span></> : 'Send Test Email'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
