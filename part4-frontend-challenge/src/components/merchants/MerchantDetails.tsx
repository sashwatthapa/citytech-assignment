import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMerchantById, getMerchantStatistics, getMerchantActivities, exportMerchantTransactions } from '../../services/merchantService';
import { getTransactions } from '../../services/transactionService';
import { Merchant, MerchantStatistics, MerchantActivity } from '../../types/merchant';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { TransactionList } from '../transaction/TransactionList';
import './MerchantDetails.css';

export const MerchantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [statistics, setStatistics] = useState<MerchantStatistics | null>(null);
  const [activities, setActivities] = useState<MerchantActivity[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    const fetchMerchantDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const [merchantData, statsData, activitiesData, transactionsResponse] = await Promise.all([
          getMerchantById(Number(id)),
          getMerchantStatistics(Number(id)),
          getMerchantActivities(Number(id), 0, 10),
          getTransactions(id, { page: 0, size: 10, startDate: '', endDate: '' })
        ]);
        
        setMerchant(merchantData);
        setStatistics(statsData);
        setActivities(activitiesData.activities);
        setTransactions(transactionsResponse?.data?.transactions || []);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching merchant details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMerchantDetails();
  }, [id]);

  const handleExport = async () => {
    if (!id) return;
    
    try {
      setExportLoading(true);
      const blob = await exportMerchantTransactions(Number(id));
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `merchant-${id}-transactions.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting transactions:', err);
      alert('Export functionality not yet available - API endpoint pending');
    } finally {
      setExportLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/merchants');
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error">Error: {error.message}</div>;
  if (!merchant) return <div>Merchant not found</div>;

  return (
    <div className="merchant-details">
      <div className="merchant-details-header">
        <Button onClick={handleBack} variant="secondary">← Back to Merchants</Button>
        <h1>{merchant.merchantName}</h1>
        <span className={`status-badge status-${merchant.status}`}>{merchant.status}</span>
      </div>

      {/* Overview Cards */}
      <div className="overview-cards">
        <Card className="info-card">
          <h3>Basic Information</h3>
          <div className="info-grid">
            <div className="info-row">
              <span className="label">Merchant Code</span>
              <span className="value">{merchant.merchantCode}</span>
            </div>
            <div className="info-row">
              <span className="label">Business Type</span>
              <span className="value" style={{ textTransform: 'capitalize' }}>{merchant.businessType}</span>
            </div>
            <div className="info-row">
              <span className="label">Risk Level</span>
              <span className="value" style={{ textTransform: 'capitalize' }}>
                {merchant.riskLevel || 'Not set'}
              </span>
            </div>
          </div>
        </Card>

        <Card className="info-card">
          <h3>Contact Information</h3>
          <div className="info-grid">
            <div className="info-row">
              <span className="label">Email</span>
              <span className="value">{merchant.contactEmail}</span>
            </div>
            <div className="info-row">
              <span className="label">Phone</span>
              <span className="value">{merchant.contactPhone}</span>
            </div>
            <div className="info-row">
              <span className="label">Website</span>
              <span className="value">
                <a href={merchant.websiteUrl} target="_blank" rel="noopener noreferrer">
                  {merchant.websiteUrl}
                </a>
              </span>
            </div>
          </div>
        </Card>

        <Card className="info-card">
          <h3>Location</h3>
          <div className="info-grid">
            <div className="info-row">
              <span className="label">Address</span>
              <span className="value">{merchant.addressLine1}</span>
            </div>
            <div className="info-row">
              <span className="label">City, State</span>
              <span className="value">{merchant.city}, {merchant.state}</span>
            </div>
            <div className="info-row">
              <span className="label">Country</span>
              <span className="value">{merchant.country}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Financial Information */}
      <div className="financial-section">
        <Card className="financial-card">
          <h3>Settlement & Payout</h3>
          <div className="financial-grid">
            <div className="financial-item">
              <span className="label">Settlement Currency</span>
              <span className="value">{merchant.settlementCurrency || 'Not set'}</span>
            </div>
            <div className="financial-item">
              <span className="label">Settlement Cycle</span>
              <span className="value" style={{ textTransform: 'capitalize' }}>
                {merchant.settlementCycle || 'Not set'}
              </span>
            </div>
            <div className="financial-item">
              <span className="label">Payout Bank</span>
              <span className="value">{merchant.payoutBankName || 'Not set'}</span>
            </div>
          </div>
        </Card>

        <Card className="financial-card">
          <h3>Transaction Limits</h3>
          <div className="financial-grid">
            <div className="financial-item">
              <span className="label">Daily Limit</span>
              <span className="value highlight">
                {merchant.dailyTxnLimit ? `$${merchant.dailyTxnLimit.toLocaleString()}` : 'Not set'}
              </span>
            </div>
            <div className="financial-item">
              <span className="label">Monthly Limit</span>
              <span className="value highlight">
                {merchant.monthlyTxnLimit ? `$${merchant.monthlyTxnLimit.toLocaleString()}` : 'Not set'}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Transaction Statistics Section */}
      {statistics && (
        <Card className="merchant-statistics">
          <h2>Transaction Statistics</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Total Transactions</span>
              <span className="stat-value">{statistics.totalTransactions.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Volume</span>
              <span className="stat-value">${statistics.totalVolume.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Average Transaction</span>
              <span className="stat-value">${statistics.averageTransactionValue.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Success Rate</span>
              <span className="stat-value">{statistics.successRate.toFixed(1)}%</span>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Transactions Section */}
      <Card className="merchant-transactions">
        <div className="section-header">
          <h2>Recent Transactions</h2>
          <Button onClick={handleExport} disabled={exportLoading}>
            {exportLoading ? 'Exporting...' : 'Export All'}
          </Button>
        </div>
        <TransactionList transactions={transactions} />
      </Card>

      {/* Activity Timeline Section */}
      <Card className="merchant-activity">
        <h2>Activity Timeline</h2>
        <div className="activity-timeline">
          {activities.length === 0 ? (
            <div className="no-activities">No activity history available</div>
          ) : (
            activities.map(activity => (
              <div key={activity.activityId} className="activity-item">
                <div className="activity-icon">{getActivityIcon(activity.activityType)}</div>
                <div className="activity-content">
                  <div className="activity-description">{activity.description}</div>
                  <div className="activity-meta">
                    <span className="activity-user">{activity.performedBy}</span>
                    <span className="activity-time">{new Date(activity.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

const getActivityIcon = (type: string): string => {
  switch (type) {
    case 'status_change': return '🔄';
    case 'profile_update': return '✏️';
    case 'limit_change': return '💰';
    case 'registration': return '📝';
    default: return '📌';
  }
};
