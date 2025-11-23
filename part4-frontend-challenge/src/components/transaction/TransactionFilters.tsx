import React from 'react';
import { Button } from '../common/Button';
import './TransactionFilters.css';

interface TransactionFiltersProps {
  startDate?: string;
  endDate?: string;
  status?: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onStatusChange: (status?: string) => void;
  onClearFilters: () => void;
  disabled?: boolean;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  startDate,
  endDate,
  status,
  onStartDateChange,
  onEndDateChange,
  onStatusChange,
  onClearFilters,
  disabled = false,
}) => {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onStatusChange(value === '' ? undefined : value);
  };

  return (
    <div className="transaction-filters">
      <div className="filter-group">
        <label htmlFor="start-date">Start Date</label>
        <input
          id="start-date"
          type="date"
          value={startDate || ''}
          onChange={(e) => onStartDateChange(e.target.value)}
          disabled={disabled}
          className="date-input"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="end-date">End Date</label>
        <input
          id="end-date"
          type="date"
          value={endDate || ''}
          onChange={(e) => onEndDateChange(e.target.value)}
          disabled={disabled}
          className="date-input"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={status || ''}
          onChange={handleStatusChange}
          disabled={disabled}
          className="status-select"
        >
          <option value="">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <Button
        onClick={onClearFilters}
        disabled={disabled}
        variant="outline"
        className="clear-button"
      >
        Clear Filters
      </Button>
    </div>
  );
};
