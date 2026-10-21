<template>
  <div class="shell">
    <header class="topbar">
      <div class="identity">
        <span class="logo">PA</span>
        <div>
          <strong>Power Operations</strong>
          <small>告警事件管理</small>
        </div>
      </div>
      <div class="api-state">
        <span :class="['dot', online ? 'ok' : 'bad']"></span>
        {{ online ? 'API 已连接' : 'API 未连接' }}
      </div>
    </header>
    <main>
      <section class="intro">
        <div>
          <div class="eyebrow">EQUIPMENT ALARM REGISTRY</div>
          <h1>设备告警台账</h1>
          <p>监测事件、告警状态及运行人员确认记录。</p>
        </div>
        <div class="top-actions">
          <button class="button light" :disabled="loading" @click="load">刷新列表</button>
          <button class="button primary" :disabled="sending" @click="sendSample">{{ sending ? '发送中…' : '发送示例事件' }}</button>
        </div>
      </section>
      <div class="metrics">
        <div class="metric">
          <small>告警记录</small>
          <strong>{{ alarms.length }}</strong>
          <span>当前筛选结果</span>
        </div>
        <div class="metric">
          <small>未恢复</small>
          <strong>{{ activeCount }}</strong>
          <span>当前筛选结果</span>
        </div>
        <div class="metric">
          <small>未确认</small>
          <strong>{{ pendingCount }}</strong>
          <span>当前筛选结果</span>
        </div>
        <div class="metric">
          <small>已接收事件</small>
          <strong>{{ eventCount }}</strong>
          <span>数据库事件记录</span>
        </div>
      </div>
      <section class="panel">
        <div class="section-head">
          <div>
            <h2>告警列表</h2>
            <p>人工确认与异常恢复分别记录</p>
          </div>
          <div class="filter" role="group" aria-label="确认状态筛选">
            <button v-for="item in filters" :key="item.key" :class="{ selected: filter === item.key }" @click="changeFilter(item.key)">{{ item.label }}</button>
          </div>
        </div>
        <div v-if="notice" :class="['notice', noticeError ? 'error' : '']">
          {{ notice }}
          <button @click="notice = ''" aria-label="关闭提示">×</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>告警 ID / 来源</th>
                <th>设备 / 信号</th>
                <th>告警内容</th>
                <th>级别</th>
                <th>运行状态</th>
                <th>确认状态</th>
                <th>发生时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="alarm in alarms" :key="alarm.id">
                <td>
                  <strong>#{{ alarm.id }}</strong>
                  <small class="muted">{{ alarm.sourceId }}</small>
                </td>
                <td>
                  <strong>{{ alarm.deviceName }}</strong>
                  <small class="muted">{{ alarm.signalCode }}</small>
                </td>
                <td>{{ alarm.message }}</td>
                <td>
                  <span :class="['severity', alarm.severity.toLowerCase()]">{{ alarm.severity }}</span>
                </td>
                <td>
                  <span :class="['status', alarm.active ? 'alert' : 'clear']">{{ alarm.active ? '告警中' : '已恢复' }}</span>
                </td>
                <td>
                  <span :class="['status', alarm.acknowledgedAt ? 'done' : 'pending']">{{ alarm.acknowledgedAt ? '已确认' : '未确认' }}</span>
                  <small v-if="alarm.acknowledgedBy" class="muted">{{ alarm.acknowledgedBy }}</small>
                </td>
                <td>{{ timeText(alarm.raisedAt) }}</td>
                <td>
                  <button class="link" :disabled="!!alarm.acknowledgedAt" @click="showAck(alarm)">{{ alarm.acknowledgedAt ? '已确认' : '确认' }}</button>
                </td>
              </tr>
              <tr v-if="!loading && alarms.length===0">
                <td colspan="8" class="empty">当前筛选条件下没有告警记录</td>
              </tr>
              <tr v-if="loading">
                <td colspan="8" class="empty">加载中…</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <p class="footnote">本地模拟环境 · H2 内存数据库 · 重启后端恢复初始数据</p>
    </main>
    <div v-if="ackTarget" class="overlay" @click.self="ackTarget = null">
      <div class="dialog" role="dialog" aria-modal="true" aria-label="人工确认告警">
        <div class="dialog-head">
          <h3>确认告警 #{{ ackTarget.id }}</h3>
          <button class="dismiss" @click="ackTarget = null">×</button>
        </div>
        <p class="dialog-message">{{ ackTarget.deviceName }} · {{ ackTarget.message }}</p>
        <label for="operator">确认人</label>
        <input id="operator" v-model="operator" maxlength="40" placeholder="例如：值班员张工" @keyup.enter="submitAck" />
        <div class="dialog-actions">
          <button class="button light" @click="ackTarget = null">取消</button>
          <button class="button primary" :disabled="ackBusy" @click="submitAck">{{ ackBusy ? '保存中…' : '确认' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { acknowledgeAlarm, checkHealth, getAlarms, getEvents, messageOf, postEvent } from './api'
import type { Alarm, IncomingEvent } from './types'

type Filter = 'all' | 'pending' | 'done'

const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '未确认' },
  { key: 'done', label: '已确认' },
]

const alarms = ref<Alarm[]>([])
const filter = ref<Filter>('all')
const online = ref(false)
const loading = ref(false)
const sending = ref(false)
const ackBusy = ref(false)
const eventCount = ref(0)
const notice = ref('')
const noticeError = ref(false)
const ackTarget = ref<Alarm | null>(null)
const operator = ref('')

const activeCount = computed(() => alarms.value.filter(alarm => alarm.active).length)
const pendingCount = computed(() => alarms.value.filter(alarm => !alarm.acknowledgedAt).length)

function timeText(value: string | null) {
  return value ? value.replace('T', ' ').slice(0, 19) : '-'
}

function message(text: string, error = false) {
  notice.value = text
  noticeError.value = error
}

async function load() {
  loading.value = true
  try {
    const [data, events] = await Promise.all([getAlarms(filter.value), getEvents()])
    alarms.value = data
    eventCount.value = events.length
  } catch (error) {
    message(messageOf(error), true)
  } finally {
    loading.value = false
  }
}

function changeFilter(value: Filter) {
  filter.value = value
  void load()
}

function showAck(alarm: Alarm) {
  ackTarget.value = alarm
  operator.value = ''
}

async function submitAck() {
  if (!ackTarget.value || ackBusy.value) return

  const name = operator.value.trim()
  if (!name) {
    message('请填写确认人', true)
    return
  }

  ackBusy.value = true
  try {
    await acknowledgeAlarm(ackTarget.value.id, name)
    ackTarget.value = null
    await load()
    message('告警已确认')
  } catch (error) {
    message(messageOf(error), true)
  } finally {
    ackBusy.value = false
  }
}

const sample: IncomingEvent = {
  sourceId: 'QL-110KV',
  eventId: 'EVT-DEMO-701',
  signalCode: 'TR-02-TEMP',
  deviceName: '2号主变',
  message: '2号主变油温越限',
  severity: 'HIGH',
  eventType: 'RAISED',
  occurredAt: '2026-10-20T10:30:00',
}

async function sendSample() {
  sending.value = true
  try {
    const result = await postEvent(sample)
    await load()
    message(
      result.applied
        ? `事件 ${sample.eventId} 已接收`
        : `事件 ${sample.eventId} 已处理，本次为重复推送`,
    )
  } catch (error) {
    message(messageOf(error), true)
  } finally {
    sending.value = false
  }
}

onMounted(async () => {
  try {
    online.value = await checkHealth()
  } catch {
    online.value = false
  }
  await load()
})
</script>
