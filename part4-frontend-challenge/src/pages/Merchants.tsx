import { useState } from 'react';
import { MerchantList } from '../components/merchants/MerchantList';
import { MerchantForm } from '../components/merchants/MerchantForm';
import { Button } from '../components/common/Button';
import { Merchant, MerchantFormData } from '../types/merchant';
import { createMerchant, updateMerchant } from '../services/merchantService';
import './Merchants.css';

export const Merchants = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingMerchant, setEditingMerchant] = useState<Merchant | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddMerchant = () => {
    setEditingMerchant(undefined);
    setShowForm(true);
  };

  const handleEditMerchant = (merchant: Merchant) => {
    setEditingMerchant(merchant);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMerchant(undefined);
  };

  const handleCreateSubmit = async (formData: MerchantFormData) => {
    setIsSubmitting(true);
    try {
      const createRequest = {
        merchantName: formData.merchantName,
        businessType: formData.businessType,
        websiteUrl: formData.websiteUrl,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        registrationNumber: formData.registrationNumber,
        country: formData.country,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
      };

      const response = await createMerchant(createRequest);
      
      setNotification({
        type: 'success',
        message: `Merchant created successfully! Merchant Code: ${response.merchantCode}`,
      });
      
      setShowForm(false);
      setEditingMerchant(undefined);
      setRefreshTrigger(prev => prev + 1);
      
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create merchant';
      setNotification({
        type: 'error',
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubmit = async (formData: MerchantFormData) => {
    if (!editingMerchant) return;
    
    setIsSubmitting(true);
    try {
      const updateRequest = {
        merchantName: formData.merchantName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        settlementCycle: formData.settlementCycle,
        payoutAccountNumber: formData.payoutAccountNumber,
        payoutBankName: formData.payoutBankName,
        payoutBankCountry: formData.payoutBankCountry,
        dailyTxnLimit: formData.dailyTxnLimit,
        monthlyTxnLimit: formData.monthlyTxnLimit
      };

      const response = await updateMerchant(editingMerchant.merchantId, updateRequest);
      
      setNotification({
        type: 'success',
        message: response.message || 'Merchant updated successfully!',
      });
      
      setShowForm(false);
      setEditingMerchant(undefined);
      setRefreshTrigger(prev => prev + 1);
      
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update merchant';
      setNotification({
        type: 'error',
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (formData: MerchantFormData) => {
    if (editingMerchant) {
      await handleUpdateSubmit(formData);
    } else {
      await handleCreateSubmit(formData);
    }
  };

  return (
    <main className="container">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1>Merchant Management</h1>
            <p className="page-subtitle">View and manage merchant accounts</p>
          </div>
          <Button onClick={handleAddMerchant} variant="primary">
            Add Merchant
          </Button>
        </div>
      </div>
      
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}
      
      <MerchantList 
        onEditMerchant={handleEditMerchant}
        refreshTrigger={refreshTrigger}
      />
      
      {showForm && (
        <MerchantForm
          merchant={editingMerchant}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseForm}
          isSubmitting={isSubmitting}
        />
      )}
    </main>
  );
};
