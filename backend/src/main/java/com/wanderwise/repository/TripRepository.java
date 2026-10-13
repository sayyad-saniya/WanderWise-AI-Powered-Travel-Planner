package com.wanderwise.repository;

import com.wanderwise.model.Trip;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface TripRepository extends MongoRepository<Trip, String> {
    Optional<Trip> findByToken(String token);
    boolean existsByToken(String token);
}
