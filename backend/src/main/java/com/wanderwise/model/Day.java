package com.wanderwise.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Day {
    private int dayNumber;
    private LocalDate date;
    @Builder.Default
    private List<Activity> activities = new ArrayList<>();
}
