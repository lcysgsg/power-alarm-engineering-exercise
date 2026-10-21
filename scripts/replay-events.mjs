import { readFile } from 'node:fs/promises'
const url = process.env.API_BASE_URL || 'http://localhost:8080'
const twice = process.argv.includes('--twice')
const events = JSON.parse(await readFile(new URL('../fixtures/events.json', import.meta.url), 'utf8'))
for (const round of (twice ? [1,2] : [1])) {
  for (const event of events) {
    const response = await fetch(`${url}/api/events`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    })
    console.log(`round=${round} event=${event.eventId} status=${response.status} ${await response.text()}`)
    if (!response.ok) process.exitCode = 1
  }
}
