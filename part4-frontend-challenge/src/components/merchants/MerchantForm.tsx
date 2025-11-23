import React, { useState, useEffect } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Merchant, MerchantFormData, ValidationErrors } from '../../types/merchant';
import './MerchantForm.css';

interface MerchantFormProps {
  merchant?: Merchant;
  onSubmit: (data: MerchantFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const MerchantForm: React.FC<MerchantFormProps> = ({
  merchant,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState<MerchantFormData>({
    merchantName: merchant?.merchantName || '',
    businessType: merchant?.businessType || '',
    websiteUrl: merchant?.websiteUrl || '',
    contactEmail: merchant?.contactEmail || '',
    contactPhone: merchant?.contactPhone || '',
    registrationNumber: merchant?.registrationNumber || '',
    country: merchant?.country || '',
    addressLine1: merchant?.addressLine1 || '',
    addressLine2: merchant?.addressLine2 || '',
    city: merchant?.city || '',
    state: merchant?.state || '',
    postalCode: merchant?.postalCode || '',
    settlementCycle: merchant?.settlementCycle || '',
    payoutAccountNumber: merchant?.payoutAccountNumber || '',
    payoutBankName: merchant?.payoutBankName || '',
    payoutBankCountry: merchant?.payoutBankCountry || '',
    dailyTxnLimit: merchant?.dailyTxnLimit || 0,
    monthlyTxnLimit: merchant?.monthlyTxnLimit || 0
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  useEffect(() => {
    if (merchant) {
      setFormData({
        merchantName: merchant.merchantName,
        businessType: merchant.businessType,
        websiteUrl: merchant.websiteUrl,
        contactEmail: merchant.contactEmail,
        contactPhone: merchant.contactPhone,
        registrationNumber: merchant.registrationNumber,
        country: merchant.country,
        addressLine1: merchant.addressLine1,
        addressLine2: merchant.addressLine2,
        city: merchant.city,
        state: merchant.state,
        postalCode: merchant.postalCode,
        settlementCycle: merchant.settlementCycle || '',
        payoutAccountNumber: merchant.payoutAccountNumber || '',
        payoutBankName: merchant.payoutBankName || '',
        payoutBankCountry: merchant.payoutBankCountry || '',
        dailyTxnLimit: merchant.dailyTxnLimit || 0,
        monthlyTxnLimit: merchant.monthlyTxnLimit || 0
      });
    }
  }, [merchant]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.merchantName.trim()) {
      newErrors.merchantName = 'Merchant name is required';
    }

    if (!merchant && !formData.businessType.trim()) {
      newErrors.businessType = 'Business type is required';
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Invalid email format';
    }

    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = 'Contact phone is required';
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.contactPhone)) {
      newErrors.contactPhone = 'Invalid phone format';
    }

    if (!merchant) {
      if (!formData.addressLine1.trim()) {
        newErrors.addressLine1 = 'Address is required';
      }

      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }

      if (!formData.country.trim()) {
        newErrors.country = 'Country is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (merchant && !showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    try {
      setApiError('');
      await onSubmit(formData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setApiError(errorMessage);
    }
  };

  const handleFieldChange = (field: keyof MerchantFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleConfirmationCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="merchant-form-modal">
      <div className="merchant-form-overlay" onClick={onCancel}></div>
      <div className="merchant-form-content">
        <h2>{merchant ? 'Edit Merchant' : 'Add New Merchant'}</h2>
        
        {apiError && (
          <div className="api-error-message">
            {apiError}
          </div>
        )}
        
        {showConfirmation ? (
          <div className="confirmation-dialog">
            <p>Are you sure you want to update this merchant?</p>
            <div className="confirmation-actions">
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Confirm'}
              </Button>
              <Button onClick={handleConfirmationCancel} variant="secondary" disabled={isSubmitting}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Input
              label="Merchant Name"
              value={formData.merchantName}
              onChange={(e) => handleFieldChange('merchantName', e.target.value)}
              error={errors.merchantName}
              required
              disabled={isSubmitting}
            />
            
            <Input
              label="Business Type"
              value={formData.businessType}
              onChange={(e) => handleFieldChange('businessType', e.target.value)}
              error={errors.businessType}
              required={!merchant}
              disabled={isSubmitting || !!merchant}
            />
            
            <Input
              label="Website URL"
              type="url"
              value={formData.websiteUrl}
              onChange={(e) => handleFieldChange('websiteUrl', e.target.value)}
              error={errors.websiteUrl}
              disabled={isSubmitting}
            />
            
            <Input
              label="Contact Email"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleFieldChange('contactEmail', e.target.value)}
              error={errors.contactEmail}
              required
              disabled={isSubmitting}
            />
            
            <Input
              label="Contact Phone"
              value={formData.contactPhone}
              onChange={(e) => handleFieldChange('contactPhone', e.target.value)}
              error={errors.contactPhone}
              required
              disabled={isSubmitting}
            />
            
            <Input
              label="Registration Number"
              value={formData.registrationNumber}
              onChange={(e) => handleFieldChange('registrationNumber', e.target.value)}
              error={errors.registrationNumber}
              disabled={isSubmitting}
            />
            
            <Input
              label="Address Line 1"
              value={formData.addressLine1}
              onChange={(e) => handleFieldChange('addressLine1', e.target.value)}
              error={errors.addressLine1}
              required={!merchant}
              disabled={isSubmitting}
            />
            
            <Input
              label="Address Line 2"
              value={formData.addressLine2}
              onChange={(e) => handleFieldChange('addressLine2', e.target.value)}
              error={errors.addressLine2}
              disabled={isSubmitting}
            />
            
            <Input
              label="City"
              value={formData.city}
              onChange={(e) => handleFieldChange('city', e.target.value)}
              error={errors.city}
              required={!merchant}
              disabled={isSubmitting}
            />
            
            <Input
              label="State"
              value={formData.state}
              onChange={(e) => handleFieldChange('state', e.target.value)}
              error={errors.state}
              disabled={isSubmitting}
            />
            
            <Input
              label="Postal Code"
              value={formData.postalCode}
              onChange={(e) => handleFieldChange('postalCode', e.target.value)}
              error={errors.postalCode}
              disabled={isSubmitting}
            />
            
            <Input
              label="Country"
              value={formData.country}
              onChange={(e) => handleFieldChange('country', e.target.value)}
              error={errors.country}
              required={!merchant}
              disabled={isSubmitting}
            />
            
            {merchant && (
              <>
                <Input
                  label="Settlement Cycle"
                  value={formData.settlementCycle}
                  onChange={(e) => handleFieldChange('settlementCycle', e.target.value)}
                  error={errors.settlementCycle}
                  disabled={isSubmitting}
                  placeholder="e.g., daily, weekly, monthly"
                />
                
                <Input
                  label="Payout Account Number"
                  value={formData.payoutAccountNumber}
                  onChange={(e) => handleFieldChange('payoutAccountNumber', e.target.value)}
                  error={errors.payoutAccountNumber}
                  disabled={isSubmitting}
                />
                
                <Input
                  label="Payout Bank Name"
                  value={formData.payoutBankName}
                  onChange={(e) => handleFieldChange('payoutBankName', e.target.value)}
                  error={errors.payoutBankName}
                  disabled={isSubmitting}
                />
                
                <Input
                  label="Payout Bank Country"
                  value={formData.payoutBankCountry}
                  onChange={(e) => handleFieldChange('payoutBankCountry', e.target.value)}
                  error={errors.payoutBankCountry}
                  disabled={isSubmitting}
                />
                
                <Input
                  label="Daily Transaction Limit"
                  type="number"
                  value={formData.dailyTxnLimit.toString()}
                  onChange={(e) => handleFieldChange('dailyTxnLimit', e.target.value)}
                  error={errors.dailyTxnLimit}
                  disabled={isSubmitting}
                />
                
                <Input
                  label="Monthly Transaction Limit"
                  type="number"
                  value={formData.monthlyTxnLimit.toString()}
                  onChange={(e) => handleFieldChange('monthlyTxnLimit', e.target.value)}
                  error={errors.monthlyTxnLimit}
                  disabled={isSubmitting}
                />
              </>
            )}

            <div className="form-actions">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : merchant ? 'Update' : 'Create'}
              </Button>
              <Button type="button" onClick={onCancel} variant="secondary" disabled={isSubmitting}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
