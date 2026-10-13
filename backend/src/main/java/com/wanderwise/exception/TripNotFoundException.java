package com.wanderwise.exception;

public class TripNotFoundException extends RuntimeException {
    public TripNotFoundException(String token) {
        super("No trip found for share link: " + token);
    }
}
