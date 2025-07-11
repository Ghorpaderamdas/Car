package com.UberDragons.project.uber.UberApp.exception;

public class ResourceNotFoundException extends RuntimeConflictException {
    public ResourceNotFoundException() {
        super();
    }

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
