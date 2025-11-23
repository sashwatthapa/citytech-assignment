package com.payment.controller;

import com.payment.dto.RestResponse;
import com.payment.dto.transaction.TransactionRequest;
import com.payment.entity.TransactionMaster;
import com.payment.service.transaction.TransactionService;
import com.payment.service.transaction.TransactionServiceImpl;
import io.micronaut.http.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.inject.Inject;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.util.Optional;

/**
 * 1. Create TransactionService and inject it
 * 2. Implement actual database queries
 * 3. Add proper pagination
 * 4. Add date filtering
 * 5. Add status filtering
 * 6. Return proper TransactionResponse DTOs
 * 7. Add error handling
 */
@Controller("/api/v1/merchant-transaction")
@Tag(name = "Transactions")
public class TransactionController {

    private static final Logger LOG = LoggerFactory.getLogger(TransactionController.class);

    private final TransactionService transactionService;

    @Inject
    public TransactionController(TransactionServiceImpl transactionService) {
        this.transactionService = transactionService;
    }

    @Get("/{merchantId}/transactions")
    @Operation(
            summary = "Get merchant transactions",
            description = "Returns paginated list of transactions for a merchant. TODO: Implement proper pagination, filtering, and database queries."
    )
    public Mono<RestResponse> getTransactions(
            @PathVariable String merchantId,
            @QueryValue(defaultValue = "0") @Min(0) int page,
            @QueryValue(defaultValue = "20") @Min(1) @Max(100) int size,
            @QueryValue Optional<String> startDate,
            @QueryValue Optional<String> endDate,
            @QueryValue Optional<String> status
    ) {
        LocalDate start;
        LocalDate end;
        try {
            start = startDate.map(LocalDate::parse).orElse(LocalDate.now().minusMonths(1));
            end = endDate.map(LocalDate::parse).orElse(LocalDate.now());
        } catch (Exception e) {
            LOG.error("Invalid query parameter for dates", e);
            return Mono.just(RestResponse.error("Invalid date format. Expected yyyy-MM-dd"));
        }

        return transactionService.getTransactions(merchantId, page, size, start, end, status.orElse("completed"))
                .map(RestResponse::success)
                .onErrorResume(error -> {
                    LOG.error("Failed to get merchant transactions");
                    return Mono.just(RestResponse.error(error.getMessage()));
                });
    }

    @Post("/{merchantId}/transactions")
    @Operation(
        summary = "Create new transaction",
        description = "Creates a new transaction for a merchant. TODO: Add validation, error handling, and business logic."
    )
    public Mono<RestResponse> createTransaction(
            @PathVariable String merchantId,
            @Body TransactionMaster transaction
    ) {
        // TODO: Add validation
        // TODO: Add error handling
        // TODO: Move to service layer
        var request = new TransactionRequest();
        request.setMerchantId(merchantId);
        request.setTransaction(transaction);
        return transactionService.createTransaction(request)
                .map(RestResponse::success)
                .onErrorResume(error -> {
                    LOG.error("Failed to create merchant transactions");
                    return Mono.just(RestResponse.error(error.getMessage()));
                });
    }
}
