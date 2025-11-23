package com.payment.controller;

import com.payment.dto.RestResponse;
import com.payment.dto.merchant.CreateMerchantRequest;
import com.payment.dto.merchant.UpdateMerchantRequest;
import com.payment.service.merchant.MerchantService;
import io.micronaut.http.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Mono;

@Controller("/api/v1/merchants")
@Tag(name = "Merchants")
public class MerchantController {

    private static final Logger LOG = LoggerFactory.getLogger(MerchantController.class);

    private final MerchantService merchantService;

    @Inject
    public MerchantController(MerchantService merchantService) {
        this.merchantService = merchantService;
    }

    @Get
    public Mono<RestResponse> listMerchants(
            @QueryValue(defaultValue = "0") int page,
            @QueryValue(defaultValue = "10") int size) {
        return merchantService.listMerchants(page, size)
                .map(RestResponse::success)
                .onErrorResume(error ->{
                    LOG.error("Failed to fetch merchant list");
                    return Mono.just(RestResponse.error(error.getMessage()));
                });
    }

    @Get("/{id}")
    public Mono<RestResponse> getMerchant(@PathVariable Long id) {
        return merchantService.getMerchant(id)
                .map(RestResponse::success)
                .onErrorResume(error-> {
                    LOG.error("Failed to fetch merchant {}", id);
                    return Mono.just(RestResponse.error(error.getMessage()));
                });
    }

    @Post
    public Mono<RestResponse> createMerchant(@Body @Valid CreateMerchantRequest request) {
        return merchantService.createMerchant(request)
                .map(RestResponse::success)
                .onErrorResume(error -> {
                    LOG.error("Failed to create merchant");
                    return Mono.just(RestResponse.error(error.getMessage()));
                });
    }

    @Put("/{id}")
    public Mono<RestResponse> updateMerchant(
            @PathVariable Long id,
            @Body @Valid UpdateMerchantRequest request) {
        return merchantService.updateMerchant(id, request)
                .map(RestResponse::success)
                .onErrorResume(error -> {
                    LOG.error("Failed to update merchant {}", id);
                    return Mono.just(RestResponse.error(error.getMessage()));
                });
    }

    @Delete("/{id}")
    public Mono<RestResponse> deactivateMerchant(@PathVariable Long id) {
        return merchantService.deactivateMerchant(id)
                .then(Mono.just(RestResponse.success()))
                .onErrorResume(error -> {
                    LOG.error("Failed to deactivate merchant {}", id);
                    return Mono.just(RestResponse.error(error.getMessage()));
                });
    }

}
