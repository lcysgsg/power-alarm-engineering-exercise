// Shared dependency-free HTTP checks for a disposable local exercise backend.
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'

const base = (process.env.API_BASE_URL || 'http://127.0.0.1:8080').replace(/\/$/, '')
export const unique = () => randomUUID().replaceAll('-', '')

export async function request(path, method = 'GET', body) {
  const response = await fetch(base + path, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(10000)
  })
  const raw = await response.text()
  let payload
  try { payload = JSON.parse(raw) } catch { payload = raw }
  return { status: response.status, payload }
}

export function success(response, label, expected = 200) {
  if (expected === null) {
    assert.ok(response.status >= 200 && response.status < 300,
      label + ': expected 2xx, got ' + response.status + ' ' + JSON.stringify(response.payload))
  } else {
    assert.equal(response.status, expected, label + ': ' + JSON.stringify(response.payload))
  }
  return response.payload
}

export function rejected(response, label) {
  assert.ok([400, 409, 422].includes(response.status),
    label + ': expected business/validation 4xx (400/409/422), got ' + response.status)
}

export async function runChecks(cases) {
  const deadline = Date.now() + 90000
  let ready = false
  do {
    try {
      const health = await request('/api/health')
      ready = health.status === 200 && health.payload?.status === 'UP'
    } catch {}
    if (ready) break
    await new Promise(resolve => setTimeout(resolve, 1000))
  } while (Date.now() < deadline)
  if (!ready) {
    console.error('BLOCKED: backend health check not ready at ' + base)
    process.exitCode = 2
    return
  }
  let failed = 0
  for (const [name, check] of cases) {
    try {
      await check()
      console.log('PASS ' + name)
    } catch (error) {
      failed++
      console.error('FAIL ' + name + ': ' + (error?.message || String(error)))
    }
  }
  console.log('RESULT: ' + (cases.length - failed) + '/' + cases.length + ' passed')
  if (failed) process.exitCode = 1
}
