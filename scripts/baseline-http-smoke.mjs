// Existing API contract only. The known A/B defects are checked separately.
import assert from 'node:assert/strict'
import { runChecks } from './check-http.mjs'
import { raiseAlarm, clearAlarm, acknowledge, readAlarm, alarmList, eventList } from './alarm-check-fixture.mjs'

await runChecks([
  ['B0 list alarms / events', async () => {
    await alarmList()
    await eventList()
  }],
  ['B1 normal raised / cleared event / persistence', async () => {
    const { event, id } = await raiseAlarm()
    const rows = await eventList()
    assert.ok(rows.some(r => r.sourceId === event.sourceId && r.eventId === event.eventId))
    await clearAlarm(event, id)
  }],
  ['B2 ack response / persistence / filters', async () => {
    const { id } = await raiseAlarm()
    assert.ok((await alarmList('pending')).some(a => a.id === id))
    const confirmed = await acknowledge(id, '验收人员')
    assert.equal(confirmed.acknowledgedBy, '验收人员')
    assert.ok(confirmed.acknowledgedAt)
    assert.equal((await readAlarm(id)).acknowledgedBy, '验收人员')
    assert.ok((await alarmList('done')).some(a => a.id === id))
    assert.ok(!(await alarmList('pending')).some(a => a.id === id))
    // A-specific active/recoveredAt and repeat assertions are intentionally in check-task A.
  }]
])
