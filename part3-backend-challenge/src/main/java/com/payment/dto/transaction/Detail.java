package com.payment.dto.transaction;

import io.micronaut.serde.annotation.Serdeable;

import java.math.BigDecimal;

@Serdeable
public record Detail(

        Long detailId,
        String type,
        BigDecimal amount,
        String description
) {
}
