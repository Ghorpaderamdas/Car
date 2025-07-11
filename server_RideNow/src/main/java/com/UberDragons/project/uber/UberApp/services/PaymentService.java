package com.UberDragons.project.uber.UberApp.services;

import com.UberDragons.project.uber.UberApp.entities.Payment;
import com.UberDragons.project.uber.UberApp.entities.Ride;
import com.UberDragons.project.uber.UberApp.entities.enums.PaymentStatus;

public interface PaymentService {

    void processPayment(Ride ride);

    Payment createNewPayment(Ride ride);

    void updatePaymentStatus(Payment payment, PaymentStatus status);
}
