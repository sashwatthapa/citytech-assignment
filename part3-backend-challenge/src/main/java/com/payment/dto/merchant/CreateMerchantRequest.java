package com.payment.dto.merchant;

import io.micronaut.serde.annotation.Serdeable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Serdeable
public record CreateMerchantRequest(
        @NotBlank String merchantName,
        @NotBlank String businessType,
        String websiteUrl,
        @NotBlank @Email String contactEmail,
        @NotBlank String contactPhone,
        String registrationNumber,
        @NotBlank String country,
        String addressLine1,
        String addressLine2,
        String city,
        String state,
        String postalCode
) {
}
