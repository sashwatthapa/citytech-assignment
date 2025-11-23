import { useState, useEffect } from 'react';
import { getTransactions } from '../services/transactionService';
import { FilterState, Transaction } from '../types/transaction';

interface UseTransactionsResult {
  data: {
    transactions: Transaction[];
    totalTransactions: number;
    page: number;
    size: number;
    totalPages: number;
  } | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useTransactions = (
  merchantId: string,
  filters: FilterState
): UseTransactionsResult => {
  const [data, setData] = useState<UseTransactionsResult['data']>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTransactions(merchantId, filters);
      
      if (response.data) {
        setData({
          transactions: response.data.transactions || [],
          totalTransactions: response.data.summary?.totalTransactions || 0,
          page: response.data.pagination?.page || 0,
          size: response.data.pagination?.size || response.data.pagination?.pageSize || 20,
          totalPages: response.data.pagination?.totalPages || 0,
        });
      }
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [merchantId, filters.page, filters.size, filters.status, filters.startDate, filters.endDate]);

  return {
    data,
    loading,
    error,
    refetch: fetchTransactions,
  };
};
