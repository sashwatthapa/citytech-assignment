package com.payment.repository;

import com.payment.entity.Merchant;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.Page;
import io.micronaut.data.model.Pageable;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.reactive.ReactorCrudRepository;
import reactor.core.publisher.Mono;

@Repository
@JdbcRepository(dialect = Dialect.POSTGRES)
public interface MerchantRepository extends ReactorCrudRepository<Merchant, Long> {

    Mono<Merchant> findByMerchantId(Long merchantId);

    Mono<Page<Merchant>> findAll(Pageable pageable);
}
