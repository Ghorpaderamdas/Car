package com.UberDragons.project.uber.UberApp.strategies.impl;

import com.UberDragons.project.uber.UberApp.entities.Driver;
import com.UberDragons.project.uber.UberApp.entities.RideRequest;
import com.UberDragons.project.uber.UberApp.repositories.DriverRepository;
import com.UberDragons.project.uber.UberApp.strategies.DriverMatchingStrategy;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DriverMatchingNearestDriverStrategy implements DriverMatchingStrategy {

    private final DriverRepository driverRepository;

    public DriverMatchingNearestDriverStrategy(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    @Override
    public List<Driver> findMatchingDriver(RideRequest rideRequest) {
        return driverRepository.findTenNearestDrivers(rideRequest.getPickupLocation());
    }
}
