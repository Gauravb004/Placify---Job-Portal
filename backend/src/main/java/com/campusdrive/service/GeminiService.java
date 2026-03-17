package com.campusdrive.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class GeminiService {

    // Gemini API base URL (replace with actual endpoint if different)
    private final WebClient webClient = WebClient.create("https://api.gemini.com");

    public String parseResume(String resumeText) {
        return webClient.post()
                .uri("/v1/parse") // endpoint path
                .header("Authorization", "Bearer YOUR_API_KEY") // apna Gemini API key yaha paste kar
                .bodyValue(Map.of("text", resumeText))
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
