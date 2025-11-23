package com.payment.dto.transaction;

import io.micronaut.serde.annotation.Serdeable;

import java.math.BigDecimal;

@Serdeable
public record StatusSummary(
        String status,
        Long txnCount,
        BigDecimal totalAmount
) {
}
