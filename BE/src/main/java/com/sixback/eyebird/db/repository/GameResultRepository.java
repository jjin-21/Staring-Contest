package com.sixback.eyebird.db.repository;

import com.sixback.eyebird.db.entity.GameResult;
import com.sixback.eyebird.db.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GameResultRepository extends JpaRepository<GameResult, Long> {

}
