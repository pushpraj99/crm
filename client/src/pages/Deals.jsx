import React, { useState } from 'react';
import { useDeals } from '../hooks/useDeals';
import DealList from '../components/deals/DealList';
import DealForm from '../components/deals/DealForm';

const Deals = () => {
  const { createDeal, updateDeal, deleteDeal } = useDeals();
  const [showForm, setShowForm] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

  const handleOpenAdd = () => {
    setSelectedDeal(null);
    setShowForm(true);
  };

  const handleOpenEdit = (deal) => {
    setSelectedDeal(deal);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this deal?')) {
      try {
        await deleteDeal(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (selectedDeal) {
        await updateDeal(selectedDeal._id, data);
      } else {
        await createDeal(data);
      }
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <DealList 
        onAddDeal={handleOpenAdd} 
        onEditDeal={handleOpenEdit} 
        onDeleteDeal={handleDelete} 
      />

      {showForm && (
        <DealForm 
          deal={selectedDeal} 
          onSubmit={handleFormSubmit} 
          onClose={() => setShowForm(false)} 
        />
      )}
    </div>
  );
};

export default Deals;
