package com.payment.service.merchant;

import com.payment.dto.merchant.*;
import reactor.core.publisher.Mono;

public interface MerchantService {

    Mono<MerchantListResponse> listMerchants(int page, int size);

    Mono<MerchantDetailResponse> getMerchant(Long merchantId);

    Mono<CreateMerchantResponse> createMerchant(CreateMerchantRequest request);

    Mono<UpdateMerchantResponse> updateMerchant(Long merchantId, UpdateMerchantRequest request);

    Mono<Void> deactivateMerchant(Long merchantId);
}
