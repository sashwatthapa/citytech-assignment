package com.payment.dto.merchant;

import com.payment.dto.Pagination;
import com.payment.entity.Merchant;
import io.micronaut.serde.annotation.Serdeable;

import java.util.List;

@Serdeable
public record MerchantListResponse(
        List<Merchant> merchants,
        Pagination pagination
) {
}
