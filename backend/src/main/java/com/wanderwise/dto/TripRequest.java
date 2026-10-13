package com.wanderwise.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class TripRequest {

    @NotBlank(message = "destination is required")
    private String destination;

    @NotNull(message = "startDate is required")
    private LocalDate startDate;

    @NotNull(message = "endDate is required")
    private LocalDate endDate;

    @Min(value = 1, message = "travelers must be at least 1")
    private int travelers = 1;

    @NotBlank(message = "budgetLevel is required")
    private String budgetLevel; // BUDGET, MODERATE, LUXURY

    private List<String> preferences;

    private String notes;
}
