import type { CSSProperties } from 'vue'

export type SummaryCard = {
  eyebrow: string
  meta: string
  tone: 'brand' | 'green' | 'amber' | 'blue'
  value: string
}

export type TimelineSignal = {
  date: string
  label: string
  linePoint: string
  relativeDate: string
  style: CSSProperties
  tone: 'brand' | 'green' | 'amber'
}

export type AttentionItem = {
  badge: string
  description: string
  tone: 'danger' | 'warning' | 'info' | 'success'
  title: string
}

export type RepositoryEvent = {
  formattedDate: string
  label: string
  status: string
  tone: 'brand' | 'green' | 'amber'
  value: string
}

export type ProfileItem = {
  label: string
  value: string
}
