// Public task checks. A is the default; B is an independently assigned alternative.
import assert from 'node:assert/strict'
import { runChecks, unique } from './check-http.mjs'
import { raiseAlarm, clearAlarm, acknowledge, readAlarm, eventFixture, postEvent, eventList, alarmList } from './alarm-check-fixture.mjs'

function sameConfirmation(actual, expected) {
  assert.equal(actual.acknowledgedBy, expected.acknowledgedBy)
  assert.equal(actual.acknowledgedAt, expected.acknowledgedAt)
}

function validConfirmation(record, operator) {
  assert.equal(record.acknowledgedBy, operator)
  assert.ok(typeof record.acknowledgedAt === 'string' && record.acknowledgedAt.trim(), 'ack time missing')
}

const taskA = [
  ['A1 first confirmation: response and persisted state', async () => {
    const { id } = await raiseAlarm()
    const response = await acknowledge(id, '首次确认人')
    validConfirmation(response, '首次确认人')
    assert.equal(response.active, true)
    assert.equal(response.recoveredAt, null)
    const stored = await readAlarm(id)
    sameConfirmation(stored, response)
    assert.equal(stored.active, true)
    assert.equal(stored.recoveredAt, null)
  }],
  ['A2 repeated confirmation preserves first metadata', async () => {
    const { id } = await raiseAlarm()
    await acknowledge(id, '确认人甲')
    const first = await readAlarm(id)
    validConfirmation(first, '确认人甲')
    const again = await acknowledge(id, '确认人乙')
    sameConfirmation(again, first)
    sameConfirmation(await readAlarm(id), first)
  }],
  ['A3 recovered but unacknowledged alarm can be acknowledged', async () => {
    const { event, id } = await raiseAlarm()
    const recovered = await clearAlarm(event, id)
    assert.equal(recovered.acknowledgedAt, null)
    const response = await acknowledge(id, '恢复后确认')
    validConfirmation(response, '恢复后确认')
    for (const record of [response, await readAlarm(id)]) {
      assert.equal(record.active, false)
      assert.equal(record.recoveredAt, recovered.recoveredAt)
      sameConfirmation(record, response)
    }
  }],
  ['A4 acknowledged alarm can still recover normally', async () => {
    const { event, id } = await raiseAlarm()
    await acknowledge(id, '先确认')
    const first = await readAlarm(id)
    validConfirmation(first, '先确认')
    const recovered = await clearAlarm(event, id)
    sameConfirmation(recovered, first)
  }]
]

async function verifyEffects(event, expected) {
  const events = (await eventList()).filter(r => r.sourceId === event.sourceId && r.eventId === event.eventId)
  const alarms = (await alarmList()).filter(a => a.sourceId === event.sourceId && a.signalCode === event.signalCode)
  assert.equal(events.length, expected, 'event row count')
  assert.equal(alarms.length, expected, 'alarm row count')
}

const taskB = [
  ['T-B1 sequential retry', async () => {
    const event = eventFixture()
    assert.equal((await postEvent(event)).applied, true)
    assert.equal((await postEvent(event)).applied, false)
    await verifyEffects(event, 1)
  }],
  ['T-B2 concurrent retry', async () => {
    const event = eventFixture()
    const results = await Promise.all([postEvent(event), postEvent(event), postEvent(event)])
    assert.equal(results.filter(r => r.applied === true).length, 1)
    assert.equal(results.filter(r => r.applied === false).length, 2)
    await verifyEffects(event, 1)
  }],
  ['T-B3 distinct sources and distinct event IDs still work', async () => {
    const event = eventFixture()
    const otherSource = { ...event, sourceId: 'OTHER-' + unique() }
    const otherEvent = { ...event, eventId: 'OTHER-' + unique(), signalCode: 'OTHER-' + unique() }
    for (const item of [event, otherSource, otherEvent]) {
      assert.equal((await postEvent(item)).applied, true)
      await verifyEffects(item, 1)
    }
  }]
]

const task = (process.argv[2] || 'A').toUpperCase()
if (!['A', 'B'].includes(task)) {
  console.error('Usage: node scripts/check-task.mjs [A|B]')
  process.exitCode = 2
} else {
  await runChecks(task === 'A' ? taskA : taskB)
}
