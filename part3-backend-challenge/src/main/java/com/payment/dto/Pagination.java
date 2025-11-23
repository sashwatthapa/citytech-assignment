package com.payment.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record Pagination(
        int page,
        int pageSize,
        int totalPages,
        Long totalElements
) {
}
