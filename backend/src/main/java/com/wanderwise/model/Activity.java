package com.wanderwise.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity {
    private String id;
    private String time;          // e.g. "09:00"
    private String title;
    private String description;
    private String category;      // sightseeing, food, transport, leisure, culture...
    private Double estimatedCost;
    private Integer orderIndex;   // position within the day, used by the drag-and-drop planner
}
