package com.UberDragons.project.uber.UberApp;

import com.UberDragons.project.uber.UberApp.services.EmailSenderService;
import com.UberDragons.project.uber.UberApp.services.impl.EmailSenderServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class UberAppApplicationTests {

	@Autowired
    EmailSenderService emailSenderService;


}

