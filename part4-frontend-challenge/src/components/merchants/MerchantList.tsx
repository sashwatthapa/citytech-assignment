import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMerchants } from '../../hooks/useMerchants';
import { MerchantFilterState, DEFAULT_MERCHANT_FILTERS, Merchant } from '../../types/merchant';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Table } from '../common/Table';
import { Button } from '../common/Button';
import { MerchantFilters } from './MerchantFilters';
import { formatMerchantStatus, formatEmail } from '../../utils/formatters';
import './MerchantList.css';

interface MerchantListProps {
  onEditMerchant?: (merchant: Merchant) => void;
  refreshTrigger?: number;
}

export const MerchantList: React.FC<MerchantListProps> = ({ onEditMerchant, refreshTrigger }) => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<MerchantFilterState>(DEFAULT_MERCHANT_FILTERS);
  const { data, loading, error, refetch } = useMerchants(filters);

  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  const handleSort = (column: 'merchantId' | 'merchantName' | 'status' | 'createdAt') => {
    if (loading) return;
    setFilters(prev => ({
      ...prev,
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getSortIndicator = (column: string) => {
    if (filters.sortBy !== column) return null;
    return filters.sortOrder === 'asc' ? ' ▲' : ' ▼';
  };

  const handleSearchChange = (searchQuery: string) => {
    setFilters(prev => ({ ...prev, searchQuery: searchQuery || undefined, page: 0 }));
  };

  const handleStatusChange = (status?: 'active' | 'inactive' | 'pending') => {
    setFilters(prev => ({ ...prev, status, page: 0 }));
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_MERCHANT_FILTERS);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleMerchantClick = (merchantId: number) => {
    navigate(`/merchants/${merchantId}`);
  };

  const renderPagination = () => {
    if (!data || !data.pagination) return null;
    
    const { page, totalPages, totalElements } = data.pagination;
    
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        <div className="pagination-info">
          Showing page {page + 1} of {totalPages} ({totalElements} total merchants)
        </div>
        <div className="pagination-controls">
          <Button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0 || loading}
            variant="outline"
            size="small"
          >
            Previous
          </Button>
          {startPage > 0 && (
            <>
              <Button
                onClick={() => handlePageChange(0)}
                disabled={loading}
                variant="outline"
                size="small"
              >
                1
              </Button>
              {startPage > 1 && <span className="pagination-ellipsis">...</span>}
            </>
          )}
          {pageNumbers.map(pageNum => (
            <Button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              disabled={loading}
              variant={pageNum === page ? 'primary' : 'outline'}
              size="small"
            >
              {pageNum + 1}
            </Button>
          ))}
          {endPage < totalPages - 1 && (
            <>
              {endPage < totalPages - 2 && <span className="pagination-ellipsis">...</span>}
              <Button
                onClick={() => handlePageChange(totalPages - 1)}
                disabled={loading}
                variant="outline"
                size="small"
              >
                {totalPages}
              </Button>
            </>
          )}
          <Button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages - 1 || loading}
            variant="outline"
            size="small"
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="merchant-list-error">
        <p className="error-message">Error: {error.message}</p>
        <Button onClick={refetch} variant="primary">
          Retry
        </Button>
      </div>
    );
  }

  if (!data || data.merchants.length === 0) {
    return (
      <div className="merchant-list-empty">
        <p>No merchants found</p>
      </div>
    );
  }

  return (
    <div className="merchant-list">
      <MerchantFilters
        searchQuery={filters.searchQuery || ''}
        status={filters.status}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onClearFilters={handleClearFilters}
        disabled={loading}
      />
      <Table>
        <thead>
          <tr>
            <th 
              className={`sortable-header ${loading ? 'disabled' : ''}`}
              onClick={() => handleSort('merchantId')}
            >
              Merchant ID{getSortIndicator('merchantId')}
            </th>
            <th>Merchant Code</th>
            <th 
              className={`sortable-header ${loading ? 'disabled' : ''}`}
              onClick={() => handleSort('merchantName')}
            >
              Merchant Name{getSortIndicator('merchantName')}
            </th>
            <th>Contact Email</th>
            <th 
              className={`sortable-header ${loading ? 'disabled' : ''}`}
              onClick={() => handleSort('status')}
            >
              Status{getSortIndicator('status')}
            </th>
            <th>City</th>
            <th>Country</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.merchants.map((merchant: Merchant) => (
            <tr 
              key={merchant.merchantId}
              className="merchant-row"
              onClick={() => handleMerchantClick(merchant.merchantId)}
            >
              <td>{merchant.merchantId}</td>
              <td>{merchant.merchantCode}</td>
              <td>{merchant.merchantName}</td>
              <td>{formatEmail(merchant.contactEmail)}</td>
              <td>
                <span className={`status-badge status-${merchant.status}`}>
                  {formatMerchantStatus(merchant.status)}
                </span>
              </td>
              <td>{merchant.city}</td>
              <td>{merchant.country}</td>
              <td>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditMerchant?.(merchant);
                  }}
                  variant="outline"
                  size="small"
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {renderPagination()}
    </div>
  );
};
