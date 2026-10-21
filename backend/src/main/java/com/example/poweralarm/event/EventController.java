package com.example.poweralarm.event;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/events")
public class EventController {
 private final EventService service;
 public EventController(EventService service){this.service=service;}
 @GetMapping public List<SourceEvent> list(){return service.events();}
 @PostMapping public EventResult receive(@Valid @RequestBody IncomingEvent body){return service.receive(body);}
}
