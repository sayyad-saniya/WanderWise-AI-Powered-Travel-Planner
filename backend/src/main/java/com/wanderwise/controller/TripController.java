package com.wanderwise.controller;

import com.wanderwise.dto.TripRequest;
import com.wanderwise.dto.TripResponse;
import com.wanderwise.dto.UpdateDaysRequest;
import com.wanderwise.model.Trip;
import com.wanderwise.service.TripService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @Value("${app.frontend-base-url}")
    private String frontendBaseUrl;

    @PostMapping
    public ResponseEntity<TripResponse> createTrip(@Valid @RequestBody TripRequest request) {
        Trip trip = tripService.createTrip(request);
        return ResponseEntity.ok(TripResponse.from(trip, frontendBaseUrl));
    }

    @GetMapping("/{token}")
    public ResponseEntity<TripResponse> getTrip(@PathVariable String token) {
        Trip trip = tripService.getByToken(token);
        return ResponseEntity.ok(TripResponse.from(trip, frontendBaseUrl));
    }

    @PutMapping("/{token}/days")
    public ResponseEntity<TripResponse> updateDays(@PathVariable String token,
                                                     @Valid @RequestBody UpdateDaysRequest request) {
        Trip trip = tripService.updateDays(token, request.getDays());
        return ResponseEntity.ok(TripResponse.from(trip, frontendBaseUrl));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health(HttpServletRequest req) {
        return ResponseEntity.ok("WanderWise API is running");
    }
}
