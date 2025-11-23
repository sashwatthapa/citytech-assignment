import React from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import './MerchantFilters.css';

interface MerchantFiltersProps {
  searchQuery: string;
  status?: 'active' | 'inactive' | 'pending';
  onSearchChange: (query: string) => void;
  onStatusChange: (status?: 'active' | 'inactive' | 'pending') => void;
  onClearFilters: () => void;
  disabled?: boolean;
}

export const MerchantFilters: React.FC<MerchantFiltersProps> = ({
  searchQuery,
  status,
  onSearchChange,
  onStatusChange,
  onClearFilters,
  disabled = false,
}) => {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onStatusChange(value === '' ? undefined : value as 'active' | 'inactive' | 'pending');
  };

  return (
    <div className="merchant-filters">
      <Input
        type="text"
        placeholder="Search by name, ID, or email..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        disabled={disabled}
        className="merchant-filters-search"
      />
      <select
        value={status || ''}
        onChange={handleStatusChange}
        disabled={disabled}
        className="merchant-filters-status"
      >
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="pending">Pending</option>
      </select>
      <Button
        onClick={onClearFilters}
        disabled={disabled}
        variant="outline"
        className="merchant-filters-clear"
      >
        Clear Filters
      </Button>
    </div>
  );
};
