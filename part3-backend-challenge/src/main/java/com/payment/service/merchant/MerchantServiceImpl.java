package com.payment.service.merchant;

import com.payment.dto.Pagination;
import com.payment.dto.merchant.*;
import com.payment.entity.Merchant;
import com.payment.repository.MerchantRepository;
import io.micronaut.data.model.Page;
import io.micronaut.data.model.Pageable;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Singleton
public class MerchantServiceImpl implements MerchantService{

    private final MerchantRepository merchantRepository;

    @Inject
    public MerchantServiceImpl(MerchantRepository merchantRepository) {
        this.merchantRepository = merchantRepository;
    }

    @Override
    public Mono<MerchantListResponse> listMerchants(int page, int size) {
        return Mono.fromCallable(() -> {
            Page<Merchant> merchantPage = merchantRepository.findAll(Pageable.from(page, size));
            Pagination pagination = new Pagination(
                    merchantPage.getPageNumber(),
                    merchantPage.getSize(),
                    merchantPage.getTotalPages(),
                    merchantPage.getTotalSize()
            );
            return new MerchantListResponse(merchantPage.getContent(), pagination);
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @Override
    public Mono<MerchantDetailResponse> getMerchant(Long merchantId) {
        return Mono.fromCallable(() -> merchantRepository.findByMerchantId(merchantId))
                .flatMap(merchant -> Mono.just(new MerchantDetailResponse(merchant)))
                .onErrorResume(e -> Mono.error(new RuntimeException("Merchant not found")));
    }

    @Override
    public Mono<CreateMerchantResponse> createMerchant(CreateMerchantRequest request) {
        return Mono.fromCallable(() -> {
            Merchant merchant = new Merchant();
            merchant.setMerchantName(request.merchantName());
            merchant.setBusinessType(request.businessType());
            merchant.setWebsiteUrl(request.websiteUrl());
            merchant.setContactEmail(request.contactEmail());
            merchant.setContactPhone(request.contactPhone());
            merchant.setRegistrationNumber(request.registrationNumber());
            merchant.setCountry(request.country());
            merchant.setAddressLine1(request.addressLine1());
            merchant.setAddressLine2(request.addressLine2());
            merchant.setCity(request.city());
            merchant.setState(request.state());
            merchant.setPostalCode(request.postalCode());

            merchant.setMerchantCode("MCH-00004");
            merchant.setStatus("pending");
            merchant.setSettlementCurrency("USD");
            merchant.setSettlementCycle("daily");
            merchant.setDailyTxnLimit(BigDecimal.valueOf(10000));
            merchant.setMonthlyTxnLimit(BigDecimal.valueOf(100000));
            merchant.setCreatedAt(java.time.LocalDateTime.now());
            merchant.setUpdatedAt(java.time.LocalDateTime.now());
            merchant.setRiskLevel("low");

            Merchant saved = merchantRepository.save(merchant);
            return new CreateMerchantResponse(saved.getMerchantId(), saved.getMerchantCode(), saved.getStatus());
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @Override
    public Mono<UpdateMerchantResponse> updateMerchant(Long merchantId, UpdateMerchantRequest request) {
        return Mono.fromCallable(() -> {
            Merchant merchant = merchantRepository.findByMerchantId(merchantId);

            if (request.merchantName() != null) merchant.setMerchantName(request.merchantName());
            if (request.contactEmail() != null) merchant.setContactEmail(request.contactEmail());
            if (request.contactPhone() != null) merchant.setContactPhone(request.contactPhone());
            merchant.setSettlementCycle(request.settlementCycle());
            if (request.payoutAccountNumber() != null) merchant.setPayoutAccountNumber(request.payoutAccountNumber());
            if (request.payoutBankName() != null) merchant.setPayoutBankName(request.payoutBankName());
            if (request.payoutBankCountry() != null) merchant.setPayoutBankCountry(request.payoutBankCountry());
            if (request.dailyTxnLimit() != null) merchant.setDailyTxnLimit(request.dailyTxnLimit());
            if (request.monthlyTxnLimit() != null) merchant.setMonthlyTxnLimit(request.monthlyTxnLimit());
            merchant.setStatus("active");

            merchant.setUpdatedAt(LocalDateTime.now());

            Merchant saved = merchantRepository.update(merchant);
            return new UpdateMerchantResponse(saved.getMerchantId(), saved.getStatus(), "Merchant updated successfully");
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @Override
    public Mono<Void> deactivateMerchant(Long merchantId) {
        return Mono.fromRunnable(() -> {
            Merchant merchant = merchantRepository.findByMerchantId(merchantId);
            merchant.setStatus("inactive");
            merchant.setUpdatedAt(LocalDateTime.now());
            merchantRepository.update(merchant);
        }).subscribeOn(Schedulers.boundedElastic()).then();

    }
}
