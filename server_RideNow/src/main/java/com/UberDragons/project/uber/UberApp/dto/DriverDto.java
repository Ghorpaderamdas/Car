package com.UberDragons.project.uber.UberApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DriverDto {

    private Long Id;
    private UserDto user;
    private Double rating;
    private Boolean available;
    private String vehicleId;
}
