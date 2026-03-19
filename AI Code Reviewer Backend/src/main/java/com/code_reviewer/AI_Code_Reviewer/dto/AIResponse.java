package com.code_reviewer.AI_Code_Reviewer.dto;

public class AIResponse {
    private String review;

    public AIResponse(String review) {
        this.review = review;
    }

    public String getReview() {
        return review;
    }
}
