# Design Document: Merchant Management

## Overview

The Merchant Management feature provides a comprehensive interface for viewing, searching, filtering, creating, and editing merchant accounts. The design follows the existing architecture patterns established in the transaction management system, utilizing React hooks for state management, a service layer for API interactions, and reusable UI components for consistent user experience.

The feature consists of three main layers:
1. **Presentation Layer**: React components (MerchantList, MerchantFilters, MerchantCard, MerchantForm)
2. **State Management Layer**: Custom React hook (useMerchants)
3. **Service Layer**: Merchant API service (merchantService) with CRUD operations

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Merchants Page                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         "Add Merchant" Button                         │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              MerchantList Component                   │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │         MerchantFilters Component               │  │  │
│  │  │  (Search, Status Filter, Sort Controls)         │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │         Table Component                         │  │  │
│  │  │  (Merchant Rows with Edit Actions)              │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │         Pagination Component                    │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         MerchantForm Modal (Create/Edit)            │  │
│  │  - Form fields for merchant data                    │  │
│  │  - Validation and error display                     │  │
│  │  - Submit and Cancel buttons                        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │  useMerchants    │
                  │  Custom Hook     │
                  └──────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │ merchantService  │
                  │  API Layer       │
                  │  (CRUD ops)      │
                  └──────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │   API Client     │
                  │   (axios)        │
                  └──────────────────┘
```

### Component Hierarchy

```
Merchants (Page)
├── Button (Add Merchant)
├── MerchantList
│   ├── MerchantFilters
│   │   ├── Input (Search)
│   │   ├── Select (Status Filter)
│   │   └── Button (Clear Filters)
│   ├── Table
│   │   ├── TableHeader (with sort controls)
│   │   └── TableBody
│   │       └── MerchantRow (repeated)
│   │           ├── Link (to details)
│   │           └── Button (Edit)
│   └── Pagination
│       ├── PageNumbers
│       ├── PreviousButton
│       └── NextButton
└── MerchantForm (Modal)
    ├── Input fields (name, email, phone, etc.)
    ├── Select (status, business type)
    ├── Validation messages
    └── Action buttons (Submit, Cancel)

MerchantDetails (Page)
├── Button (Back to Merchants)
├── Card (Merchant Profile)
│   └── Profile information grid
├── Card (Transaction Statistics)
│   └── Statistics grid
├── Card (Recent Transactions)
│   ├── Button (Export)
│   └── TransactionList
│       └── Pagination
└── Card (Activity Timeline)
    └── Activity items (repeated)

Alternative View (Card Layout - Optional):
└── MerchantCard (repeated)
    ├── Merchant info display
    └── Button (Edit)
```

## Components and Interfaces

### 1. Type Definitions (`src/types/merchant.ts` and `src/types/transaction.ts`)

```typescript
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
  city: string;
  state: string;
  postalCode: string;
  acquirerId: number;
  settlementCurrency: string;
  settlementCycle: string;
  payoutAccountNumber: string;
  payoutBankName: string;
  riskLevel: string;
  dailyTxnLimit: number;
  monthlyTxnLimit: number;
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
  city: string;
  state: string;
  postalCode: string;
  acquirerId: number;
  settlementCurrency: string;
  settlementCycle: string;
  payoutAccountNumber: string;
  payoutBankName: string;
  riskLevel: string;
  dailyTxnLimit: number;
  monthlyTxnLimit: number;
}

export interface UpdateMerchantRequest {
  merchantName: string;
  contactEmail: string;
  contactPhone: string;
  dailyTxnLimit: number;
  monthlyTxnLimit: number;
  status: 'active' | 'inactive' | 'pending';
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
  city: string;
  state: string;
  postalCode: string;
  status?: 'active' | 'inactive' | 'pending';
}

export interface ValidationErrors {
  [key: string]: string;
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
```

### 2. Merchant Service (`src/services/merchantService.ts`)

This service interacts with the backend API for all merchant operations including fetching, creating, and updating merchants.

**API Endpoints**:
- `GET /api/v1/merchants` - Fetch merchants with pagination, search, filtering, and sorting
- `GET /api/v1/merchants/:id` - Fetch a single merchant by ID
- `POST /api/v1/merchants` - Create a new merchant
- `PUT /api/v1/merchants/:id` - Update an existing merchant

**Query Parameters**:
- `page`: Page number (0-indexed)
- `size`: Number of items per page
- `search`: Optional search query (searches across name, ID, email)
- `status`: Optional status filter (active, inactive, pending)
- `sortBy`: Optional sort column (merchantId, name, status, registrationDate)
- `sortOrder`: Optional sort direction (asc, desc)

**Example Request**:
```
GET /api/v1/merchants?page=0&size=20&search=acme&status=active&sortBy=name&sortOrder=asc
```

**Example Response**:
```json
{
  "code": "200",
  "message": "Success",
  "data": {
    "merchants": [
      {
        "merchantId": 1,
        "merchantCode": "MCH-00001",
        "merchantName": "Skyline Electronics Store",
        "businessType": "retail",
        "websiteUrl": "https://skyline-electronics.com",
        "contactEmail": "support@skyline-electronics.com",
        "contactPhone": "+1-800-555-1234",
        "registrationNumber": "REG-567890",
        "country": "USA",
        "addressLine1": "450 Sunset Blvd",
        "city": "Los Angeles",
        "state": "CA",
        "postalCode": "90001",
        "acquirerId": 1,
        "settlementCurrency": "USD",
        "settlementCycle": "daily",
        "payoutAccountNumber": "987654321000",
        "payoutBankName": "Bank of America",
        "riskLevel": "medium",
        "dailyTxnLimit": 50000.00,
        "monthlyTxnLimit": 1500000.00,
        "status": "active",
        "createdAt": "2025-11-22T22:01:08.106605",
        "updatedAt": "2025-11-22T22:01:08.106605"
      }
    ],
    "pagination": {
      "page": 0,
      "pageSize": 10,
      "totalPages": 1,
      "totalElements": 1
    }
  }
}
```

**Create Merchant Request**:
```
POST /api/v1/merchants
Content-Type: application/json

{
  "merchantName": "New Store",
  "businessType": "retail",
  "websiteUrl": "https://newstore.com",
  "contactEmail": "contact@newstore.com",
  "contactPhone": "+1-555-0123",
  "registrationNumber": "REG-123456",
  "country": "USA",
  "addressLine1": "123 Main St",
  "city": "New York",
  "state": "NY",
  "postalCode": "10001",
  "acquirerId": 1,
  "settlementCurrency": "USD",
  "settlementCycle": "daily",
  "payoutAccountNumber": "123456789",
  "payoutBankName": "Bank of America",
  "riskLevel": "low",
  "dailyTxnLimit": 10000.00,
  "monthlyTxnLimit": 300000.00
}
```

**Create Merchant Response**:
```json
{
  "code": "200",
  "message": "Success",
  "data": {
    "merchantId": 6,
    "merchantCode": "MCH-00003",
    "status": "pending"
  }
}
```

**Update Merchant Request**:
```
PUT /api/v1/merchants/6
Content-Type: application/json

{
  "merchantName": "Acme Corp",
  "contactEmail": "contact@acmecorp.com",
  "contactPhone": "+1234567890",
  "dailyTxnLimit": 10000.00,
  "monthlyTxnLimit": 300000.00,
  "status": "active"
}
```

**Update Merchant Response**:
```json
{
  "code": "200",
  "message": "Success",
  "data": {
    "merchantId": 6,
    "status": "active",
    "message": "Merchant updated successfully"
  }
}
```

```typescript
import { get, post, put } from './api';
import { MerchantApiResponse, MerchantResponse, MerchantFilterState, Merchant } from '../types/merchant';

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
  
  // Extract data from the wrapped response
  return {
    merchants: response.data.merchants,
    pagination: response.data.pagination,
  };
};

export const getMerchantById = async (merchantId: number): Promise<Merchant> => {
  const response = await get<{ code: string; message: string; data: Merchant }>(
    `${MERCHANTS_BASE}/${merchantId}`
  );
  return response.data;
};

export const createMerchant = async (merchantData: CreateMerchantRequest): Promise<CreateMerchantResponse> => {
  const response = await post<{ code: string; message: string; data: CreateMerchantResponse }>(
    MERCHANTS_BASE,
    merchantData
  );
  return response.data;
};

export const updateMerchant = async (
  merchantId: number,
  merchantData: UpdateMerchantRequest
): Promise<UpdateMerchantResponse> => {
  const response = await put<{ code: string; message: string; data: UpdateMerchantResponse }>(
    `${MERCHANTS_BASE}/${merchantId}`,
    merchantData
  );
  return response.data;
};

// TODO: Placeholder - API endpoint not yet available
// Future endpoint: GET /api/v1/merchants/:id/statistics
export const getMerchantStatistics = async (merchantId: number): Promise<MerchantStatistics> => {
  // Placeholder implementation - calculate from transactions
  console.warn('Statistics API not available, using placeholder');
  return {
    totalTransactions: 0,
    totalVolume: 0,
    averageTransactionValue: 0,
    successRate: 0,
    lastTransactionDate: new Date().toISOString(),
  };
};

// TODO: Placeholder - API endpoint not yet available
// Future endpoint: GET /api/v1/merchants/:id/activities
export const getMerchantActivities = async (
  merchantId: number,
  page: number = 0,
  size: number = 20
): Promise<MerchantActivityResponse> => {
  // Placeholder implementation
  console.warn('Activities API not available, using placeholder');
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

// TODO: Placeholder - API endpoint not yet available
// Future endpoint: GET /api/v1/merchants/:id/transactions/export
export const exportMerchantTransactions = async (merchantId: number): Promise<Blob> => {
  // Placeholder implementation
  console.warn('Export API not available, using placeholder');
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
```

### 3. useMerchants Hook (`src/hooks/useMerchants.ts`)

```typescript
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
    // Debounce search queries
    if (filters.searchQuery !== undefined) {
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
```

### 4. MerchantList Component (`src/components/merchants/MerchantList.tsx`)

```typescript
import React, { useState } from 'react';
import { useMerchants } from '../../hooks/useMerchants';
import { MerchantFilterState, DEFAULT_MERCHANT_FILTERS } from '../../types/merchant';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Table } from '../common/Table';
import './MerchantList.css';

export const MerchantList: React.FC = () => {
  const [filters, setFilters] = useState<MerchantFilterState>(DEFAULT_MERCHANT_FILTERS);
  const { data, loading, error, refetch } = useMerchants(filters);

  const handleSearchChange = (searchQuery: string) => {
    setFilters(prev => ({ ...prev, searchQuery, page: 0 }));
  };

  const handleStatusFilter = (status?: 'active' | 'inactive' | 'pending') => {
    setFilters(prev => ({ ...prev, status, page: 0 }));
  };

  const handleSort = (sortBy: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: sortBy as any,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error">Error: {error.message}</div>;
  if (!data || data.merchants.length === 0) return <div>No merchants found</div>;

  return (
    <div className="merchant-list">
      {/* Filters, Table, and Pagination components */}
    </div>
  );
};
```

### 5. MerchantFilters Component (`src/components/merchants/MerchantFilters.tsx`)

```typescript
import React from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

interface MerchantFiltersProps {
  searchQuery: string;
  status?: string;
  onSearchChange: (query: string) => void;
  onStatusChange: (status?: 'active' | 'inactive' | 'pending') => void;
  onClearFilters: () => void;
}

export const MerchantFilters: React.FC<MerchantFiltersProps> = ({
  searchQuery,
  status,
  onSearchChange,
  onStatusChange,
  onClearFilters,
}) => {
  return (
    <div className="merchant-filters">
      <Input
        type="text"
        placeholder="Search by name, ID, or email..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select value={status || ''} onChange={(e) => onStatusChange(e.target.value as any || undefined)}>
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="pending">Pending</option>
      </select>
      <Button onClick={onClearFilters}>Clear Filters</Button>
    </div>
  );
};
```

### 6. MerchantForm Component (`src/components/merchants/MerchantForm.tsx`)

The MerchantForm component is a reusable form for both creating new merchants and editing existing ones.

**API Endpoints**:
- Create: `POST /api/v1/merchants`
- Update: `PUT /api/v1/merchants/:id`

**Props Interface**:
```typescript
interface MerchantFormProps {
  merchant?: Merchant; // If provided, form is in edit mode
  onSubmit: (data: MerchantFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}
```

**Component Structure**:
```typescript
import React, { useState, useEffect } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Merchant, MerchantFormData, ValidationErrors } from '../../types/merchant';
import './MerchantForm.css';

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
    city: merchant?.city || '',
    state: merchant?.state || '',
    postalCode: merchant?.postalCode || '',
    status: merchant?.status || 'pending',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Required field validation
    if (!formData.merchantName.trim()) {
      newErrors.merchantName = 'Merchant name is required';
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

    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Show confirmation dialog for edits
    if (merchant && !showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      // Error handling is done by parent component
    }
  };

  const handleFieldChange = (field: keyof MerchantFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="merchant-form-modal">
      <div className="merchant-form-content">
        <h2>{merchant ? 'Edit Merchant' : 'Add New Merchant'}</h2>
        
        {showConfirmation ? (
          <div className="confirmation-dialog">
            <p>Are you sure you want to update this merchant?</p>
            <div className="confirmation-actions">
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                Confirm
              </Button>
              <Button onClick={() => setShowConfirmation(false)} variant="secondary">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Form fields */}
            <Input
              label="Merchant Name"
              value={formData.merchantName}
              onChange={(e) => handleFieldChange('merchantName', e.target.value)}
              error={errors.merchantName}
              required
            />
            
            <Input
              label="Contact Email"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleFieldChange('contactEmail', e.target.value)}
              error={errors.contactEmail}
              required
            />
            
            <Input
              label="Contact Phone"
              value={formData.contactPhone}
              onChange={(e) => handleFieldChange('contactPhone', e.target.value)}
              error={errors.contactPhone}
              required
            />

            {/* Additional fields... */}

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
```

**Validation Rules**:
- merchantName: Required, non-empty
- contactEmail: Required, valid email format
- contactPhone: Required, valid phone format (allows +, digits, spaces, hyphens, parentheses)
- addressLine1: Required, non-empty
- city: Required, non-empty
- country: Required, non-empty
- All other fields: Optional

### 7. MerchantDetails Component (`src/components/merchants/MerchantDetails.tsx`)

The MerchantDetails component displays comprehensive information about a specific merchant, including profile, statistics, recent transactions, and activity timeline.

**Note**: Some features use placeholder implementations as the backend APIs are not yet available:
- Statistics calculation (will use placeholder data until API is available)
- Activity timeline (will show empty state until API is available)
- Export functionality (will show error message until API is available)

**Route**: `/merchants/:id`

**API Endpoints**:
- `GET /api/v1/merchants/:id` - Fetch merchant details
- `GET /merchant-transaction/:id/transactions` - Fetch merchant transactions (available)
- `GET /api/v1/merchants/:id/statistics` - Fetch transaction statistics (TODO: not yet available)
- `GET /api/v1/merchants/:id/activities` - Fetch activity timeline (TODO: not yet available)
- `GET /api/v1/merchants/:id/transactions/export` - Export transaction history (TODO: not yet available)

**Component Structure**:
```typescript
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMerchantById, getMerchantStatistics, getMerchantActivities, exportMerchantTransactions } from '../../services/merchantService';
import { getTransactions } from '../../services/transactionService';
import { Merchant, MerchantStatistics, MerchantActivity } from '../../types/merchant';
import { Transaction } from '../../types/transaction';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Table } from '../common/Table';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { TransactionList } from '../transaction/TransactionList';
import './MerchantDetails.css';

export const MerchantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [statistics, setStatistics] = useState<MerchantStatistics | null>(null);
  const [activities, setActivities] = useState<MerchantActivity[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    const fetchMerchantDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const [merchantData, statsData, activitiesData, transactionsData] = await Promise.all([
          getMerchantById(Number(id)),
          getMerchantStatistics(Number(id)), // Placeholder
          getMerchantActivities(Number(id), 0, 10), // Placeholder
          getTransactions(id, { page: 0, size: 10, startDate: '', endDate: '' })
        ]);
        
        setMerchant(merchantData);
        setStatistics(statsData);
        setActivities(activitiesData.activities);
        setTransactions(transactionsData.transactions);
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
      // TODO: Replace with actual API call when endpoint is available
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

      {/* Merchant Profile Section */}
      <Card className="merchant-profile">
        <h2>Merchant Profile</h2>
        <div className="profile-grid">
          <div className="profile-item">
            <span className="label">Merchant Code:</span>
            <span className="value">{merchant.merchantCode}</span>
          </div>
          <div className="profile-item">
            <span className="label">Business Type:</span>
            <span className="value">{merchant.businessType}</span>
          </div>
          <div className="profile-item">
            <span className="label">Contact Email:</span>
            <span className="value">{merchant.contactEmail}</span>
          </div>
          <div className="profile-item">
            <span className="label">Contact Phone:</span>
            <span className="value">{merchant.contactPhone}</span>
          </div>
          <div className="profile-item">
            <span className="label">Website:</span>
            <span className="value">
              <a href={merchant.websiteUrl} target="_blank" rel="noopener noreferrer">
                {merchant.websiteUrl}
              </a>
            </span>
          </div>
          <div className="profile-item">
            <span className="label">Location:</span>
            <span className="value">
              {merchant.addressLine1}, {merchant.city}, {merchant.state}, {merchant.country}
            </span>
          </div>
          <div className="profile-item">
            <span className="label">Daily Transaction Limit:</span>
            <span className="value">${merchant.dailyTxnLimit.toLocaleString()}</span>
          </div>
          <div className="profile-item">
            <span className="label">Monthly Transaction Limit:</span>
            <span className="value">${merchant.monthlyTxnLimit.toLocaleString()}</span>
          </div>
        </div>
      </Card>

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
          {activities.map(activity => (
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
          ))}
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
```

### 8. MerchantCard Component (`src/components/merchants/MerchantCard.tsx`)

The MerchantCard component displays merchant information in a card format, providing an alternative to the table view.

**Props Interface**:
```typescript
interface MerchantCardProps {
  merchant: Merchant;
  onEdit: (merchant: Merchant) => void;
}
```

**Component Structure**:
```typescript
import React from 'react';
import { Merchant } from '../../types/merchant';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import './MerchantCard.css';

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
```

## Data Models

### Merchant Entity

The Merchant entity represents a business registered on the platform:

- **merchantId**: Unique identifier (number)
- **merchantCode**: Unique merchant code (string, e.g., "MCH-00001")
- **merchantName**: Business name (string)
- **businessType**: Type of business (string, e.g., "retail")
- **websiteUrl**: Merchant website URL (string)
- **contactEmail**: Contact email (string, valid email format)
- **contactPhone**: Contact phone number (string)
- **registrationNumber**: Business registration number (string)
- **country**: Country code (string)
- **addressLine1**: Street address (string)
- **city**: City name (string)
- **state**: State/province code (string)
- **postalCode**: Postal/ZIP code (string)
- **acquirerId**: Associated acquirer ID (number)
- **settlementCurrency**: Currency for settlements (string, e.g., "USD")
- **settlementCycle**: Settlement frequency (string, e.g., "daily")
- **payoutAccountNumber**: Bank account for payouts (string)
- **payoutBankName**: Bank name (string)
- **riskLevel**: Risk assessment level (string, e.g., "low", "medium", "high")
- **dailyTxnLimit**: Daily transaction limit (number)
- **monthlyTxnLimit**: Monthly transaction limit (number)
- **status**: Current merchant status (enum: active, inactive, pending)
- **createdAt**: ISO 8601 timestamp of creation
- **updatedAt**: ISO 8601 timestamp of last update

### Filter State

The filter state manages all user-selected filtering, sorting, and pagination options:

- **page**: Current page number (0-indexed)
- **size**: Number of items per page (default: 20)
- **searchQuery**: Optional search string
- **status**: Optional status filter
- **sortBy**: Column to sort by
- **sortOrder**: Sort direction (asc/desc)

## Cor
rectness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Merchant table displays all merchants with required columns
*For any* set of merchants returned by the API, the rendered table should display all merchants with columns for merchant ID, name, status, and contact information.
**Validates: Requirements 1.1**

### Property 2: Search filters return only matching merchants
*For any* search query and merchant list, all returned results should match the search query in at least one searchable field (merchant ID, name, or email), and the search should be case-insensitive for name searches.
**Validates: Requirements 2.1, 2.2, 2.3**

### Property 3: Status filter returns only merchants with specified status
*For any* status filter value (active, inactive, or pending) and merchant list, all returned results should have exactly that status.
**Validates: Requirements 2.4, 5.1, 5.2**

### Property 4: Clearing search returns all merchants
*For any* merchant list, applying a search filter and then clearing it should return the same set of merchants as the original unfiltered list.
**Validates: Requirements 2.5**

### Property 5: Sorting orders merchants correctly by column
*For any* sortable column (merchantId, name, status, registrationDate) and merchant list, sorting by that column should produce a correctly ordered list in the specified direction (ascending or descending).
**Validates: Requirements 3.1, 3.2, 3.3**

### Property 6: Sort toggle reverses order
*For any* sorted merchant list, clicking the same sort column again should reverse the order of merchants while maintaining the same sorting column.
**Validates: Requirements 3.2**

### Property 7: Operations preserve filter state
*For any* filter state (search, status, sort), performing pagination or sorting operations should not modify the other filter criteria.
**Validates: Requirements 3.4, 4.6**

### Property 8: Pagination displays correct merchant subset
*For any* merchant list and page number, the displayed merchants should be the correct subset based on page size and page number calculations.
**Validates: Requirements 4.2, 4.3, 4.4**

### Property 9: Pagination controls appear when needed
*For any* merchant list, pagination controls should be visible if and only if the total number of merchants exceeds the page size.
**Validates: Requirements 4.1**

### Property 10: Pagination info is accurate
*For any* pagination state, the displayed current page, total pages, and total merchant count should match the actual values from the API response.
**Validates: Requirements 4.5**

### Property 11: Multiple filters combine with AND logic
*For any* combination of filters (search query and status), the results should satisfy all applied filters simultaneously.
**Validates: Requirements 5.3**

### Property 12: Filter removal expands results appropriately
*For any* filtered merchant list, removing a filter should result in a result set that is a superset of the previously filtered results.
**Validates: Requirements 5.4**

### Property 13: Displayed count matches actual results
*For any* filter state, the displayed count of merchants should equal the actual number of merchants in the results.
**Validates: Requirements 5.5**

### Property 14: useMerchants hook provides required state
*For any* usage of the useMerchants hook, it should return an object containing data, loading, error, and refetch properties.
**Validates: Requirements 6.1**

### Property 15: Filter changes trigger refetch
*For any* change to filter parameters passed to useMerchants, the hook should trigger a new API call to fetch updated data.
**Validates: Requirements 6.2**

### Property 16: Refetch function reloads data
*For any* state of the useMerchants hook, calling the refetch function should trigger a new API call with the current filters.
**Validates: Requirements 6.3**

### Property 17: Search queries are debounced
*For any* rapid sequence of search query changes, the useMerchants hook should only make one API call after the debounce period (300ms) has elapsed.
**Validates: Requirements 6.5**

### Property 18: Service constructs correct query parameters
*For any* filter state object, the merchant service should construct query parameters that correctly represent all non-undefined filter values.
**Validates: Requirements 7.2**

### Property 19: Service returns properly typed responses
*For any* successful API response, the merchant service should return an object that conforms to the MerchantResponse TypeScript interface.
**Validates: Requirements 7.5**

### Property 20: Loading state displays indicator
*For any* loading state (true), the UI should display a loading indicator and not display the merchant table.
**Validates: Requirements 1.2, 8.1, 8.2**

### Property 21: Interactive elements disabled during loading
*For any* loading state (true), all interactive elements (search input, filters, pagination buttons) should be disabled to prevent duplicate requests.
**Validates: Requirements 8.5**

### Property 22: Consistent formatting across rows
*For any* set of merchants displayed in the table, all rows should use the same formatting functions for dates, status badges, and contact information.
**Validates: Requirements 1.5**

### Property 23: Form submission sends POST request with valid data
*For any* valid merchant form data, submitting the create form should send a POST request to /api/v1/merchants with that data.
**Validates: Requirements 9.3**

### Property 24: Successful creation resets form and shows notification
*For any* successful merchant creation response, the system should display a success notification and reset the form to its initial state.
**Validates: Requirements 9.4**

### Property 25: Creation error preserves form data
*For any* API error during merchant creation, the system should display the error message and keep all form data intact.
**Validates: Requirements 9.5**

### Property 26: Required field validation prevents submission
*For any* form state where required fields are empty or invalid, the submit button should be disabled or submission should be prevented.
**Validates: Requirements 9.6, 10.7, 12.2**

### Property 27: Email validation rejects invalid formats
*For any* string that does not match valid email format, the email field validation should fail and display an error.
**Validates: Requirements 9.7**

### Property 28: Phone validation rejects invalid formats
*For any* string that does not match valid phone format (containing only digits, spaces, hyphens, parentheses, and optional +), the phone field validation should fail and display an error.
**Validates: Requirements 9.8**

### Property 29: Edit form pre-populates with merchant data
*For any* merchant object, opening the edit form should pre-populate all form fields with that merchant's current data.
**Validates: Requirements 10.1**

### Property 30: Edit submission sends PUT request with updated data
*For any* valid updated merchant data and merchant ID, submitting the edit form should send a PUT request to /api/v1/merchants/:id with the updated data.
**Validates: Requirements 10.4**

### Property 31: Successful update shows notification and refreshes list
*For any* successful merchant update response, the system should display a success notification and refresh the merchant list.
**Validates: Requirements 10.5**

### Property 32: Update error preserves form data
*For any* API error during merchant update, the system should display the error message and keep all form data intact.
**Validates: Requirements 10.6**

### Property 33: Edit form shows confirmation dialog
*For any* edit form submission attempt, a confirmation dialog should appear before the PUT request is sent.
**Validates: Requirements 10.8**

### Property 34: MerchantCard displays required information
*For any* merchant object, the MerchantCard component should display merchant name, merchant code, status, contact email, contact phone, business type, and website URL.
**Validates: Requirements 11.1, 11.2**

### Property 35: MerchantCard applies status badge styling
*For any* merchant status (active, inactive, pending), the MerchantCard should apply the appropriate CSS class for that status badge.
**Validates: Requirements 11.4**

### Property 36: MerchantForm mode determined by merchant prop
*For any* MerchantForm instance, if a merchant prop is provided it should be in edit mode, otherwise it should be in create mode.
**Validates: Requirements 12.1**

### Property 37: Validation errors display inline
*For any* form field with a validation error, the error message should be displayed inline next to that specific field.
**Validates: Requirements 12.3**

### Property 38: Submit button disabled during submission
*For any* form state where isSubmitting is true, the submit button should be disabled.
**Validates: Requirements 12.4**

### Property 39: Form calls appropriate callback based on mode
*For any* form submission, if in create mode the create callback should be invoked, if in edit mode the edit callback should be invoked.
**Validates: Requirements 12.5**

### Property 40: Form displays API errors
*For any* API error returned during form submission, the error message should be displayed to the user.
**Validates: Requirements 12.6**

### Property 41: createMerchant sends POST to correct endpoint
*For any* merchant data object, calling createMerchant should send a POST request to /api/v1/merchants with that data.
**Validates: Requirements 13.1**

### Property 42: updateMerchant sends PUT to correct endpoint
*For any* merchant ID and update data, calling updateMerchant should send a PUT request to /api/v1/merchants/:id with that data.
**Validates: Requirements 13.2**

### Property 43: createMerchant returns created merchant
*For any* successful createMerchant call, the function should return the created merchant object from the API response.
**Validates: Requirements 13.3**

### Property 44: updateMerchant returns updated merchant
*For any* successful updateMerchant call, the function should return the updated merchant object from the API response.
**Validates: Requirements 13.4**

### Property 45: Service functions throw on API errors
*For any* API error response (4xx, 5xx), the merchant service functions should throw an appropriate exception.
**Validates: Requirements 13.5**

### Property 46: Merchant click navigates to details page
*For any* merchant in the list, clicking on that merchant should navigate to the merchant details route with the correct merchant ID.
**Validates: Requirements 14.1**

### Property 47: Details page displays all merchant information
*For any* merchant object, the merchant details page should render all required fields including name, code, status, contact details, business information, and financial limits.
**Validates: Requirements 14.2**

### Property 48: Details page displays transaction statistics
*For any* merchant statistics object, the details page should display total transaction count, total volume, and average transaction value.
**Validates: Requirements 14.3**

### Property 49: Details page displays recent transactions
*For any* list of transactions for a merchant, the details page should render all transactions with pagination support.
**Validates: Requirements 14.4**

### Property 50: Details page displays activity timeline
*For any* list of merchant activities, the details page should render all activities in chronological order in the timeline.
**Validates: Requirements 14.5**

### Property 51: Export button downloads transaction history
*For any* merchant, clicking the export button should trigger an API call to the export endpoint and initiate a CSV file download.
**Validates: Requirements 14.6**

### Property 52: Back button returns to merchant list
*For any* merchant details page, clicking the back button should navigate to the merchant list route.
**Validates: Requirements 14.7**

## Error Handling

### Error Scenarios

1. **Network Errors**: When the API is unreachable
   - Display: "Unable to connect to server. Please check your connection."
   - Action: Provide retry button

2. **API Errors (4xx, 5xx)**: When the server returns an error
   - Display: Error message from API or generic "An error occurred"
   - Action: Provide retry button and log error details

3. **Validation Errors**: When filter parameters or form inputs are invalid
   - Display: Inline validation messages next to the relevant field
   - Action: Prevent API call until valid

4. **Form Validation Errors**: When required fields are missing or invalid
   - Display: Red error text below the invalid field
   - Action: Disable submit button or prevent submission
   - Examples:
     - "Merchant name is required"
     - "Invalid email format"
     - "Invalid phone format"

5. **Empty Results**: When no merchants match filters
   - Display: "No merchants found matching your criteria"
   - Action: Suggest clearing filters

6. **Creation/Update Errors**: When merchant creation or update fails
   - Display: Error message from API at the top of the form
   - Action: Keep form data intact, allow user to correct and retry

### Error State Management

```typescript
interface ErrorState {
  message: string;
  code?: string;
  retryable: boolean;
}
```

The useMerchants hook captures all errors and exposes them through the error property. Components can then render appropriate error UI based on the error type.

## Testing Strategy

### Unit Testing

Unit tests will verify specific examples and edge cases:

1. **Component Rendering**:
   - MerchantList renders with mock data
   - MerchantCard displays merchant information correctly
   - MerchantForm renders in create mode without merchant prop
   - MerchantForm renders in edit mode with merchant prop
   - MerchantDetails renders with merchant profile, statistics, transactions, and activities
   - Empty state displays when no merchants
   - Error state displays with error message
   - Loading state displays spinner

2. **Filter Logic**:
   - Search filter with specific query
   - Status filter with each status value
   - Combined filters work together
   - Clear filters resets to defaults

3. **Pagination**:
   - Page navigation with specific page numbers
   - Next/previous buttons enable/disable correctly
   - Page info displays correct values

4. **Form Validation**:
   - Required field validation with empty inputs
   - Email validation with specific invalid formats
   - Phone validation with specific invalid formats
   - Form submission prevented when validation fails
   - Validation errors cleared when user types

5. **Form Submission**:
   - Create form calls createMerchant service function
   - Edit form calls updateMerchant service function
   - Confirmation dialog appears for edit submissions
   - Form resets after successful creation
   - Form data preserved after API error

6. **Service Layer**:
   - Query parameter construction with various filter combinations
   - createMerchant sends POST with correct data
   - updateMerchant sends PUT with correct data
   - getMerchantStatistics fetches statistics correctly
   - getMerchantActivities fetches activities with pagination
   - exportMerchantTransactions returns blob for download
   - API error handling with specific error codes
   - Response parsing with mock API responses

7. **Merchant Details**:
   - Navigation to details page with merchant ID
   - All merchant profile fields displayed
   - Transaction statistics rendered correctly
   - Recent transactions list displayed
   - Activity timeline rendered in chronological order
   - Export button triggers download
   - Back button navigates to merchant list

### Property-Based Testing

Property-based tests will verify universal properties across all inputs using **fast-check** library for TypeScript/JavaScript.

**Configuration**: Each property test should run a minimum of 100 iterations.

**Test Tagging**: Each property-based test must include a comment with this format:
```typescript
// Feature: merchant-management, Property {number}: {property_text}
```

**Property Test Coverage**:
- Properties 1-52 as defined in the Correctness Properties section
- Each property will be implemented as a single property-based test
- Tests will generate random merchant data, filter states, form inputs, user interactions, statistics, and activities
- Tests will verify the specified property holds across all generated inputs
- Form validation properties will test with randomly generated valid and invalid inputs
- Navigation and export properties will test with mock navigation and download functions

**Testing Library**: fast-check (https://github.com/dubzzz/fast-check)

**Example Property Test Structure**:
```typescript
import fc from 'fast-check';

// Feature: merchant-management, Property 3: Status filter returns only merchants with specified status
test('status filter returns only matching merchants', () => {
  fc.assert(
    fc.property(
      fc.array(merchantArbitrary),
      fc.constantFrom('active', 'inactive', 'pending'),
      (merchants, status) => {
        const filtered = filterByStatus(merchants, status);
        return filtered.every(m => m.status === status);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Integration Testing

Integration tests will verify the complete flow:
- API service → Hook → Component rendering
- User interactions → State updates → API calls
- Error scenarios → Error display → Retry functionality
- Form submission → API call → Success/error handling → UI update
- Create merchant flow: Open form → Fill fields → Submit → Verify POST → Success notification
- Edit merchant flow: Click edit → Form pre-populated → Modify → Confirm → Verify PUT → List refresh
- Merchant details flow: Click merchant → Navigate to details → Load profile, stats, transactions, activities → Export → Back to list

## Performance Considerations

1. **Debouncing**: Search queries debounced at 300ms to reduce API calls
2. **Pagination**: Server-side pagination to handle large datasets
3. **Memoization**: Use React.memo for merchant row components
4. **Virtual Scrolling**: Consider for very large page sizes (future enhancement)

## Accessibility

1. **Keyboard Navigation**: All interactive elements accessible via keyboard
2. **ARIA Labels**: Proper labels for screen readers
3. **Focus Management**: Logical tab order through filters and table
4. **Status Indicators**: Text alternatives for visual status badges

## Future Enhancements

1. **Bulk Operations**: Select multiple merchants for batch actions
2. **Export**: Download merchant list as CSV/Excel
3. **Advanced Filters**: Date range, business type, location
4. **Merchant Details Modal**: Quick view without navigation
5. **Real-time Updates**: WebSocket for live merchant status changes
