# Bug 3: Database - Settlement Report Query - SOLUTION

```sql
SELECT 
    m.member_id,
    m.member_name,
    DATE(tm.txn_date) as settlement_date,
    SUM(tm.local_amount) as total_amount,
    COUNT(tm.txn_id) as transaction_count,
    AVG(tm.local_amount) as avg_transaction
FROM operators.members m
INNER JOIN operators.transaction_master tm ON m.member_id = tm.acq_id
WHERE tm.status = 'COMPLETED'
  AND tm.txn_date >= '2025-11-16'
  AND tm.txn_date < '2025-11-19'
GROUP BY 
    m.member_id, 
    m.member_name, 
    DATE(tm.txn_date) -- FIX: Grouping by the derived date ensures daily buckets
ORDER BY 
    settlement_date DESC, 
    total_amount DESC;
```

