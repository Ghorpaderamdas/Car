package com.UberDragons.project.uber.UberApp.services;

import com.UberDragons.project.uber.UberApp.entities.RideRequest;

public interface RideRequestService {

    RideRequest findRideRequestById(Long rideRequestId);

    void update(RideRequest rideRequest);
}
