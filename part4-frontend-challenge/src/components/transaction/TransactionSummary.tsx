import './TransactionSummary.css';

interface Transaction {
  amount: number;
  currency: string;
  status: string;
}

interface TransactionSummaryProps {
  transactions: Transaction[];
  totalTransactions: number;
}

export const TransactionSummary = ({ transactions, totalTransactions }: TransactionSummaryProps) => {
  const totalAmount = transactions.reduce((sum, txn) => sum + txn.amount, 0);
  const currency = transactions[0]?.currency || 'USD';
  
  const statusCounts = transactions.reduce((acc, txn) => {
    const status = txn.status.toLowerCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="transaction-summary">
      <div className="summary-card">
        <div className="summary-label">Total Transactions</div>
        <div className="summary-value">{totalTransactions}</div>
      </div>

      <div className="summary-card">
        <div className="summary-label">Total Amount</div>
        <div className="summary-value amount">{formatAmount(totalAmount)}</div>
      </div>

      <div className="summary-card">
        <div className="summary-label">Completed</div>
        <div className="summary-value completed">{statusCounts['completed'] || 0}</div>
      </div>

      <div className="summary-card">
        <div className="summary-label">Pending</div>
        <div className="summary-value pending">{statusCounts['pending'] || 0}</div>
      </div>

      <div className="summary-card">
        <div className="summary-label">Failed</div>
        <div className="summary-value failed">{statusCounts['failed'] || 0}</div>
      </div>
    </div>
  );
};
