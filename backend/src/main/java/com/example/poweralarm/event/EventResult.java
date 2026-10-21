package com.example.poweralarm.event;

public record EventResult(Long eventRecordId, Long alarmId, boolean applied) {
}
