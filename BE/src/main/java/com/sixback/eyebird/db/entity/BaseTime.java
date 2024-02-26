package com.sixback.eyebird.db.entity;

import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@MappedSuperclass // JPA Entity들이 BaseTime을 상속할 경우, BaseTime의 필드들도 칼럼으로 인식하게 한다
@EntityListeners(AuditingEntityListener.class) // BaseTime 클래스에 Auditing 기능을 포함
public abstract class BaseTime {
    @CreatedDate
    private LocalDateTime createdDate;

    @LastModifiedDate
    private LocalDateTime modifiedDate;

}
