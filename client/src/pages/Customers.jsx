import React, { useState } from 'react';
import { useCustomers } from '../hooks/useCustomers';
import CustomerList from '../components/customers/CustomerList';
import CustomerForm from '../components/customers/CustomerForm';

const Customers = () => {
  const { createCustomer, updateCustomer } = useCustomers();
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleOpenAdd = () => {
    setSelectedCustomer(null);
    setShowForm(true);
  };

  const handleOpenEdit = (customer) => {
    setSelectedCustomer(customer);
    setShowForm(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      if (selectedCustomer) {
        await updateCustomer(selectedCustomer._id, data);
      } else {
        await createCustomer(data);
      }
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <CustomerList 
        onAddCustomer={handleOpenAdd} 
        onEditCustomer={handleOpenEdit} 
      />

      {showForm && (
        <CustomerForm 
          customer={selectedCustomer} 
          onSubmit={handleFormSubmit} 
          onClose={() => setShowForm(false)} 
        />
      )}
    </div>
  );
};

export default Customers;
