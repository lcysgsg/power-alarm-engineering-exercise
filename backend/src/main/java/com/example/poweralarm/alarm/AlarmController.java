package com.example.poweralarm.alarm;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/alarms")
public class AlarmController {
    private final AlarmService service;
    public AlarmController(AlarmService service){this.service=service;}
    @GetMapping public List<Alarm> list(@RequestParam(defaultValue="all") String ack){return service.list(ack);}
    @GetMapping("/{id}") public Alarm one(@PathVariable long id){return service.require(id);}
    @PatchMapping("/{id}/ack") public Alarm acknowledge(@PathVariable long id,@Valid @RequestBody AckRequest request){return service.acknowledge(id,request);}
}
