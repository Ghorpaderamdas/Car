package com.UberDragons.project.uber.UberApp.controllers;

import org.springframework.data.domain.Page;
import com.UberDragons.project.uber.UberApp.dto.RatingDto;
import com.UberDragons.project.uber.UberApp.dto.DriverDto;
import com.UberDragons.project.uber.UberApp.dto.RideDto;
import com.UberDragons.project.uber.UberApp.dto.RideStartDto;
import com.UberDragons.project.uber.UberApp.dto.RiderDto;
import com.UberDragons.project.uber.UberApp.dto.RideRequestDto;
import com.UberDragons.project.uber.UberApp.services.DriverService;
import com.UberDragons.project.uber.UberApp.services.RideRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/drivers")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = true)
public class DriverController {

    private final DriverService driverService;
    private final RideRequestService rideRequestService;

    @PostMapping("/acceptRide/{rideRequestId}")
    public ResponseEntity<RideDto> acceptRide(@PathVariable Long rideRequestId) {
        return ResponseEntity.ok(driverService.acceptRide(rideRequestId));
    }

    @PostMapping("/startRide/{rideRequestId}")
    public ResponseEntity<RideDto> startRide(@PathVariable Long rideRequestId,
                                             @RequestBody RideStartDto rideStartDto) {
        return ResponseEntity.ok(driverService.startRide(rideRequestId, rideStartDto.getOtp()));
    }

    @PostMapping("/endRide/{rideId}")
    public ResponseEntity<RideDto> endRide(@PathVariable Long rideId) {
        return ResponseEntity.ok(driverService.endRide(rideId));
    }

    @PostMapping("/cancelRide/{rideId}")
    public ResponseEntity<RideDto> cancelRide(@PathVariable Long rideId) {
        return ResponseEntity.ok(driverService.cancelRide(rideId));
    }

    @PostMapping("/rateRider")
    public ResponseEntity<RiderDto> rateRider(@RequestBody RatingDto ratingDto) {
        return ResponseEntity.ok(driverService.rateRider(ratingDto.getRideId(), ratingDto.getRating()));
    }

    @GetMapping("/getMyProfile")
    public ResponseEntity<DriverDto> getMyProfile() {
        return ResponseEntity.ok(driverService.getMyProfile());
    }

    @GetMapping("/getMyRides")
    public ResponseEntity<Page<RideDto>> getAllMyRides(@RequestParam(defaultValue = "0") Integer pageOffset,
                                                       @RequestParam(defaultValue = "10", required = false) Integer pageSize) {
        PageRequest pageRequest = PageRequest.of(pageOffset, pageSize,
                Sort.by(Sort.Direction.DESC, "createdTime", "id"));
        return ResponseEntity.ok(driverService.getAllMyRides(pageRequest));
    }

    @GetMapping("/availableRides")
    public ResponseEntity<List<RideRequestDto>> getAvailableRides() {
        // Mock implementation - in real app, get pending ride requests
        return ResponseEntity.ok(List.of());
    }
}