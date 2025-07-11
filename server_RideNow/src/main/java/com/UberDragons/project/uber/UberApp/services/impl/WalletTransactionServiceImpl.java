package com.UberDragons.project.uber.UberApp.services.impl;

import com.UberDragons.project.uber.UberApp.entities.WalletTransaction;
import com.UberDragons.project.uber.UberApp.repositories.WalletTransactionRepository;
import com.UberDragons.project.uber.UberApp.services.WalletTransactionService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WalletTransactionServiceImpl implements WalletTransactionService {

    private final WalletTransactionRepository walletTransactionRepository;
    private final ModelMapper modelMapper;

    @Override
    public void createNewWalletTransaction(WalletTransaction walletTransaction) {
        walletTransactionRepository.save(walletTransaction);
    }

}
