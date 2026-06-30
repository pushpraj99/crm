import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import CustomerDetail from '../components/customers/CustomerDetail';
import CustomerForm from '../components/customers/CustomerForm';

const CustomerDetails = () => {
  const { selectedCustomerId, setCurrentPage, deleteCustomer, updateCustomer } = useCRM();
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  if (!selectedCustomerId) {
    setCurrentPage('customers');
    return null;
  }

  const handleBack = () => {
    setCurrentPage('customers');
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this customer and all associated deals/activities?')) {
      try {
        await deleteCustomer(id);
        setCurrentPage('customers');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      await updateCustomer(selectedCustomerId, data);
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <CustomerDetail
        customerId={selectedCustomerId}
        onBack={handleBack}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showForm && (
        <CustomerForm
          customer={editingCustomer}
          onSubmit={handleFormSubmit}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default CustomerDetails;
