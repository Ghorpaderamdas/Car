package com.UberDragons.project.uber.UberApp.strategies.impl;

import com.UberDragons.project.uber.UberApp.entities.Driver;
import com.UberDragons.project.uber.UberApp.entities.RideRequest;
import com.UberDragons.project.uber.UberApp.repositories.DriverRepository;
import com.UberDragons.project.uber.UberApp.strategies.DriverMatchingStrategy;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class DriverMatchingHighestRatedDriverStrategy implements DriverMatchingStrategy {  // Ensure class name is consistent

    private final DriverRepository driverRepository;

    @Override
    public List<Driver> findMatchingDriver(RideRequest rideRequest) {
        return driverRepository.findTenNearbyTopRatedDrivers(rideRequest.getPickupLocation());
    }
}


