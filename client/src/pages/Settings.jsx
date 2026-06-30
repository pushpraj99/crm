import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Server, Database, Sparkles, RefreshCw } from 'lucide-react';

const Settings = () => {
  const { createCustomer, createLead, createDeal, logActivity, loadAllData } = useCRM();
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState('');

  const seedMockData = async () => {
    try {
      setSeeding(true);
      setSeedResult('Seeding started...');

      setSeedResult('Adding mock customers...');
      const customer1 = await createCustomer({
        name: 'Sarah Connor',
        email: 'sarah.c@cyberdyne.com',
        phone: '+1 555-800-1011',
        company: 'Cyberdyne Systems',
        status: 'active',
        tags: ['enterprise', 'vip', 'tech'],
        notes: 'Main point of contact for the defense systems integration deal.'
      });

      const customer2 = await createCustomer({
        name: 'Bruce Wayne',
        email: 'bruce@waynecorp.com',
        phone: '+1 555-1939-0527',
        company: 'Wayne Enterprises',
        status: 'active',
        tags: ['vip', 'manufacturing'],
        notes: 'Expressed interest in expanding satellite logistics hardware.'
      });

      const customer3 = await createCustomer({
        name: 'Tony Stark',
        email: 'tony@starkindustries.com',
        phone: '+1 555-0808-1963',
        company: 'Stark Industries',
        status: 'prospect',
        tags: ['tech', 'energy'],
        notes: 'Exploring high-density power core licensing models.'
      });

      setSeedResult('Adding mock leads...');
      await createLead({
        name: 'John Connor',
        email: 'john.c@cyberdyne.com',
        phone: '+1 555-800-1012',
        source: 'referral',
        status: 'contacted',
        assignedTo: 'Agent Smith',
        customerId: customer1.data?._id || null
      });

      await createLead({
        name: 'Pepper Potts',
        email: 'pepper@starkindustries.com',
        phone: '+1 555-0808-1964',
        source: 'web',
        status: 'new',
        assignedTo: 'Agent Jones',
        customerId: customer3.data?._id || null
      });

      setSeedResult('Adding mock deals...');
      if (customer1.data) {
        await createDeal({
          title: 'Defense Systems Integration',
          value: 250000,
          stage: 'negotiation',
          customerId: customer1.data._id,
          expectedCloseDate: '2026-12-15',
          notes: 'Contract draft sent. Reviewing security protocols.'
        });
      }

      if (customer2.data) {
        await createDeal({
          title: 'Satellite Hardware Expansion',
          value: 85000,
          stage: 'proposal',
          customerId: customer2.data._id,
          expectedCloseDate: '2026-09-30',
          notes: 'Initial proposal pitched. Awaiting feedback from Gotham HQ.'
        });

        await createDeal({
          title: 'Nano-alloy Supply Renewal',
          value: 45000,
          stage: 'closed-won',
          customerId: customer2.data._id,
          expectedCloseDate: '2026-05-10',
          notes: 'Deal closed successfully. Project team deployed.'
        });
      }

      setSeedResult('Logging activities...');
      if (customer1.data) {
        await logActivity({
          type: 'call',
          description: 'Discussed cybersecurity validation checklist',
          customerId: customer1.data._id,
          performedBy: 'Agent Smith'
        });
      }

      if (customer2.data) {
        await logActivity({
          type: 'meeting',
          description: 'Presented satellite logistics slide deck in Gotham Tower',
          customerId: customer2.data._id,
          performedBy: 'Admin User'
        });
      }

      setSeedResult('Mock data seeded successfully!');
      await loadAllData();
    } catch (err) {
      console.error(err);
      setSeedResult(`Error seeding data: ${err.message || 'Check database connection'}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* API connection details */}
        <div className="glass rounded-2xl p-6 border border-slate-800/80 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-brand-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">API Connection</h3>
              <p className="text-xs text-slate-500">Express server endpoint details</p>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-sm">
            <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-xs">VITE_API_BASE_URL</span>
              <code className="text-xs font-mono text-brand-400">
                {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}
              </code>
            </div>
            <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-xs">Database Mode</span>
              <span className="text-xs font-semibold text-slate-200">
                MongoDB Memory / Cloud Atlas
              </span>
            </div>
          </div>
        </div>

        {/* Database administration */}
        <div className="glass rounded-2xl p-6 border border-slate-800/80 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-brand-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Database Admin</h3>
              <p className="text-xs text-slate-500">Seed sample dataset or clean database</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={seedMockData}
              disabled={seeding}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold text-sm transition-colors shadow-lg shadow-brand-600/15"
            >
              {seeding ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {seeding ? 'Seeding Data...' : 'Seed Mock Dataset'}
            </button>
            
            {seedResult && (
              <p className="text-xs text-center text-slate-400 italic bg-slate-950/30 py-2 rounded-lg border border-slate-800">
                {seedResult}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
