package com.payment.dto.merchant;

import io.micronaut.serde.annotation.Serdeable;

import java.math.BigDecimal;

@Serdeable
public record UpdateMerchantRequest(
        String merchantName,
        String contactEmail,
        String contactPhone,
        String settlementCycle,
        String payoutAccountNumber,
        String payoutBankName,
        String payoutBankCountry,
        BigDecimal dailyTxnLimit,
        BigDecimal monthlyTxnLimit
) {
}
