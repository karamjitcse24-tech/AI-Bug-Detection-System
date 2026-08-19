package com.example.backend.controller;

import com.example.backend.service.AiService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/analyze")
    public Map<String, String> analyze(@RequestBody Map<String, String> request) {

        String description = request.get("description");

        String result = aiService.analyzeBug(description);

        return Map.of("result", result);
    }
}