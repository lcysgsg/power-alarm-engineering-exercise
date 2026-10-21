package com.example.poweralarm.event;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.poweralarm.alarm.*;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
public class EventService {
 private final SourceEventMapper eventMapper;
 private final AlarmMapper alarmMapper;
 public EventService(SourceEventMapper eventMapper,AlarmMapper alarmMapper){this.eventMapper=eventMapper;this.alarmMapper=alarmMapper;}
 @Transactional(readOnly=true)
 public List<SourceEvent> events(){return eventMapper.selectList(new LambdaQueryWrapper<SourceEvent>().orderByDesc(SourceEvent::getId));}
 @Transactional
 public EventResult receive(IncomingEvent input){
    SourceEvent event=new SourceEvent();
    event.setSourceId(input.sourceId());event.setEventId(input.eventId());event.setSignalCode(input.signalCode());
    event.setEventType(input.eventType());event.setOccurredAt(input.occurredAt());
    eventMapper.insert(event);
    Long alarmId=null;
    if("RAISED".equals(input.eventType())){
       Alarm alarm=new Alarm();
       alarm.setSourceId(input.sourceId());alarm.setSignalCode(input.signalCode());alarm.setDeviceName(input.deviceName());
       alarm.setMessage(input.message());alarm.setSeverity(input.severity());alarm.setRaisedAt(input.occurredAt());
       alarmMapper.insert(alarm);
       alarmId=alarm.getId();
    }else{
       Alarm activeAlarm=alarmMapper.selectOne(new LambdaQueryWrapper<Alarm>()
          .eq(Alarm::getSourceId,input.sourceId()).eq(Alarm::getSignalCode,input.signalCode())
          .isNull(Alarm::getRecoveredAt).orderByDesc(Alarm::getId).last("LIMIT 1"));
       if(activeAlarm!=null){
          activeAlarm.setRecoveredAt(input.occurredAt());
          alarmMapper.updateById(activeAlarm);
          alarmId=activeAlarm.getId();
       }
    }
    return new EventResult(event.getId(),alarmId,true);
 }
}
