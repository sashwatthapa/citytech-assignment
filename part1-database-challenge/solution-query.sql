SELECT tm.*,
       tm.txn_id                                 AS "tm.txnId",
       tm.local_txn_date_time AT TIME ZONE 'UTC' AS "tm.localTxnDateTime",
       (SELECT json_agg(
                       json_build_object(
                               'txn_detail_id', td.txn_detail_id,
                               'master_txn_id', td.master_txn_id,
                               'detail_type', td.detail_type,
                               'amount', td.amount,
                               'currency', td.currency,
                               'description', td.description,
                               'local_txn_date_time', td.local_txn_date_time,
                               'converted_date', td.local_txn_date_time AT TIME ZONE 'UTC'
                       )
                       ORDER BY td.local_txn_date_time DESC
               )
        FROM operators.transaction_details td
        WHERE td.master_txn_id = tm.txn_id)      AS details,
       ins.member_name                           AS member,
       iss.member_name                           AS issuer
FROM operators.transaction_master tm
         LEFT JOIN operators.members ins ON tm.gp_acquirer_id = ins.member_id
         LEFT JOIN operators.members iss ON tm.gp_issuer_id = iss.member_id
WHERE tm.txn_date > DATE '2025-11-16'
  AND tm.txn_date < DATE '2025-11-18'
ORDER BY tm.local_txn_date_time DESC;

CREATE INDEX CONCURRENTLY idx_tm_txn_date
    ON operators.transaction_master (txn_date)
    INCLUDE (local_txn_date_time);

CREATE INDEX CONCURRENTLY idx_td_master_txn_id
    ON operators.transaction_details (master_txn_id);

CREATE INDEX CONCURRENTLY idx_members_id
    ON operators.members (member_id);