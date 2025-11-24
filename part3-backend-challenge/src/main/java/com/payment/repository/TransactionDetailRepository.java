package com.payment.repository;

import com.payment.entity.TransactionDetail;
import io.micronaut.data.annotation.Query;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.reactive.ReactorCrudRepository;
import reactor.core.publisher.Flux;

import java.util.List;

/**
 * Repository for TransactionDetail entities.
 */
@Repository
@JdbcRepository(dialect = Dialect.POSTGRES)
public interface TransactionDetailRepository extends ReactorCrudRepository<TransactionDetail, Long> {

    List<TransactionDetail> findByMasterTxnId(Long masterTxnId);

    List<TransactionDetail> findByMasterTxnIdInList(List<Long> masterTxnIds);

    @Query("""
            SELECT *
            FROM operators.transaction_details td
            WHERE td.master_txn_id IN (:masterTxnIds);
            """)
    Flux<TransactionDetail> findDetailsByMasterTxnIds(List<Long> masterTxnIds);
}
