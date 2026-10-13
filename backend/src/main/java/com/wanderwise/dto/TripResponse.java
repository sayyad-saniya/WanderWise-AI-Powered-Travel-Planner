package com.wanderwise.dto;

import com.wanderwise.model.BudgetEstimate;
import com.wanderwise.model.Day;
import com.wanderwise.model.Trip;
import com.wanderwise.model.WeatherDay;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripResponse {
    private String id;
    private String token;
    private String shareUrl;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private int travelers;
    private String budgetLevel;
    private List<String> preferences;
    private String notes;
    private List<Day> days;
    private List<WeatherDay> weatherForecast;
    private BudgetEstimate budgetEstimate;

    public static TripResponse from(Trip trip, String shareBaseUrl) {
        return TripResponse.builder()
                .id(trip.getId())
                .token(trip.getToken())
                .shareUrl(shareBaseUrl + "/trip/" + trip.getToken())
                .destination(trip.getDestination())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .travelers(trip.getTravelers())
                .budgetLevel(trip.getBudgetLevel())
                .preferences(trip.getPreferences())
                .notes(trip.getNotes())
                .days(trip.getDays())
                .weatherForecast(trip.getWeatherForecast())
                .budgetEstimate(trip.getBudgetEstimate())
                .build();
    }
}
