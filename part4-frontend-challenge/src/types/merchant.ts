export interface Merchant {
  merchantId: number;
  merchantCode: string;
  merchantName: string;
  businessType: string;
  websiteUrl: string;
  contactEmail: string;
  contactPhone: string;
  registrationNumber: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  acquirerId?: number;
  settlementCurrency?: string;
  settlementCycle?: string;
  payoutAccountNumber?: string;
  payoutBankName?: string;
  payoutBankCountry?: string;
  riskLevel?: string;
  dailyTxnLimit?: number;
  monthlyTxnLimit?: number;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export interface MerchantApiResponse {
  code: string;
  message: string;
  data: {
    merchants: Merchant[];
    pagination: PaginationInfo;
  };
}

export interface MerchantResponse {
  merchants: Merchant[];
  pagination: PaginationInfo;
}

export interface MerchantFilterState {
  page: number;
  size: number;
  searchQuery?: string;
  status?: 'active' | 'inactive' | 'pending';
  sortBy?: 'merchantId' | 'merchantName' | 'status' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export const DEFAULT_MERCHANT_FILTERS: MerchantFilterState = {
  page: 0,
  size: 20,
  searchQuery: undefined,
  status: undefined,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export interface CreateMerchantRequest {
  merchantName: string;
  businessType: string;
  websiteUrl: string;
  contactEmail: string;
  contactPhone: string;
  registrationNumber: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface UpdateMerchantRequest {
  merchantName: string;
  contactEmail: string;
  contactPhone: string;
  settlementCycle: string;
  payoutAccountNumber: string;
  payoutBankName: string;
  payoutBankCountry: string;
  dailyTxnLimit: number;
  monthlyTxnLimit: number;
}

export interface CreateMerchantResponse {
  merchantId: number;
  merchantCode: string;
  status: 'pending';
}

export interface UpdateMerchantResponse {
  merchantId: number;
  status: string;
  message: string;
}

export interface MerchantFormData {
  merchantName: string;
  businessType: string;
  websiteUrl: string;
  contactEmail: string;
  contactPhone: string;
  registrationNumber: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  settlementCycle: string;
  payoutAccountNumber: string;
  payoutBankName: string;
  payoutBankCountry: string;
  dailyTxnLimit: number;
  monthlyTxnLimit: number;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface MerchantStatistics {
  totalTransactions: number;
  totalVolume: number;
  averageTransactionValue: number;
  successRate: number;
  lastTransactionDate: string;
}

export interface MerchantActivity {
  activityId: number;
  merchantId: number;
  activityType: 'status_change' | 'profile_update' | 'limit_change' | 'registration';
  description: string;
  performedBy: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface MerchantActivityResponse {
  activities: MerchantActivity[];
  pagination: PaginationInfo;
}
