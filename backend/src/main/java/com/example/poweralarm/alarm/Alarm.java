package com.example.poweralarm.alarm;
import com.baomidou.mybatisplus.annotation.*;
import java.time.LocalDateTime;
@TableName("alarm_occurrence")
public class Alarm {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String sourceId;
    private String signalCode;
    private String deviceName;
    private String message;
    private String severity;
    private LocalDateTime raisedAt;
    private LocalDateTime recoveredAt;
    private String acknowledgedBy;
    private LocalDateTime acknowledgedAt;
    public Long getId(){return id;} public void setId(Long v){id=v;}
    public String getSourceId(){return sourceId;} public void setSourceId(String v){sourceId=v;}
    public String getSignalCode(){return signalCode;} public void setSignalCode(String v){signalCode=v;}
    public String getDeviceName(){return deviceName;} public void setDeviceName(String v){deviceName=v;}
    public String getMessage(){return message;} public void setMessage(String v){message=v;}
    public String getSeverity(){return severity;} public void setSeverity(String v){severity=v;}
    public LocalDateTime getRaisedAt(){return raisedAt;} public void setRaisedAt(LocalDateTime v){raisedAt=v;}
    public LocalDateTime getRecoveredAt(){return recoveredAt;} public void setRecoveredAt(LocalDateTime v){recoveredAt=v;}
    public String getAcknowledgedBy(){return acknowledgedBy;} public void setAcknowledgedBy(String v){acknowledgedBy=v;}
    public LocalDateTime getAcknowledgedAt(){return acknowledgedAt;} public void setAcknowledgedAt(LocalDateTime v){acknowledgedAt=v;}
    public boolean isActive(){return recoveredAt==null;}
}
