import React, { useState } from 'react';
import { useLeads } from '../hooks/useLeads';
import LeadList from '../components/leads/LeadList';
import LeadForm from '../components/leads/LeadForm';
import { confirmAction } from '../utils/alerts';

const Leads = () => {
  const { createLead, updateLead, deleteLead } = useLeads();
  const [showForm, setShowForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const handleOpenAdd = () => {
    setSelectedLead(null);
    setShowForm(true);
  };

  const handleOpenEdit = (lead) => {
    setSelectedLead(lead);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmAction(
      'Delete Lead?',
      'Are you sure you want to permanently delete this lead?',
      'Yes, delete'
    );
    if (confirmed) {
      try {
        await deleteLead(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (selectedLead) {
        await updateLead(selectedLead._id, data);
      } else {
        await createLead(data);
      }
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <LeadList 
        onAddLead={handleOpenAdd} 
        onEditLead={handleOpenEdit} 
        onDeleteLead={handleDelete} 
      />

      {showForm && (
        <LeadForm 
          lead={selectedLead} 
          onSubmit={handleFormSubmit} 
          onClose={() => setShowForm(false)} 
        />
      )}
    </div>
  );
};

export default Leads;
