package com.example.poweralarm.alarm;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/alarms")
public class AlarmController {

    private final AlarmService service;

    public AlarmController(AlarmService service) {
        this.service = service;
    }

    @GetMapping
    public List<Alarm> list(@RequestParam(defaultValue = "all") String ack) {
        return service.list(ack);
    }

    @GetMapping("/{id}")
    public Alarm one(@PathVariable long id) {
        return service.require(id);
    }

    @PatchMapping("/{id}/ack")
    public Alarm acknowledge(@PathVariable long id, @Valid @RequestBody AckRequest request) {
        return service.acknowledge(id, request);
    }
}
