package com.example.poweralarm.event;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
public record IncomingEvent(
 @NotBlank String sourceId,
 @NotBlank String eventId,
 @NotBlank String signalCode,
 @NotBlank String deviceName,
 @NotBlank String message,
 @NotBlank String severity,
 @NotBlank @Pattern(regexp="RAISED|CLEARED",message="事件类型仅支持RAISED或CLEARED") String eventType,
 @NotNull LocalDateTime occurredAt
) {}
