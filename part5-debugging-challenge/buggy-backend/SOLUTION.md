# Bug 1: Backend - Payment Processing Service - SOLUTION

```java
package com.payment.service;

import io.micronaut.transaction.annotation.Transactional;
import jakarta.inject.Singleton;
import jakarta.inject.Inject;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

@Singleton
public class PaymentProcessingService {

    private static final Logger logger = Logger.getLogger(PaymentProcessingService.class);

    private final PaymentRepository paymentRepository;
    private final AuditService auditService;

    @Inject
    public PaymentProcessingService(PaymentRepository paymentRepository,
                                    AuditService auditService) {
        this.paymentRepository = paymentRepository;
        this.auditService = auditService;
    }

    /**
     * Processes a batch and returns a summary object.
     * State is now local to the method execution, not the class.
     */
    public BatchResult processPaymentBatch(List<Payment> payments) {
        BigDecimal batchTotal = BigDecimal.ZERO;
        List<String> errors = new ArrayList<>();
        int successCount = 0;

        // Avoid parallelStream for DB operations. Use simple loop 
        // or a dedicated ExecutorService for high concurrency.
        for (Payment payment : payments) {
            try {
                processSinglePayment(payment);
                batchTotal = batchTotal.add(payment.getAmount());
                successCount++;
            } catch (Exception e) {
                errors.add("Payment " + payment.getId() + " failed: " + e.getMessage());
                handleFailure(payment, e);
            }
        }

        return new BatchResult(batchTotal, successCount, errors);
    }

    /**
     * Processes a single payment in its own transaction.
     * If this fails, it rolls back ONLY this payment, not the whole batch
     * (depending on business requirements).
     */
    @Transactional(Transactional.TxType.REQUIRES_NEW)
    protected void processSinglePayment(Payment payment) {
        if (payment.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Invalid amount");
        }

        payment.setStatus("COMPLETED");
        paymentRepository.update(payment);
        auditService.log("Payment " + payment.getId() + " processed");
    }

    /**
     * Persist the failure status to the database.
     */
    @Transactional(Transactional.TxType.REQUIRES_NEW)
    protected void handleFailure(Payment payment, Exception originalError) {
        try {
            payment.setStatus("FAILED");
            paymentRepository.update(payment);
            auditService.log("Payment " + payment.getId() + " failed");
        } catch (Exception e) {
            // Last resort logging if even the failure update fails
            logger.severe("CRITICAL: Could not persist failure status for " + payment.getId());
        }
    }

    // Simple DTO to return the result to the caller
    public record BatchResult(BigDecimal totalProcessed, int successCount, List<String> errors) {
    }
}
```