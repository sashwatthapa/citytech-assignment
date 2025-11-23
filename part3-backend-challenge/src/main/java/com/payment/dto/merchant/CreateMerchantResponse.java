package com.payment.dto.merchant;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record CreateMerchantResponse(
        Long merchantId,
        String merchantCode,
        String status
) {
}
