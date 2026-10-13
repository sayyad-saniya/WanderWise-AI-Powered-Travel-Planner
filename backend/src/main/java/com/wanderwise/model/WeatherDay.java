package com.wanderwise.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeatherDay {
    private LocalDate date;
    private double tempMinC;
    private double tempMaxC;
    private String condition;   // e.g. "Clear", "Rain"
    private String icon;        // OpenWeatherMap icon code
}
