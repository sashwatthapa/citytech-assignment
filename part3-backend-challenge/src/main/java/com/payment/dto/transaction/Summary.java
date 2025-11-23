package com.payment.dto.transaction;

import io.micronaut.serde.annotation.Serdeable;

import java.math.BigDecimal;
import java.util.Map;

@Serdeable
public record Summary(

        Long totalTransactions,
        BigDecimal totalAmount,
        String currency,
        Map<String, Long> byStatus
) {
}
