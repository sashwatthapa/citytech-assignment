package com.payment.repository;

import com.payment.dto.transaction.StatusSummary;
import com.payment.entity.TransactionMaster;
import io.micronaut.data.annotation.Query;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.reactive.ReactorCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.List;

/**
 * Repository for TransactionMaster entities.
 * 
 * TODO: Add custom query methods for:
 * - Finding transactions by merchant ID with date range
 * - Paginated queries
 * - Aggregation queries for summary calculation
 * - Join queries with transaction details
 */
@Repository
@JdbcRepository(dialect = Dialect.POSTGRES)
public interface TransactionRepository extends ReactorCrudRepository<TransactionMaster, Long> {

    // Example: Basic finder method (provided)
    List<TransactionMaster> findByMerchantId(String merchantId);

    // TODO: Add your custom query methods here
    // Examples:
    // - Page<TransactionMaster> findByMerchantIdAndTxnDateBetween(...)
    // - TransactionSummary calculateSummary(...)
    // - List<TransactionWithDetails> findTransactionsWithDetails(...)
    @Query("""
            SELECT *
            FROM operators.transaction_master tm
            WHERE tm.merchant_id = :merchantId
              AND tm.created_at >= :startDate
              AND tm.created_at <= :endDate
              AND (:status IS NULL OR LOWER(tm.status) = LOWER(:status))
            ORDER BY tm.created_at DESC
            LIMIT :limit OFFSET :offset;
            """)
    Flux<TransactionMaster> findByMerchantIdAndDateRange(String merchantId, Instant startDate, Instant endDate, String status, int limit, long offset);

    @Query("""
            SELECT COUNT(*)
            FROM operators.transaction_master tm
            WHERE tm.merchant_id = :merchantId
              AND tm.txn_date >= :startDate
              AND tm.txn_date <= :endDate
              AND (:status IS NULL OR LOWER(tm.status) = LOWER(:status));
            """)
    Mono<Long> countByMerchantIdAndDateRange(String merchantId, Instant startDate, Instant endDate, String status);

    @Query("""
            SELECT status, COUNT(*) as txn_count, SUM(amount) as total_amount
            FROM operators.transaction_master tm
            WHERE tm.merchant_id = :merchantId
              AND tm.created_at >= :startDate
              AND tm.created_at <= :endDate
              AND (:status IS NULL OR LOWER(tm.status) = LOWER(:status))
            GROUP BY status;
            """)
    Flux<StatusSummary> getStatusSummary(String merchantId, Instant startDate, Instant endDate, String status);
}
