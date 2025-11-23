# Bug 2: Frontend - Transaction List Component - SOLUTION

```tsx
import React, { useState, useEffect, useMemo } from 'react';
import { transactionService } from '../services/transactionService';
import { Transaction } from '../types/transaction';

interface TransactionListProps {
  merchantId: string;
  refreshInterval?: number;
}

// OPTIMIZATION: Move static formatter outside component to instantiate once.
const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

export const TransactionList: React.FC<TransactionListProps> = ({ 
  merchantId, 
  refreshInterval = 5000 
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Added Loading and Error states for UX
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Flag to prevent setting state if component unmounts during fetch
    let isMounted = true;

    const fetchData = async (isBackgroundRefresh = false) => {
      try {
        // Don't show loading spinner on background refreshes
        if (!isBackgroundRefresh) setIsLoading(true);
        
        const data = await transactionService.getTransactions({
          merchantId,
          page: 1,
          size: 100
        });

        if (isMounted) {
          setTransactions(data.content);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load transactions. Retrying...');
          // Note: In a liva case, we should pause the interval on error
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Setup polling
    const intervalId = setInterval(() => {
      fetchData(true);
    }, refreshInterval);

    // CLEANUP: Clear interval and mark component as unmounted
    return () => {
      clearInterval(intervalId);
      isMounted = false;
    };
  }, [merchantId, refreshInterval]); // Correct dependencies added

  // OPTIMIZATION: Derive state. No need for a separate useEffect + useState.
  // Only recalculate if transactions or searchTerm changes.
  const filteredTransactions = useMemo(() => {
    if (!searchTerm) return transactions;
    
    const lowerTerm = searchTerm.toLowerCase();
    return transactions.filter(txn => 
      txn.merchantName.toLowerCase().includes(lowerTerm) ||
      txn.transactionId.includes(lowerTerm)
    );
  }, [transactions, searchTerm]);

  if (isLoading && transactions.length === 0) {
    return <div>Loading transactions...</div>;
  }

  if (error && transactions.length === 0) {
    return <div className="error-text">{error}</div>;
  }

  return (
    <div>
      <input 
        type="text" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search transactions..."
      />
      
      {/* Optional: Show connection issue warning while keeping stale data */}
      {error && <div style={{ color: 'orange' }}>⚠️ Connection lost, retrying...</div>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Merchant</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((txn) => (
            <tr key={txn.transactionId}>
              <td>{txn.transactionId}</td>
              <td>{txn.merchantName}</td>
              {/* Use the static constant formatter */}
              <td>{CURRENCY_FORMATTER.format(txn.totalAmount)}</td>
              <td>{txn.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

