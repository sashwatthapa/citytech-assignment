import { useState } from 'react';
import { FilterState, DEFAULT_FILTERS } from '../types/transaction';
import { TransactionList } from '../components/transaction/TransactionList';
import { TransactionSummary } from '../components/transaction/TransactionSummary';
import { TransactionFilters } from '../components/transaction/TransactionFilters';
import { Pagination } from '../components/transaction/Pagination';
import { useTransactions } from '../hooks/useTransactions';

/**
 * Transactions Page Component
 * Displays transaction dashboard with summary and list
 */
export const Transactions = () => {
  const merchantId = import.meta.env.VITE_DEFAULT_MERCHANT_ID || 'MCH-00001';
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const { data, loading, error } = useTransactions(merchantId, filters);

  const handleStartDateChange = (date: string) => {
    setFilters((prev) => ({ ...prev, startDate: date || undefined, page: 0 }));
  };

  const handleEndDateChange = (date: string) => {
    setFilters((prev) => ({ ...prev, endDate: date || undefined, page: 0 }));
  };

  const handleStatusChange = (status?: string) => {
    setFilters((prev) => ({ ...prev, status, page: 0 }));
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <main className="container">
      <h1>Transaction Dashboard</h1>
      <p className="subtitle">Merchant: {merchantId}</p>

      <TransactionFilters
        startDate={filters.startDate}
        endDate={filters.endDate}
        status={filters.status}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onStatusChange={handleStatusChange}
        onClearFilters={handleClearFilters}
        disabled={loading}
      />

      {error && (
        <div className="error-message" style={{ padding: '1rem', background: '#fee2e2', borderRadius: '8px', color: '#991b1b', margin: '1rem 0' }}>
          Error loading transactions: {error.message}
        </div>
      )}

      {loading && !data && (
        <div className="loading-message" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
          Loading transactions...
        </div>
      )}

      {!loading && data && (
        <>
          <div className="summary-section">
            <TransactionSummary 
              transactions={data.transactions || []} 
              totalTransactions={data.totalTransactions || 0}
            />
          </div>

          <div className="transactions-section">
            <TransactionList 
              transactions={data.transactions || []} 
              loading={false}
            />
          </div>

          {data.totalPages > 1 && (
            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              totalElements={data.totalTransactions}
              pageSize={data.size}
              onPageChange={handlePageChange}
              disabled={loading}
            />
          )}
        </>
      )}
    </main>
  );
};
