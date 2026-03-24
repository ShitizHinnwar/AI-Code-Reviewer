package com.code_reviewer.AI_Code_Reviewer.service;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

@Service
public class AIService {

    @Value("${ai.api.url}")
    private String apiUrl;

    @Value("${ai.api.key}")
    private String apiKey;

    public String reviewCode(String code) {

        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String safeCode = code.replace("\"", "\\\"");

            String prompt = "Review the following code and suggest improvements:\n" + safeCode;

            String body = "{ \"contents\": [{\"parts\":[{\"text\":\"" + prompt + "\"}]}]}";

            HttpEntity<String> request = new HttpEntity<>(body, headers);

            String url = apiUrl + "?key=" + apiKey;

            ResponseEntity<String> response =
                    restTemplate.postForEntity(url, request, String.class);

            String responseBody = response.getBody();

            // 🔥 SAFETY CHECK
            if (responseBody == null || !responseBody.trim().startsWith("{")) {
                return "Invalid API response (not JSON): " + responseBody;
            }

            JSONObject json = new JSONObject(responseBody);

            return json
                    .getJSONArray("candidates")
                    .getJSONObject(0)
                    .getJSONObject("content")
                    .getJSONArray("parts")
                    .getJSONObject(0)
                    .getString("text");

        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
}