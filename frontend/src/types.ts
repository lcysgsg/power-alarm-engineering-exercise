export interface Alarm {
  id: number
  sourceId: string
  signalCode: string
  deviceName: string
  message: string
  severity: string
  raisedAt: string
  recoveredAt: string | null
  acknowledgedBy: string | null
  acknowledgedAt: string | null
  active: boolean
}
export interface SourceEvent {
  id: number
  sourceId: string
  eventId: string
  signalCode: string
  eventType: string
  occurredAt: string
}
export interface IncomingEvent {
  sourceId: string
  eventId: string
  signalCode: string
  deviceName: string
  message: string
  severity: string
  eventType: 'RAISED' | 'CLEARED'
  occurredAt: string
}
export interface EventResult {
  eventRecordId: number
  alarmId: number | null
  applied: boolean
}
