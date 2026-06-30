import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { TrendingUp, Mail, Lock, User, ArrowLeft, Loader2, AlertCircle, Sun, Moon, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { login, register, setCurrentPage, isDark, toggleTheme } = useCRM();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (isSignUp && !name.trim()) return setLocalError('Please enter your name.');
    if (!email.trim() || !password.trim()) return setLocalError('Email and password are required.');
    if (password.length < 6) return setLocalError('Password must be at least 6 characters.');

    try {
      setLocalLoading(true);
      if (isSignUp) await register(name, email, password);
      else await login(email, password);
    } catch (err) {
      setLocalError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  const inputBase = "w-full pl-10 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-150 th-input";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      {/* Top controls */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage('landing')}
          className="flex items-center gap-1.5 text-sm font-medium transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border transition-colors"
          style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-brand-600" />}
        </button>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-[400px] th-surface rounded-2xl p-8 shadow-xl">
        {/* Brand */}
        <div className="flex flex-col items-center mb-7">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/20 mb-3">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {isSignUp ? 'Create an Account' : 'Sign In'}
          </h2>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {isSignUp ? 'Welcome to Smart CRM — let\'s get you set up' : 'Welcome back to Smart CRM'}
          </p>
        </div>

        {/* Error */}
        {localError && (
          <div
            className="mb-5 p-3.5 rounded-xl flex gap-3 items-start text-sm"
            style={{ backgroundColor: '#ef444415', border: '1px solid #ef444430', color: '#ef4444' }}
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{localError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name — sign up only */}
          {isSignUp && (
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3.5" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Full Name"
                required
                className={inputBase + ' pr-4'}
              />
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-3.5" style={{ color: 'var(--text-muted)' }} />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className={inputBase + ' pr-4'}
            />
          </div>

          {/* Password with show/hide toggle */}
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-3.5" style={{ color: 'var(--text-muted)' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
              className={inputBase + ' pr-10'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-3.5 transition-colors"
              style={{ color: 'var(--text-muted)' }}
              tabIndex={-1}
              title={showPassword ? 'Hide password' : 'Show password'}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              {showPassword
                ? <EyeOff className="w-4 h-4" />
                : <Eye className="w-4 h-4" />
              }
            </button>
          </div>

          <button
            type="submit"
            disabled={localLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-lg shadow-brand-600/10 disabled:opacity-50 disabled:pointer-events-none transition-all mt-1"
          >
            {localLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Processing...</>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        {/* Toggle sign-up / sign-in */}
        <p className="text-center text-sm mt-5" style={{ color: 'var(--text-muted)' }}>
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button
            onClick={() => { setIsSignUp(v => !v); setLocalError(null); setShowPassword(false); }}
            className="font-semibold focus:outline-none"
            style={{ color: 'var(--accent)' }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
