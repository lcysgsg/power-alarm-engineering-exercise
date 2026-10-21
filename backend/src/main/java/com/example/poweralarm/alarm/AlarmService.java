package com.example.poweralarm.alarm;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AlarmService {

    private final AlarmMapper mapper;

    public AlarmService(AlarmMapper mapper) {
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<Alarm> list(String ack) {
        LambdaQueryWrapper<Alarm> query = new LambdaQueryWrapper<Alarm>()
                .orderByDesc(Alarm::getId);

        if ("pending".equals(ack)) {
            query.isNull(Alarm::getAcknowledgedAt);
        } else if ("done".equals(ack)) {
            query.isNotNull(Alarm::getAcknowledgedAt);
        } else if (!"all".equals(ack)) {
            throw new IllegalArgumentException("不支持的确认状态");
        }

        return mapper.selectList(query);
    }

    @Transactional(readOnly = true)
    public Alarm require(long id) {
        Alarm alarm = mapper.selectById(id);
        if (alarm == null) {
            throw new IllegalArgumentException("告警不存在");
        }
        return alarm;
    }

    @Transactional
    public Alarm acknowledge(long id, AckRequest request) {
        Alarm alarm = require(id);
        String operator = request.operator().trim();
        if (operator.isEmpty()) {
            throw new IllegalArgumentException("确认人不能为空");
        }

        alarm.setAcknowledgedBy(operator);
        alarm.setAcknowledgedAt(LocalDateTime.now());
        alarm.setRecoveredAt(LocalDateTime.now());

        mapper.updateById(alarm);
        return alarm;
    }
}
