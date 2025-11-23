package com.payment.service.transaction;

import com.payment.dto.transaction.CreateTransactionResponse;
import com.payment.dto.transaction.TransactionRequest;
import com.payment.dto.transaction.TransactionResponse;
import reactor.core.publisher.Mono;

import java.time.LocalDate;

public interface TransactionService {

    Mono<TransactionResponse> getTransactions(String merchantId, int page, int size, LocalDate startDate, LocalDate endDate, String status);

    Mono<CreateTransactionResponse> createTransaction(TransactionRequest request);
}
