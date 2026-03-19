package com.code_reviewer.AI_Code_Reviewer.controller;

import com.code_reviewer.AI_Code_Reviewer.dto.CodeRequest;
import com.code_reviewer.AI_Code_Reviewer.dto.AIResponse;
import com.code_reviewer.AI_Code_Reviewer.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/review")
    public AIResponse reviewCode(@RequestBody CodeRequest request) {
        String result = aiService.reviewCode(request.getCode());
        return new AIResponse(result);
    }
}
