# Architecture

```text
Vue / Axios  →  /api (Vite proxy)
                     ↓
Spring Boot Controller
                     ↓
AlarmService / EventService
                     ↓
MyBatis-Plus Mapper → H2
```

## 关键文件

- `backend/src/main/java/com/example/poweralarm/alarm/`：告警实体、查询和确认
- `backend/src/main/java/com/example/poweralarm/event/`：事件入库与业务效果
- `backend/src/main/resources/schema.sql`：数据库表结构
- `backend/src/main/resources/data.sql`：初始模拟数据
- `frontend/src/App.vue`：列表、筛选和交互
- `frontend/src/api.ts`：Axios 请求
- `fixtures/events.json`：事件回放输入

## API

| Method | Path | Result |
| --- | --- | --- |
| GET | `/api/health` | 健康状态 |
| GET | `/api/alarms?ack=all\|pending\|done` | 告警列表 |
| GET | `/api/alarms/{id}` | 单条告警 |
| PATCH | `/api/alarms/{id}/ack` | 人工确认，body: `{"operator":"张工"}` |
| GET | `/api/events` | 事件接收记录 |
| POST | `/api/events` | 事件接收，返回 `eventRecordId, alarmId, applied` |

收到新的事件时 `applied=true`；同一事件重试且未重新执行业务效果时 `applied=false`。

前端直接以 API 返回的数据更新页面。重启后端后 H2 初始数据恢复。
