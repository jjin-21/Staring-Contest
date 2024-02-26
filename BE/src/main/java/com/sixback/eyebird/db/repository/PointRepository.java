package com.sixback.eyebird.db.repository;

import com.sixback.eyebird.db.entity.Point;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface PointRepository extends JpaRepository<Point, Long> {

    Optional<Point> findByUserId(Long userId);

    // 상위 n개의 갯수만 가져올 예정
    List<Point> findByOrderByItemPtDesc();
    List<Point> findByOrderByClassicPtDesc();

}
