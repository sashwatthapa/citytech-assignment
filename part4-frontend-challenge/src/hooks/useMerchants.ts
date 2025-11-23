import { useState, useEffect, useCallback, useRef } from 'react';
import { getMerchants } from '../services/merchantService';
import { MerchantFilterState, MerchantResponse } from '../types/merchant';

interface UseMerchantsResult {
  data: MerchantResponse | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useMerchants = (
  filters: MerchantFilterState
): UseMerchantsResult => {
  const [data, setData] = useState<MerchantResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMerchants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMerchants(filters);
      setData(response);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching merchants:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (filters.searchQuery !== undefined && filters.searchQuery !== '') {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = setTimeout(() => {
        fetchMerchants();
      }, 300);
    } else {
      fetchMerchants();
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [fetchMerchants]);

  return {
    data,
    loading,
    error,
    refetch: fetchMerchants,
  };
};
