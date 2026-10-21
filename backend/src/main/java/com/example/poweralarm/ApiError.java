package com.example.poweralarm;
import java.time.LocalDateTime;
public record ApiError(String code, String message, LocalDateTime timestamp) { }
