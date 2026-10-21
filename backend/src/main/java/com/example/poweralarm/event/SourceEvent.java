package com.example.poweralarm.event;
import com.baomidou.mybatisplus.annotation.*;
import java.time.LocalDateTime;
@TableName("source_event")
public class SourceEvent {
 @TableId(type=IdType.AUTO) private Long id;
 private String sourceId;
 private String eventId;
 private String signalCode;
 private String eventType;
 private LocalDateTime occurredAt;
 public Long getId(){return id;} public void setId(Long v){id=v;}
 public String getSourceId(){return sourceId;} public void setSourceId(String v){sourceId=v;}
 public String getEventId(){return eventId;} public void setEventId(String v){eventId=v;}
 public String getSignalCode(){return signalCode;} public void setSignalCode(String v){signalCode=v;}
 public String getEventType(){return eventType;} public void setEventType(String v){eventType=v;}
 public LocalDateTime getOccurredAt(){return occurredAt;} public void setOccurredAt(LocalDateTime v){occurredAt=v;}
}
