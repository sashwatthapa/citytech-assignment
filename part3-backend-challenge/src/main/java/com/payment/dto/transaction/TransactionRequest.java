package com.payment.dto.transaction;

import com.payment.dto.Request;
import com.payment.entity.TransactionMaster;
import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public class TransactionRequest implements Request {

    private String merchantId;
    private TransactionMaster transaction;

    public String getMerchantId() {
        return merchantId;
    }

    public void setMerchantId(String merchantId) {
        this.merchantId = merchantId;
    }

    public TransactionMaster getTransaction() {
        return transaction;
    }

    public void setTransaction(TransactionMaster transaction) {
        this.transaction = transaction;
    }
}
