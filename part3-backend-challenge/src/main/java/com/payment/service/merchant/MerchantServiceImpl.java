package com.payment.service.merchant;

import com.payment.dto.Pagination;
import com.payment.dto.merchant.*;
import com.payment.entity.Merchant;
import com.payment.repository.MerchantRepository;
import io.micronaut.data.model.Pageable;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Singleton
public class MerchantServiceImpl implements MerchantService {

    private final MerchantRepository merchantRepository;

    @Inject
    public MerchantServiceImpl(MerchantRepository merchantRepository) {
        this.merchantRepository = merchantRepository;
    }

    @Override
    public Mono<MerchantListResponse> listMerchants(int page, int size) {
        return merchantRepository.findAll(Pageable.from(page, size))
                .map(merchantPage -> {
                    Pagination pagination = new Pagination(
                            merchantPage.getPageNumber(),
                            merchantPage.getSize(),
                            merchantPage.getTotalPages(),
                            merchantPage.getTotalSize()
                    );
                    return new MerchantListResponse(merchantPage.getContent(), pagination);
                });
    }

    @Override
    public Mono<MerchantDetailResponse> getMerchant(Long merchantId) {
        return merchantRepository.findByMerchantId(merchantId)
                .flatMap(merchant -> Mono.just(new MerchantDetailResponse(merchant)))
                .onErrorResume(e -> Mono.error(new RuntimeException("Merchant not found")));
    }

    @Override
    public Mono<CreateMerchantResponse> createMerchant(CreateMerchantRequest request) {
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

        merchant.setStatus("pending");
        merchant.setSettlementCurrency("USD");
        merchant.setSettlementCycle("daily");
        merchant.setDailyTxnLimit(BigDecimal.valueOf(10000));
        merchant.setMonthlyTxnLimit(BigDecimal.valueOf(100000));
        merchant.setCreatedAt(java.time.LocalDateTime.now());
        merchant.setUpdatedAt(java.time.LocalDateTime.now());
        merchant.setRiskLevel("low");

        return merchantRepository.save(merchant)
                .map(saved ->
                        new CreateMerchantResponse(saved.getMerchantId(),
                                saved.getMerchantCode(),
                                saved.getStatus()));
    }

    @Override
    public Mono<UpdateMerchantResponse> updateMerchant(Long merchantId, UpdateMerchantRequest request) {
        return merchantRepository.findByMerchantId(merchantId)
                .flatMap(merchant -> {
                    if (request.merchantName() != null) merchant.setMerchantName(request.merchantName());
                    if (request.contactEmail() != null) merchant.setContactEmail(request.contactEmail());
                    if (request.contactPhone() != null) merchant.setContactPhone(request.contactPhone());
                    merchant.setSettlementCycle(request.settlementCycle());
                    if (request.payoutAccountNumber() != null)
                        merchant.setPayoutAccountNumber(request.payoutAccountNumber());
                    if (request.payoutBankName() != null) merchant.setPayoutBankName(request.payoutBankName());
                    if (request.payoutBankCountry() != null) merchant.setPayoutBankCountry(request.payoutBankCountry());
                    if (request.dailyTxnLimit() != null) merchant.setDailyTxnLimit(request.dailyTxnLimit());
                    if (request.monthlyTxnLimit() != null) merchant.setMonthlyTxnLimit(request.monthlyTxnLimit());
                    merchant.setStatus("active");

                    merchant.setUpdatedAt(LocalDateTime.now());

                    return merchantRepository.update(merchant)
                            .map(saved -> new UpdateMerchantResponse(saved.getMerchantId(), saved.getStatus(), "Merchant updated successfully"));
                });
    }

    @Override
    public Mono<Void> deactivateMerchant(Long merchantId) {
        return merchantRepository.findByMerchantId(merchantId)
                .flatMap(merchant -> {
                    merchant.setStatus("inactive");
                    merchant.setUpdatedAt(LocalDateTime.now());
                    return merchantRepository.update(merchant);
                }).then();
    }
}
