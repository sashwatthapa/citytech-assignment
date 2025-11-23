import { get } from './api';
import { TransactionResponse, FilterState } from '../types/transaction';

/**
 * Transaction Service
 * Handles all transaction-related API calls
 */

const MERCHANT_BASE = '/merchant-transaction';

/**
 * Get transactions for a specific merchant
 * 
 * TODO: Implement this method to call the backend API
 * 
 * @param merchantId - The merchant ID
 * @param filters - Filter parameters (page, size, dates, status)
 * @returns Promise with transaction response data
 */
export const getTransactions = async (
  merchantId: string,
  filters: FilterState
): Promise<TransactionResponse> => {
  const params: Record<string, any> = {
    page: filters.page,
    size: filters.size,
  };
  
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;
  if (filters.status) params.status = filters.status;

  const url = `${MERCHANT_BASE}/${merchantId}/transactions`;
  
  try {
    const response = await get<any>(url, { params });
    
    if (response.merchantId) {
      return {
        code: 'SUCCESS',
        message: 'Transactions retrieved successfully',
        data: response
      };
    }
    
    return response;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    
    return {
      code: 'ERROR',
      message: 'Failed to fetch transactions',
      data: {
        merchantId,
        dateRange: { start: '', end: '' },
        summary: {
          totalTransactions: 0,
          totalAmount: 0,
          currency: 'USD',
          byStatus: { completed: 0, pending: 0, failed: 0 }
        },
        transactions: [],
        pagination: { page: 0, size: 10, totalPages: 0, totalElements: 0 }
      }
    };
  }
};

/**
 * Get a single transaction by ID
 * (Optional - for future enhancement)
 */
export const getTransactionById = async (
  _txnId: number
): Promise<any> => {
  // TODO: Implement if needed
  throw new Error('Not implemented');
};

export default {
  getTransactions,
  getTransactionById,
};
