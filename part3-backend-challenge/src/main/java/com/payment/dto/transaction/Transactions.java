package com.payment.dto.transaction;

import io.micronaut.serde.annotation.Serdeable;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Serdeable
public record Transactions(

        Long txnId,
        BigDecimal amount,
        String currency,
        String status,
        Instant timestamp,
        String cardType,
        String cardLast4,
        String acquirer,
        String issuer,
        List<Detail> details
) {
}
