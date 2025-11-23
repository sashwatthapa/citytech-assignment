package com.payment.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public class RestResponse {

    String code;
    String message;
    Object data;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public static RestResponse success() {
        RestResponse restResponse = new RestResponse();
        restResponse.setCode("200");
        restResponse.setMessage("Success");
        return restResponse;
    }

    public static RestResponse error(String message) {
        RestResponse restResponse = new RestResponse();
        restResponse.setCode("500");
        restResponse.setMessage(message);
        return restResponse;
    }

    public static RestResponse success(Object data) {
        RestResponse restResponse = success();
        restResponse.setData(data);
        return restResponse;
    }
}
