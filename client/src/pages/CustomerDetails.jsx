import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import CustomerDetail from '../components/customers/CustomerDetail';
import CustomerForm from '../components/customers/CustomerForm';
import { confirmAction } from '../utils/alerts';

const CustomerDetails = () => {
  const { selectedCustomerId, setCurrentPage, deleteCustomer, updateCustomer } = useCRM();
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

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
    const confirmed = await confirmAction(
      'Delete Customer?',
      'Are you sure you want to permanently delete this customer and all associated deals/activities?',
      'Yes, delete'
    );
    if (confirmed) {
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
      setRefreshKey(prev => prev + 1); // Trigger refetch in CustomerDetail
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <CustomerDetail
        key={`${selectedCustomerId}-${refreshKey}`}
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
