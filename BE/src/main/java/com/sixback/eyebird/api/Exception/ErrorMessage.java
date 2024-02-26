package com.sixback.eyebird.api.Exception;

import lombok.Builder;
import lombok.Getter;

import java.util.Date;

@Getter
@Builder
public class ErrorMessage {
    private int statusCode;
    private Date timestamp;
    private String errorMessage;
}
