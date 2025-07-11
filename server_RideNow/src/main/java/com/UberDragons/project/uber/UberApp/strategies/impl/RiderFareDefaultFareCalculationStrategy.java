package com.UberDragons.project.uber.UberApp.strategies.impl;

import com.UberDragons.project.uber.UberApp.entities.RideRequest;
import com.UberDragons.project.uber.UberApp.services.DistanceService;
import com.UberDragons.project.uber.UberApp.strategies.RideFareCalculationStrategy;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Point;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Primary
public class RiderFareDefaultFareCalculationStrategy implements RideFareCalculationStrategy {

    private final DistanceService distanceService;

    @Override
    public double calculateFare(RideRequest rideRequest) {
        Point pickupLocation = rideRequest.getPickupLocation();
        Point dropOffLocation = rideRequest.getDropOffLocation();
        double distance = distanceService.calculateDistance(pickupLocation, dropOffLocation);
        return distance * RIDE_FARE_MULTIPLIER;
    }
}
