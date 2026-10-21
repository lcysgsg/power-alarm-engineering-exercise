import axios from 'axios'
import type { Alarm, EventResult, IncomingEvent, SourceEvent } from './types'
const http = axios.create({ baseURL: '/api', timeout: 10000 })
export async function checkHealth() {
  const { data } = await http.get<{ status: string }>('/health')
  return data.status === 'UP'
}
export async function getAlarms(ack: 'all' | 'pending' | 'done' = 'all') {
  const { data } = await http.get<Alarm[]>('/alarms', { params: { ack } })
  return data
}
export async function getEvents() {
  const { data } = await http.get<SourceEvent[]>('/events')
  return data
}
export async function acknowledgeAlarm(id: number, operator: string) {
  const { data } = await http.patch<Alarm>(`/alarms/${id}/ack`, { operator })
  return data
}
export async function postEvent(event: IncomingEvent) {
  const { data } = await http.post<EventResult>('/events', event)
  return data
}
export function messageOf(error: unknown) {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as { message?: string } | undefined
    return body?.message || error.message
  }
  return error instanceof Error ? error.message : '操作失败'
}
