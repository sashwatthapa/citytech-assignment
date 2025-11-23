import React from 'react';
import { Merchant } from '../../types/merchant';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import './MerchantCard.css';

interface MerchantCardProps {
  merchant: Merchant;
  onEdit: (merchant: Merchant) => void;
}

export const MerchantCard: React.FC<MerchantCardProps> = ({ merchant, onEdit }) => {
  const getStatusBadgeClass = (status: string) => {
    return `status-badge status-${status}`;
  };

  return (
    <Card className="merchant-card">
      <div className="merchant-card-header">
        <h3>{merchant.merchantName}</h3>
        <span className={getStatusBadgeClass(merchant.status)}>
          {merchant.status}
        </span>
      </div>
      
      <div className="merchant-card-body">
        <div className="merchant-info-row">
          <span className="label">Merchant Code:</span>
          <span className="value">{merchant.merchantCode}</span>
        </div>
        
        <div className="merchant-info-row">
          <span className="label">Business Type:</span>
          <span className="value">{merchant.businessType}</span>
        </div>
        
        <div className="merchant-info-row">
          <span className="label">Email:</span>
          <span className="value">{merchant.contactEmail}</span>
        </div>
        
        <div className="merchant-info-row">
          <span className="label">Phone:</span>
          <span className="value">{merchant.contactPhone}</span>
        </div>
        
        {merchant.websiteUrl && (
          <div className="merchant-info-row">
            <span className="label">Website:</span>
            <span className="value">
              <a href={merchant.websiteUrl} target="_blank" rel="noopener noreferrer">
                {merchant.websiteUrl}
              </a>
            </span>
          </div>
        )}
        
        <div className="merchant-info-row">
          <span className="label">Location:</span>
          <span className="value">
            {merchant.city}, {merchant.state}, {merchant.country}
          </span>
        </div>
      </div>
      
      <div className="merchant-card-footer">
        <Button onClick={() => onEdit(merchant)} variant="primary">
          Edit
        </Button>
      </div>
    </Card>
  );
};
