// Exercises the already-implemented HTTP contract, not the candidate's fixes.
// Requires a running backend and Node.js 22+.
import assert from 'node:assert/strict'
const base = process.env.API_BASE_URL ?? 'http://127.0.0.1:8080'
async function request(path, method='GET', body) {
  const response = await fetch(base+path,{method,headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined})
  const payload=await response.json()
  return { status:response.status, payload }
}
let ready=false
for(let i=0;i<90;i++){
  try{const r=await request('/api/health');if(r.status===200&&r.payload.status==='UP'){ready=true;break}}catch{}
  await new Promise(r=>setTimeout(r,1000))
}
assert.ok(ready,'Backend health check did not become ready')
const alarms=await request('/api/alarms')
assert.equal(alarms.status,200)
assert.equal(alarms.payload.length,3)
assert.equal(alarms.payload.find(a=>a.id===1)?.active,true)
const pending=await request('/api/alarms?ack=pending')
assert.equal(pending.payload.length,2)
const confirmed=await request('/api/alarms/1/ack','PATCH',{operator:'自动化巡检'})
assert.equal(confirmed.status,200)
assert.equal(confirmed.payload.acknowledgedBy,'自动化巡检')
const after=await request('/api/alarms/1')
assert.equal(after.payload.acknowledgedBy,'自动化巡检')
const eventsBefore=await request('/api/events')
const incoming={sourceId:'SMOKE-SOURCE',eventId:'HTTP-SMOKE-1',signalCode:'SIG-HTTP-1',deviceName:'测试设备',message:'温度超限',severity:'HIGH',eventType:'RAISED',occurredAt:'2026-10-20T10:30:00'}
const inserted=await request('/api/events','POST',incoming)
assert.equal(inserted.status,200)
assert.equal(inserted.payload.applied,true)
const eventsAfter=await request('/api/events')
assert.equal(eventsAfter.payload.length,eventsBefore.payload.length+1)
const cleared=await request('/api/events','POST',{...incoming,eventId:'HTTP-SMOKE-2',eventType:'CLEARED',occurredAt:'2026-10-20T10:32:00'})
assert.equal(cleared.status,200)
const closed=await request('/api/alarms/'+inserted.payload.alarmId)
assert.equal(closed.payload.active,false)
console.log('PASS: health, seed listing, filters, ack endpoint, event RAISED/CLEARED, persistence over HTTP')
