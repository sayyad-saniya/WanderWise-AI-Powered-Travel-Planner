package com.wanderwise.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wanderwise.model.WeatherDay;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Uses OpenWeatherMap's free Geocoding + 5 day / 3 hour Forecast APIs (available on the
 * free tier, unlike One Call 3.0) to build a best-effort daily forecast for the trip dates.
 * Forecasts beyond ~5 days out are simply omitted; the frontend shows what is available.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class WeatherService {

    private final WebClient openWeatherWebClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${openweather.api.key:}")
    private String apiKey;

    public List<WeatherDay> getForecast(String destination, LocalDate startDate, LocalDate endDate) {
        if (apiKey == null || apiKey.isBlank()) {
            log.info("No OpenWeatherMap API key configured; skipping weather forecast.");
            return List.of();
        }

        try {
            double[] coords = geocode(destination);
            if (coords == null) {
                return List.of();
            }
            return fetchDailyForecast(coords[0], coords[1], startDate, endDate);
        } catch (Exception e) {
            log.warn("Weather forecast lookup failed for '{}': {}", destination, e.getMessage());
            return List.of();
        }
    }

    private double[] geocode(String destination) {
        JsonNode results = openWeatherWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/geo/1.0/direct")
                        .queryParam("q", destination)
                        .queryParam("limit", 1)
                        .queryParam("appid", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        if (results == null || !results.isArray() || results.isEmpty()) {
            log.info("Could not geocode destination '{}'", destination);
            return null;
        }
        JsonNode first = results.get(0);
        return new double[]{first.path("lat").asDouble(), first.path("lon").asDouble()};
    }

    private List<WeatherDay> fetchDailyForecast(double lat, double lon, LocalDate startDate, LocalDate endDate) {
        JsonNode response = openWeatherWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/data/2.5/forecast")
                        .queryParam("lat", lat)
                        .queryParam("lon", lon)
                        .queryParam("units", "metric")
                        .queryParam("appid", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        if (response == null) {
            return List.of();
        }

        // Group the 3-hourly entries into daily min/max + a representative condition.
        Map<LocalDate, List<JsonNode>> byDate = new LinkedHashMap<>();
        for (JsonNode entry : response.path("list")) {
            long unixSeconds = entry.path("dt").asLong();
            LocalDate date = Instant.ofEpochSecond(unixSeconds).atZone(ZoneOffset.UTC).toLocalDate();
            if (date.isBefore(startDate) || date.isAfter(endDate)) {
                continue;
            }
            byDate.computeIfAbsent(date, d -> new ArrayList<>()).add(entry);
        }

        List<WeatherDay> forecast = new ArrayList<>();
        for (Map.Entry<LocalDate, List<JsonNode>> e : byDate.entrySet()) {
            double min = Double.MAX_VALUE;
            double max = -Double.MAX_VALUE;
            String condition = "Clear";
            String icon = "01d";
            // prefer the entry closest to midday for the "representative" condition/icon
            JsonNode middayEntry = null;
            long bestDiff = Long.MAX_VALUE;

            for (JsonNode entry : e.getValue()) {
                double tempMin = entry.path("main").path("temp_min").asDouble();
                double tempMax = entry.path("main").path("temp_max").asDouble();
                min = Math.min(min, tempMin);
                max = Math.max(max, tempMax);

                long hour = Instant.ofEpochSecond(entry.path("dt").asLong()).atZone(ZoneOffset.UTC).getHour();
                long diff = Math.abs(hour - 12);
                if (diff < bestDiff) {
                    bestDiff = diff;
                    middayEntry = entry;
                }
            }
            if (middayEntry != null) {
                JsonNode weatherArr = middayEntry.path("weather");
                if (weatherArr.isArray() && !weatherArr.isEmpty()) {
                    condition = weatherArr.get(0).path("main").asText("Clear");
                    icon = weatherArr.get(0).path("icon").asText("01d");
                }
            }

            forecast.add(WeatherDay.builder()
                    .date(e.getKey())
                    .tempMinC(round1(min))
                    .tempMaxC(round1(max))
                    .condition(condition)
                    .icon(icon)
                    .build());
        }
        return forecast;
    }

    private double round1(double v) {
        return Math.round(v * 10.0) / 10.0;
    }
}
