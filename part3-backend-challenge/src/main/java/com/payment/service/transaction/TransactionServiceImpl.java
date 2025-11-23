package com.payment.service.transaction;

import com.payment.dto.Pagination;
import com.payment.dto.transaction.*;
import com.payment.entity.TransactionDetail;
import com.payment.entity.TransactionMaster;
import com.payment.repository.TransactionRepository;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.*;
import java.util.stream.Collectors;

@Singleton
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;

    @Inject
    public TransactionServiceImpl(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    public Mono<TransactionResponse> getTransactions(String merchantId, int page, int size, LocalDate startDate, LocalDate endDate, String status) {
        Instant start = startDate.atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant end = endDate.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();
        long offset = (long) page * size;

        Mono<List<TransactionMaster>> txnMono = transactionRepository.findByMerchantIdAndDateRange(merchantId,
                start, end, status, size, offset)
                .collectList();

        Mono<Long> countMono = transactionRepository.countByMerchantIdAndDateRange(merchantId, start, end, status);

        Mono<List<StatusSummary>> summaryMono = transactionRepository.getStatusSummary(merchantId, start, end, status)
                .collectList();

        return Mono.zip(txnMono, countMono, summaryMono)
                .flatMap(tuple -> {
                    List<TransactionMaster> masters = tuple.getT1();
                    Long totalElements = tuple.getT2();
                    List<StatusSummary> summaries = tuple.getT3();

                    if (masters.isEmpty()) {
                        return Mono.just(buildEmptyResponse(merchantId, start, end, page, size, summaries));
                    }

                    List<Long> masterIds = masters.stream()
                            .map(TransactionMaster::getTxnId)
                            .toList();

                    return transactionRepository.findDetailsByMasterTxnIds(masterIds)
                            .collectList()
                            .map(details -> {
                                Map<Long, List<Detail>> detailsMap = details.stream()
                                        .collect(Collectors.groupingBy(
                                                TransactionDetail::getMasterTxnId,
                                                Collectors.mapping(this::mapToDetail, Collectors.toList())
                                        ));

                                List<Transactions> txn = masters.stream()
                                        .map(tm -> mapToTransaction(tm, detailsMap.getOrDefault(tm.getTxnId(), Collections.emptyList())))
                                        .collect(Collectors.toList());

                                return buildResponse(merchantId, start, end, page, size, totalElements, txn, summaries);
                            });
                });
    }

    private TransactionResponse buildResponse(String merchantId, Instant start, Instant end, int page, int size,
                                              Long totalElements, List<Transactions> txn, List<StatusSummary> summaries) {
        TransactionResponse response = new TransactionResponse();
        response.setMerchantId(merchantId);
        response.setDateRange(new TransactionResponse.DateRange(start, end));

        int totalPages = (int) Math.ceil((double) totalElements / size);
        response.setPagination(new Pagination(page, size, totalPages, totalElements));

        response.setTransactions(txn);
        response.setSummary(calculateSummary(summaries));
        return response;
    }

    private TransactionResponse buildEmptyResponse(String merchantId, Instant start, Instant end, int page, int size, List<StatusSummary> summaries) {
        TransactionResponse response = new TransactionResponse();
        response.setMerchantId(merchantId);
        response.setDateRange(new TransactionResponse.DateRange(start, end));
        response.setPagination(new Pagination(page, size, 0, 0L));
        response.setTransactions(Collections.emptyList());
        response.setSummary(calculateSummary(summaries));
        return response;
    }

    private Summary calculateSummary(List<StatusSummary> summaries) {
        long totalCount = 0;
        BigDecimal totalAmount = BigDecimal.ZERO;
        Map<String, Long> byStatus = new HashMap<>();
        String currency = "USD";

        for (StatusSummary s : summaries) {
            totalCount += s.txnCount();
            if (s.totalAmount() != null) {
                totalAmount = totalAmount.add(s.totalAmount());
            }
            byStatus.put(s.status(), s.txnCount());
        }

        return new Summary(totalCount, totalAmount, currency, byStatus);
    }

    private Transactions mapToTransaction(TransactionMaster tm, List<Detail> details) {
        return new Transactions(
                tm.getTxnId(),
                tm.getAmount(),
                tm.getCurrency(),
                tm.getStatus(),
                tm.getCreatedAt(),
                tm.getCardType(),
                tm.getCardLast4(),
                null, // TODO: map acquirer
                null,
                details
        );
    }

    private Detail mapToDetail(TransactionDetail td) {
        return new Detail(
                td.getTxnDetailId(),
                td.getDetailType(),
                td.getAmount(),
                td.getDescription()
        );
    }

    @Override
    public Mono<CreateTransactionResponse> createTransaction(TransactionRequest request) {
        return Mono.fromCallable(() -> {
            TransactionMaster tm = request.getTransaction();
            if (tm == null) {
                throw new IllegalArgumentException("Transaction details are required");
            }

            tm.setMerchantId(request.getMerchantId());

            tm.setTxnId(null);

            Instant now = Instant.now();
            if (tm.getCreatedAt() == null) {
                tm.setCreatedAt(now);
            }
            if (tm.getLocalTxnDateTime() == null) {
                tm.setLocalTxnDateTime(now);
            }
            if (tm.getTxnDate() == null) {
                tm.setTxnDate(new java.sql.Date(now.toEpochMilli()));
            }
            if (tm.getStatus() == null) {
                tm.setStatus("PENDING");
            }

            return transactionRepository.save(tm);
        })
                .subscribeOn(Schedulers.boundedElastic())
                .map(saved -> {
                    CreateTransactionResponse response = new CreateTransactionResponse();
                    response.setMerchantId(saved.getMerchantId());
                    response.setTransactionId(saved.getTxnId());
                    return response;
                });
    }
}
