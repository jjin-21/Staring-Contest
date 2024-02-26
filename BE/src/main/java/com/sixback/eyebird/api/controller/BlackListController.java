package com.sixback.eyebird.api.controller;

import com.sixback.eyebird.api.dto.BlackListDto;
import com.sixback.eyebird.api.service.BlackListService;
import com.sixback.eyebird.api.service.RoomService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@NoArgsConstructor
@RequestMapping("/api/blacklist")
@Tag(name = "BlackList")
public class BlackListController {
    @Autowired
    BlackListService blackListService;
@PostMapping()
    public boolean addBlackList(@RequestBody BlackListDto blacklist){
        blackListService.addBlackList(blacklist);

        return true;
    }

}
