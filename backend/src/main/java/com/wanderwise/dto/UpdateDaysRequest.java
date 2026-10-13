package com.wanderwise.dto;

import com.wanderwise.model.Day;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class UpdateDaysRequest {
    @NotNull
    private List<Day> days;
}
