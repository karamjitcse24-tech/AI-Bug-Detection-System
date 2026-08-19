package com.example.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.*;

@Service
public class AiService {

    // API key is loaded from application.properties
    // which gets the value from Windows environment variable
    @Value("${gemini.api.key}")
    private String apiKey;

    public String analyzeBug(String description) {

        String url =
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> part = new HashMap<>();

        part.put(
                "text",
                "Analyze the following software bug.\n\n" +
                        "Bug Description: " + description + "\n\n" +
                        "Give the response in exactly this format:\n" +
                        "Severity: Low, Medium, or High\n" +
                        "Reason: Explain briefly why this severity was selected.\n" +
                        "Recommendation: Give one practical suggestion to fix or investigate the bug.\n\n" +
                        "Keep the response short and easy to understand."
        );

        Map<String, Object> content = new HashMap<>();

        content.put("parts", List.of(part));

        Map<String, Object> body = new HashMap<>();

        body.put("contents", List.of(content));

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_JSON);

        // Use API key from environment variable
        headers.set("x-goog-api-key", apiKey);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

        try {

            ResponseEntity<Map> response =
                    restTemplate.postForEntity(
                            url,
                            request,
                            Map.class
                    );

            System.out.println(
                    "GEMINI RESPONSE = " +
                            response.getBody()
            );

            Map data = response.getBody();

            if (data == null) {

                return "No response from Gemini";
            }

            if (!data.containsKey("candidates")) {

                return "Gemini returned no candidates";
            }

            List candidates =
                    (List) data.get("candidates");

            if (candidates == null ||
                    candidates.isEmpty()) {

                return "Empty Gemini response";
            }

            Map firstCandidate =
                    (Map) candidates.get(0);

            Map contentResponse =
                    (Map) firstCandidate.get("content");

            if (contentResponse == null) {

                return "No content in Gemini response";
            }

            List parts =
                    (List) contentResponse.get("parts");

            if (parts == null ||
                    parts.isEmpty()) {

                return "No text in Gemini response";
            }

            Map firstPart =
                    (Map) parts.get(0);

            Object text =
                    firstPart.get("text");

            if (text == null) {

                return "No AI text returned";
            }

            return text.toString().trim();

        } catch (Exception e) {

            System.out.println(
                    "========== GEMINI ERROR =========="
            );

            e.printStackTrace();

            System.out.println(
                    "==================================="
            );

            return "Error analyzing bug";
        }
    }
}