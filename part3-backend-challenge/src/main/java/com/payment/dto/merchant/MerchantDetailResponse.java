package com.payment.dto.merchant;

import com.payment.entity.Merchant;
import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record MerchantDetailResponse(
        Merchant merchant
) {
}
