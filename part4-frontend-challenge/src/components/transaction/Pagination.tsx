import React from 'react';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  disabled = false,
}) => {
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0);

      if (currentPage > 2) {
        pages.push('...');
      }

      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push('...');
      }

      pages.push(totalPages - 1);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{' '}
        <strong>{totalElements}</strong> transactions
      </div>

      <div className="pagination-controls">
        <button
          className="nav-button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={disabled || currentPage === 0}
        >
          <span>←</span>
          <span>Previous</span>
        </button>

        <div className="page-numbers">
          {pageNumbers.map((page, index) =>
            typeof page === 'number' ? (
              <button
                key={page}
                className={`page-button ${page === currentPage ? 'active' : ''}`}
                onClick={() => onPageChange(page)}
                disabled={disabled}
              >
                {page + 1}
              </button>
            ) : (
              <span key={`ellipsis-${index}`} className="ellipsis">
                {page}
              </span>
            )
          )}
        </div>

        <button
          className="nav-button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={disabled || currentPage >= totalPages - 1}
        >
          <span>Next</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
