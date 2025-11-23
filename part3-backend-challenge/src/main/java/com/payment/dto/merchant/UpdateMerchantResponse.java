package com.payment.dto.merchant;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record UpdateMerchantResponse(
        Long merchantId,
        String status,
        String message
) {
}
