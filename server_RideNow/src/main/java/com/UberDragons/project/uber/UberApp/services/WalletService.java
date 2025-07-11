package com.UberDragons.project.uber.UberApp.services;

import com.UberDragons.project.uber.UberApp.entities.Ride;
import com.UberDragons.project.uber.UberApp.entities.User;
import com.UberDragons.project.uber.UberApp.entities.Wallet;
import com.UberDragons.project.uber.UberApp.entities.enums.TransactionMethod;

public interface WalletService {

    Wallet addMoneyToWallet(User user, Double amount,
                            String transactionId, Ride ride,
                            TransactionMethod transactionMethod);

    Wallet deductMoneyFromWallet(User user, Double amount,
                                 String transactionId, Ride ride,
                                 TransactionMethod transactionMethod);

    void withdrawAllMyMoneyFromWallet();

    Wallet findWalletById(Long walletId);

    Wallet createNewWallet(User user);

    Wallet findByUser(User user);

}
