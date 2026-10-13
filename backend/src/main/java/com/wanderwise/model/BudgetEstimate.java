package com.wanderwise.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BudgetEstimate {
    private double accommodation;
    private double food;
    private double activities;
    private double transport;
    private double total;
    private String currency;
    private String notes;
}
