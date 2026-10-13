package com.wanderwise.service;

import com.wanderwise.dto.TripRequest;
import com.wanderwise.exception.TripNotFoundException;
import com.wanderwise.model.Day;
import com.wanderwise.model.Trip;
import com.wanderwise.repository.TripRepository;
import com.wanderwise.util.TokenGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final OpenAiService openAiService;
    private final WeatherService weatherService;

    public Trip createTrip(TripRequest request) {
        OpenAiService.GeneratedPlan plan = openAiService.generateItineraryAndBudget(request);
        List<Day> days = plan.days();

        Trip trip = Trip.builder()
                .token(uniqueToken())
                .destination(request.getDestination())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .travelers(request.getTravelers())
                .budgetLevel(request.getBudgetLevel().toUpperCase())
                .preferences(request.getPreferences())
                .notes(request.getNotes())
                .days(days)
                .weatherForecast(weatherService.getForecast(request.getDestination(), request.getStartDate(), request.getEndDate()))
                .budgetEstimate(plan.budget())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        return tripRepository.save(trip);
    }

    public Trip getByToken(String token) {
        return tripRepository.findByToken(token)
                .orElseThrow(() -> new TripNotFoundException(token));
    }

    public Trip updateDays(String token, List<Day> days) {
        Trip trip = getByToken(token);
        trip.setDays(days);
        trip.setUpdatedAt(Instant.now());
        return tripRepository.save(trip);
    }

    private String uniqueToken() {
        String token;
        do {
            token = TokenGenerator.generate();
        } while (tripRepository.existsByToken(token));
        return token;
    }
}
