package com.UberDragons.project.uber.UberApp.services;

import com.UberDragons.project.uber.UberApp.dto.DriverDto;
import com.UberDragons.project.uber.UberApp.dto.RideDto;
import com.UberDragons.project.uber.UberApp.dto.RiderDto;
import com.UberDragons.project.uber.UberApp.entities.Driver; // Use your custom Driver class
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public interface DriverService {

    RideDto acceptRide(Long rideRequestId);

    RideDto cancelRide(Long rideId);

    RideDto startRide(Long rideId, String otp);

    RideDto endRide(Long rideId);

    RiderDto rateRider(Long rideId, Integer rating);

    DriverDto getMyProfile();

    List<RideDto> getAllMyRides();

    Page<RideDto> getAllMyRides(PageRequest pageRequest);

    Driver getCurrentDriver();

    Driver updateDriverAvailability(Driver driver, boolean available);

    Driver createNewDriver(Driver driver);
}
