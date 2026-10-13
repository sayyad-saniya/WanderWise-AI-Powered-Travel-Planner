package com.wanderwise.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wanderwise.dto.TripRequest;
import com.wanderwise.exception.ExternalServiceException;
import com.wanderwise.model.Activity;
import com.wanderwise.model.BudgetEstimate;
import com.wanderwise.model.Day;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Talks to the OpenAI Chat Completions API to turn a trip brief into a
 * day-by-day itinerary plus a rough budget estimate. The model is asked to
 * reply with strict JSON so it can be parsed straight into our domain model.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OpenAiService {

    private final WebClient openAiWebClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${openai.model:gpt-4o-mini}")
    private String model;

    public GeneratedPlan generateItineraryAndBudget(TripRequest request) {
        long numDays = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        String prompt = buildPrompt(request, numDays);

        Map<String, Object> body = Map.of(
                "model", model,
                "temperature", 0.7,
                "response_format", Map.of("type", "json_object"),
                "messages", List.of(
                        Map.of("role", "system", "content", SYSTEM_PROMPT),
                        Map.of("role", "user", "content", prompt)
                )
        );

        try {
            String raw = openAiWebClient.post()
                    .uri("/chat/completions")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode root = objectMapper.readTree(raw);
            String content = root.at("/choices/0/message/content").asText();
            return parsePlan(content, request, numDays);
        } catch (Exception e) {
            log.warn("OpenAI itinerary generation failed, falling back to template plan: {}", e.getMessage());
            return fallbackPlan(request, numDays);
        }
    }

    private String buildPrompt(TripRequest request, long numDays) {
        String preferences = request.getPreferences() == null || request.getPreferences().isEmpty()
                ? "general sightseeing"
                : String.join(", ", request.getPreferences());

        return """
                Plan a %d-day trip to %s for %d traveler(s).
                Budget level: %s.
                Traveler interests: %s.
                Extra notes from the traveler: %s

                Respond with a JSON object shaped exactly like:
                {
                  "days": [
                    {
                      "dayNumber": 1,
                      "activities": [
                        {"time": "09:00", "title": "...", "description": "...", "category": "sightseeing|food|transport|leisure|culture", "estimatedCost": 25.0}
                      ]
                    }
                  ],
                  "budget": {
                    "accommodation": 0.0,
                    "food": 0.0,
                    "activities": 0.0,
                    "transport": 0.0,
                    "currency": "USD",
                    "notes": "one short sentence on how the estimate was derived"
                  }
                }

                Provide 3-5 activities per day covering morning, afternoon and evening.
                Budget figures are TOTALS for the whole trip and all travelers, in USD, and should be realistic for the destination and budget level.
                """.formatted(numDays, request.getDestination(), request.getTravelers(),
                request.getBudgetLevel(), preferences,
                request.getNotes() == null || request.getNotes().isBlank() ? "none" : request.getNotes());
    }

    private GeneratedPlan parsePlan(String content, TripRequest request, long numDays) throws Exception {
        JsonNode plan = objectMapper.readTree(content);
        List<Day> days = new ArrayList<>();

        JsonNode daysNode = plan.path("days");
        int dayIndex = 0;
        for (JsonNode dayNode : daysNode) {
            dayIndex++;
            LocalDate date = request.getStartDate().plusDays(dayIndex - 1L);
            List<Activity> activities = new ArrayList<>();
            int order = 0;
            for (JsonNode actNode : dayNode.path("activities")) {
                activities.add(Activity.builder()
                        .id(UUID.randomUUID().toString())
                        .time(actNode.path("time").asText("09:00"))
                        .title(actNode.path("title").asText("Explore " + request.getDestination()))
                        .description(actNode.path("description").asText(""))
                        .category(actNode.path("category").asText("sightseeing"))
                        .estimatedCost(actNode.path("estimatedCost").asDouble(0))
                        .orderIndex(order++)
                        .build());
            }
            days.add(Day.builder().dayNumber(dayIndex).date(date).activities(activities).build());
        }

        if (days.isEmpty()) {
            return fallbackPlan(request, numDays);
        }

        JsonNode budgetNode = plan.path("budget");
        double accommodation = budgetNode.path("accommodation").asDouble(0);
        double food = budgetNode.path("food").asDouble(0);
        double activitiesCost = budgetNode.path("activities").asDouble(0);
        double transport = budgetNode.path("transport").asDouble(0);

        BudgetEstimate budget = BudgetEstimate.builder()
                .accommodation(accommodation)
                .food(food)
                .activities(activitiesCost)
                .transport(transport)
                .total(accommodation + food + activitiesCost + transport)
                .currency(budgetNode.path("currency").asText("USD"))
                .notes(budgetNode.path("notes").asText("AI-generated estimate based on destination and budget level."))
                .build();

        return new GeneratedPlan(days, budget);
    }

    /** Deterministic offline fallback so the app still works without an OpenAI key or if the call fails. */
    private GeneratedPlan fallbackPlan(TripRequest request, long numDays) {
        List<Day> days = new ArrayList<>();
        String[] slots = {"09:00", "13:00", "16:00", "19:30"};
        String[] categories = {"sightseeing", "food", "leisure", "culture"};

        for (int d = 1; d <= numDays; d++) {
            List<Activity> activities = new ArrayList<>();
            for (int i = 0; i < slots.length; i++) {
                activities.add(Activity.builder()
                        .id(UUID.randomUUID().toString())
                        .time(slots[i])
                        .title("Explore " + request.getDestination() + " — stop " + (i + 1))
                        .description("A suggested " + categories[i] + " activity for day " + d + ".")
                        .category(categories[i])
                        .estimatedCost(20.0)
                        .orderIndex(i)
                        .build());
            }
            days.add(Day.builder()
                    .dayNumber(d)
                    .date(request.getStartDate().plusDays(d - 1L))
                    .activities(activities)
                    .build());
        }

        double perDayMultiplier = switch (request.getBudgetLevel() == null ? "MODERATE" : request.getBudgetLevel().toUpperCase()) {
            case "BUDGET" -> 60.0;
            case "LUXURY" -> 350.0;
            default -> 150.0;
        };
        double total = perDayMultiplier * numDays * Math.max(1, request.getTravelers());

        BudgetEstimate budget = BudgetEstimate.builder()
                .accommodation(total * 0.45)
                .food(total * 0.25)
                .activities(total * 0.20)
                .transport(total * 0.10)
                .total(total)
                .currency("USD")
                .notes("Estimated offline using a per-day average for the selected budget level.")
                .build();

        return new GeneratedPlan(days, budget);
    }

    private static final String SYSTEM_PROMPT = """
            You are a meticulous travel planner. You always reply with a single valid JSON object
            and nothing else - no markdown fences, no commentary.
            """;

    public record GeneratedPlan(List<Day> days, BudgetEstimate budget) {
    }
}
