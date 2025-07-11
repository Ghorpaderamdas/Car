package com.UberDragons.project.uber.UberApp.strategies.impl;

import com.UberDragons.project.uber.UberApp.entities.Payment;
import com.UberDragons.project.uber.UberApp.entities.Wallet;
import com.UberDragons.project.uber.UberApp.entities.Driver;
import com.UberDragons.project.uber.UberApp.entities.enums.PaymentStatus;
import com.UberDragons.project.uber.UberApp.entities.enums.TransactionMethod;
import com.UberDragons.project.uber.UberApp.repositories.PaymentRepository;
import com.UberDragons.project.uber.UberApp.services.WalletService;
import com.UberDragons.project.uber.UberApp.strategies.PaymentStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CashPaymentStrategy implements PaymentStrategy {

    private final WalletService walletService;
    private final PaymentRepository paymentRepository;

    @Override
    public void processPayment(Payment payment) {
        Driver driver = payment.getRide().getDriver(); // No casting needed now

        double platformCommission = payment.getAmount() * PLATFORM_COMMISSION;

        Wallet wallet = walletService.deductMoneyFromWallet(driver.getUser(), platformCommission, null,
                payment.getRide(), TransactionMethod.RIDE);

        payment.setPaymentStatus(PaymentStatus.CONFIRMED);
        paymentRepository.save(payment);
    }
}
