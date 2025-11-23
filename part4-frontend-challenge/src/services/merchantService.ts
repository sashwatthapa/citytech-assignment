import { get, post, put } from './api';
import { 
  MerchantApiResponse, 
  MerchantResponse, 
  MerchantFilterState, 
  Merchant,
  CreateMerchantRequest,
  CreateMerchantResponse,
  UpdateMerchantRequest,
  UpdateMerchantResponse,
  MerchantStatistics,
  MerchantActivityResponse
} from '../types/merchant';

const MERCHANTS_BASE = '/merchants';

export const getMerchants = async (
  filters: MerchantFilterState
): Promise<MerchantResponse> => {
  const params: Record<string, any> = {
    page: filters.page,
    pageSize: filters.size,
  };

  if (filters.searchQuery) {
    params.search = filters.searchQuery;
  }
  
  if (filters.status) {
    params.status = filters.status;
  }
  
  if (filters.sortBy) {
    params.sortBy = filters.sortBy;
    params.sortOrder = filters.sortOrder || 'asc';
  }

  const response = await get<MerchantApiResponse>(MERCHANTS_BASE, { params });
  
  return {
    merchants: response.data.merchants,
    pagination: response.data.pagination,
  };
};

export const getMerchantById = async (merchantId: number): Promise<Merchant> => {
  const response = await get<{ code: string; message: string; data: { merchant: Merchant } }>(
    `${MERCHANTS_BASE}/${merchantId}`
  );
  
  return response.data.merchant;
};

export const createMerchant = async (
  merchantData: CreateMerchantRequest
): Promise<CreateMerchantResponse> => {
  try {
    const fullMerchantData: CreateMerchantRequest = {
      merchantName: merchantData.merchantName || '',
      businessType: merchantData.businessType || '',
      websiteUrl: merchantData.websiteUrl || '',
      contactEmail: merchantData.contactEmail || '',
      contactPhone: merchantData.contactPhone || '',
      registrationNumber: merchantData.registrationNumber || '',
      country: merchantData.country || '',
      addressLine1: merchantData.addressLine1 || '',
      addressLine2: merchantData.addressLine2 || '',
      city: merchantData.city || '',
      state: merchantData.state || '',
      postalCode: merchantData.postalCode || '',
    };
    
    const response = await post<{ code: string; message: string; data: CreateMerchantResponse }>(
      MERCHANTS_BASE,
      fullMerchantData
    );
    
    return response.data;
  } catch (error) {
    console.error('Error creating merchant:', error);
    throw error;
  }
};

export const updateMerchant = async (
  merchantId: number,
  merchantData: UpdateMerchantRequest
): Promise<UpdateMerchantResponse> => {
  try {
    const response = await put<{ code: string; message: string; data: UpdateMerchantResponse }>(
      `${MERCHANTS_BASE}/${merchantId}`,
      merchantData
    );
    
    return response.data;
  } catch (error) {
    console.error('Error updating merchant:', error);
    throw error;
  }
};


//TODO: This is a placeholder implementation
export const getMerchantStatistics = async (
  merchantId: number
): Promise<MerchantStatistics> => {
  console.warn(`getMerchantStatistics: API endpoint not yet available for merchant ${merchantId}, returning placeholder data`);
  
  return {
    totalTransactions: 0,
    totalVolume: 0,
    averageTransactionValue: 0,
    successRate: 0,
    lastTransactionDate: new Date().toISOString(),
  };
};

//TODO: This is a placeholder implementation
export const getMerchantActivities = async (
  merchantId: number,
  page: number = 0,
  size: number = 20
): Promise<MerchantActivityResponse> => {
  console.warn(`getMerchantActivities: API endpoint not yet available for merchant ${merchantId}, returning empty array`);
  
  return {
    activities: [],
    pagination: {
      page,
      pageSize: size,
      totalPages: 0,
      totalElements: 0,
    },
  };
};

//TODO: This is a placeholder implementation
export const exportMerchantTransactions = async (
  merchantId: number
): Promise<Blob> => {
  // Placeholder implementation - throws error with message
  console.warn(`exportMerchantTransactions: API endpoint not yet available for merchant ${merchantId}`);
  
  throw new Error('Export functionality not yet implemented - API endpoint not available');
};

export default {
  getMerchants,
  getMerchantById,
  createMerchant,
  updateMerchant,
  getMerchantStatistics,
  getMerchantActivities,
  exportMerchantTransactions,
};
