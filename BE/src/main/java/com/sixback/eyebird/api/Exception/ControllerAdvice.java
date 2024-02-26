package com.sixback.eyebird.api.Exception;


import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Date;

@RestControllerAdvice
@Slf4j
public class ControllerAdvice {

    @ExceptionHandler(value = {IllegalArgumentException.class})
    public ResponseEntity<ErrorMessage> illegalException(IllegalArgumentException e) {
        ErrorMessage errorMessage = ErrorMessage.builder()
                .timestamp(new Date())
                .errorMessage(e.getMessage())
                .statusCode(400)
                .build();
        return ResponseEntity.status(400).body(errorMessage);
    }


    @ExceptionHandler(InsufficientAuthenticationException.class)
    public ResponseEntity<ErrorMessage> handleInsufficientAuthenticationException(InsufficientAuthenticationException e) {
        log.info(e.getClass().getName());
        ErrorMessage errorMessage = ErrorMessage.builder()
                .timestamp(new Date())
                .errorMessage(e.getMessage())
                .statusCode(401)
                .build();

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorMessage);

    }

    // DTO가 @Valid의 조건을 만족하지 않을 때
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorMessage> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        log.info(e.getClass().getName());
        ErrorMessage errorMessage = ErrorMessage.builder()
                .timestamp(new Date())
                .errorMessage(e.getMessage())
                .statusCode(400)
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorMessage> handleGlobalException(Exception e) {
        log.info(e.getClass().getName());
        ErrorMessage errorMessage = ErrorMessage.builder()
                .timestamp(new Date())
                .errorMessage(e.getMessage())
                .statusCode(404)
                .build();

        return ResponseEntity.status(404).body(errorMessage);
    }

}
