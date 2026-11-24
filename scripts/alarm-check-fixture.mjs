import assert from 'node:assert/strict'
import { request, success, unique } from './check-http.mjs'

export function eventFixture() {
  const token = unique()
  return { sourceId: 'CHECK-' + token, eventId: 'RAISE-' + token, signalCode: 'SIG-' + token,
    deviceName: '验收模拟设备', message: '验收模拟告警', severity: 'HIGH',
    eventType: 'RAISED', occurredAt: '2026-10-20T10:30:11' }
}

export async function postEvent(event) {
  return success(await request('/api/events', 'POST', event), 'post event')
}

export async function readAlarm(id) {
  return success(await request('/api/alarms/' + id), 'read alarm')
}

export async function raiseAlarm(event = eventFixture()) {
  const result = await postEvent(event)
  assert.equal(result.applied, true)
  assert.ok(result.alarmId != null, 'alarm id missing')
  const alarm = await readAlarm(result.alarmId)
  assert.equal(alarm.active, true)
  assert.equal(alarm.recoveredAt, null)
  return { event, id: result.alarmId }
}

export async function clearAlarm(event, id) {
  const occurredAt = '2026-10-20T10:32:19'
  const result = await postEvent({ ...event, eventId: 'CLEAR-' + unique(), eventType: 'CLEARED', occurredAt })
  assert.equal(result.applied, true)
  assert.equal(result.alarmId, id, 'clear event must link to the same alarm')
  const alarm = await readAlarm(id)
  assert.equal(alarm.active, false, 'cleared alarm still active')
  assert.equal(alarm.recoveredAt, occurredAt)
  return alarm
}

export async function acknowledge(id, operator) {
  return success(await request('/api/alarms/' + id + '/ack', 'PATCH', { operator }), 'acknowledge')
}

export async function alarmList(ack = 'all') {
  const list = success(await request('/api/alarms?ack=' + ack), 'alarm list')
  assert.ok(Array.isArray(list), 'alarm list must be an array')
  return list
}

export async function eventList() {
  const list = success(await request('/api/events'), 'event list')
  assert.ok(Array.isArray(list), 'event list must be an array')
  return list
}
