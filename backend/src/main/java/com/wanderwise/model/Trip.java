package com.wanderwise.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "trips")
public class Trip {

    @Id
    private String id;

    @Indexed(unique = true)
    private String token;              // unique share-link token

    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private int travelers;
    private String budgetLevel;        // BUDGET, MODERATE, LUXURY
    @Builder.Default
    private List<String> preferences = new ArrayList<>();
    private String notes;

    @Builder.Default
    private List<Day> days = new ArrayList<>();
    @Builder.Default
    private List<WeatherDay> weatherForecast = new ArrayList<>();
    private BudgetEstimate budgetEstimate;

    @CreatedDate
    private Instant createdAt;
    private Instant updatedAt;
}
