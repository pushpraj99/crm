import React from 'react';
import { useCRM } from '../context/CRMContext';
import { TrendingUp, Users, Target, Briefcase, Activity, ArrowRight, Shield, BarChart3, Sun, Moon } from 'lucide-react';

const Landing = () => {
  const { setCurrentPage, isDark, toggleTheme } = useCRM();

  const features = [
    { icon: Target,    title: 'Lead Management',        description: 'Capture, score, and advance leads through custom pipeline stages.' },
    { icon: Users,     title: '360° Customer Profiles', description: 'Centralize contacts, history, tags, and notes in one clean view.' },
    { icon: Briefcase, title: 'Pipeline Tracking',      description: 'Monitor deals, closing probabilities, and revenue forecasts live.' },
    { icon: Activity,  title: 'Activity Logs',          description: 'Automatically record calls, emails, and meetings across your team.' },
  ];

  const stats = [
    { value: '3.2×',  label: 'Faster deal cycles' },
    { value: '99.9%', label: 'System uptime' },
    { value: '10K+',  label: 'Customer records' },
    { value: '4.9★',  label: 'User satisfaction' },
  ];

  return (
    <div
      className="min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-brand-500 selection:text-white"
      style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      {/* ── Navbar ── */}
      <header
        className="fixed top-0 w-full z-50 h-16 flex items-center justify-between px-6 md:px-10 border-b"
        style={{
          background: 'var(--navbar-bg)',
          borderColor: 'var(--border)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-sm">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
            Smart <span style={{ color: 'var(--accent)' }}>CRM</span>
          </span>
        </div>

        <nav className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border transition-colors"
            style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            title={isDark ? 'Light Mode' : 'Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-brand-600" />}
          </button>
          <button
            onClick={() => setCurrentPage('login')}
            className="text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            Sign In
          </button>
          <button
            onClick={() => setCurrentPage('login')}
            className="text-sm font-semibold px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-sm transition-colors"
          >
            Get Started
          </button>
        </nav>
      </header>

      <main className="flex-1 pt-16">
        {/* ── Hero ── */}
        <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6" style={{ color: 'var(--text-primary)' }}>
            Manage relationships. <br className="hidden md:inline" />
            <span style={{ color: 'var(--accent)' }}>Close more deals.</span>
          </h1>

          <p className="text-lg max-w-xl mx-auto mb-10" style={{ color: 'var(--text-secondary)' }}>
            A professional CRM workspace to centralize operations, engage leads, automate activity tracking, and visualize your pipeline.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setCurrentPage('login')}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl shadow-lg shadow-brand-600/15 transition-all duration-200 hover:-translate-y-0.5"
            >
              Start for Free <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* ── Stats Strip ── */}
        <section className="border-y py-10" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}>
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="text-3xl font-bold mb-1" style={{ color: 'var(--accent)' }}>{s.value}</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              Everything your sales team needs
            </h2>
            <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
              Smart CRM unifies your customer data, leads, and deal flow into one powerful workspace.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="th-surface rounded-2xl p-6 group hover:-translate-y-1 transition-transform duration-200"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors"
                    style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="py-16 px-6" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <div
            className="max-w-3xl mx-auto rounded-2xl p-10 md:p-14 text-center border"
            style={{ borderColor: 'var(--border)', background: 'linear-gradient(135deg, var(--bg-elevated), var(--accent-soft))' }}
          >
            <Shield className="w-10 h-10 mx-auto mb-4" style={{ color: 'var(--accent)' }} />
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Ready to grow smarter?</h2>
            <p className="mb-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Start building customer relationships, logging deals, and tracking your pipeline in seconds.
            </p>
            <button
              onClick={() => setCurrentPage('login')}
              className="px-8 py-3 font-bold rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-lg transition-colors"
            >
              Create Free Account
            </button>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t py-8 px-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-brand-600 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Smart CRM</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Smart CRM. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
