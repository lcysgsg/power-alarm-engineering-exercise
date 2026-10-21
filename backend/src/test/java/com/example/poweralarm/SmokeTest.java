package com.example.poweralarm;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class SmokeTest {

    @Autowired
    private MockMvc mvc;

    @Test
    void healthAndSeedData() throws Exception {
        mvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));

        mvc.perform(get("/api/alarms"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3));

        mvc.perform(get("/api/alarms?ack=pending"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void ackEndpointAvailable() throws Exception {
        mvc.perform(patch("/api/alarms/1/ack")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"operator\":\"值班员乙\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.acknowledgedBy").value("值班员乙"));
    }

    @Test
    void eventEndpointAvailable() throws Exception {
        String body = """
                {
                  "sourceId": "TEST-STATION",
                  "eventId": "EVT-T1",
                  "signalCode": "S1",
                  "deviceName": "演示设备",
                  "message": "温度越限",
                  "severity": "HIGH",
                  "eventType": "RAISED",
                  "occurredAt": "2026-10-20T10:00:00"
                }
                """;

        mvc.perform(post("/api/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.applied").value(true));
    }
}
