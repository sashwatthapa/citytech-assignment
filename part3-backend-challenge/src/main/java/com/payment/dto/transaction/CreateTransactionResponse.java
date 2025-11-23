package com.payment.dto.transaction;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public class CreateTransactionResponse {

    private String merchantId;
    private Long transactionId;

    public String getMerchantId() {
        return merchantId;
    }

    public void setMerchantId(String merchantId) {
        this.merchantId = merchantId;
    }

    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }
}
