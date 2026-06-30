import { computed, type Ref } from 'vue'
import type { GithubRepositoryInfo } from '../../../stores/dashboard.ts'
import type { AttentionItem, ProfileItem, RepositoryEvent, SummaryCard, TimelineSignal } from './types.ts'

const numberFormatter = new Intl.NumberFormat('en-US')
const compactNumberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
})

export function useRepositoryOverview(repository: Readonly<Ref<GithubRepositoryInfo | null>>) {
  const repositoryName = computed(() => {
    const repo = repository.value

    return repo?.full_name ?? repo?.name ?? 'GitHub repository'
  })

  const repositorySummary = computed(() => {
    const repo = repository.value

    if (!repo) {
      return 'Live repository metadata for the frontend platform workspace.'
    }

    const parts = [
      repo.language ?? 'No primary language',
      repo.default_branch ? `${repo.default_branch} branch` : null,
      repo.visibility ?? (repo.private ? 'private' : 'public'),
    ].filter(Boolean)

    return parts.join(' · ')
  })

  const headerPill = computed(() => {
    const repo = repository.value

    if (!repo) {
      return 'GitHub'
    }

    return repo.visibility ?? (repo.private ? 'Private' : 'Public')
  })

  const summaryCards = computed<SummaryCard[]>(() => {
    const repo = repository.value

    if (!repo) {
      return []
    }

    const openWork = repo.open_issues_count
    const stars = repo.stargazers_count
    const forks = repo.forks_count
    const watchers = repo.watchers_count ?? repo.subscribers_count

    return [
      {
        eyebrow: 'Repository',
        meta: repo.default_branch ? `Default branch: ${repo.default_branch}` : 'Default branch unknown',
        tone: 'brand',
        value: repo.name ?? repositoryName.value,
      },
      {
        eyebrow: 'Activity',
        meta: `Last updated ${formatRelativeDate(repo.updated_at)}`,
        tone: 'green',
        value: formatRelativeDate(repo.pushed_at),
      },
      {
        eyebrow: 'Open Work',
        meta: 'GitHub issues and pull requests',
        tone: 'amber',
        value: openWork === undefined ? '—' : formatNumber(openWork),
      },
      {
        eyebrow: 'Popularity',
        meta: `${formatCompactNumber(forks)} forks · ${formatCompactNumber(watchers)} watchers`,
        tone: 'blue',
        value: `${formatCompactNumber(stars)} stars`,
      },
    ]
  })

  const timelineSignals = computed<TimelineSignal[]>(() => {
    const repo = repository.value
    const signals = [
      { date: repo?.created_at, label: 'Created', tone: 'brand' as const },
      { date: repo?.updated_at, label: 'Updated', tone: 'amber' as const },
      { date: repo?.pushed_at, label: 'Pushed', tone: 'green' as const },
    ]
      .filter((signal): signal is { date: string; label: string; tone: TimelineSignal['tone'] } =>
        Boolean(signal.date),
      )
      .sort((first, second) => new Date(first.date).getTime() - new Date(second.date).getTime())

    const denominator = Math.max(signals.length - 1, 1)

    return signals.map((signal, index) => {
      const freshness = getFreshnessScore(signal.date)
      const pointX = 8 + (index / denominator) * 84
      const pointY = 12 + (100 - freshness) * 0.68

      return {
        ...signal,
        linePoint: `${pointX},${pointY}`,
        relativeDate: formatRelativeDate(signal.date),
        style: {
          '--point-x': `${pointX}%`,
          '--point-y': `${pointY}%`,
        },
      }
    })
  })

  const sparklinePoints = computed(() =>
    timelineSignals.value.map((signal) => signal.linePoint).join(' '),
  )

  const attentionItems = computed<AttentionItem[]>(() => {
    const repo = repository.value

    if (!repo) {
      return []
    }

    const items: AttentionItem[] = []
    const openWork = repo.open_issues_count ?? 0

    if (repo.disabled) {
      items.push({
        badge: 'danger',
        description: 'The repository is disabled in GitHub.',
        title: 'Repository disabled',
        tone: 'danger',
      })
    }

    if (repo.archived) {
      items.push({
        badge: 'danger',
        description: 'Archived repositories are read-only.',
        title: 'Repository archived',
        tone: 'danger',
      })
    }

    if (openWork > 0) {
      items.push({
        badge: 'triage',
        description: 'GitHub counts open issues and pull requests in this field.',
        title: `${formatNumber(openWork)} open issues/PRs`,
        tone: 'warning',
      })
    }

    if (!repo.license) {
      items.push({
        badge: 'info',
        description: 'Add a license if the repository should be reused externally.',
        title: 'License is not set',
        tone: 'info',
      })
    }

    if (!repo.topics?.length) {
      items.push({
        badge: 'info',
        description: 'Topics make the repository easier to discover and group.',
        title: 'Topics are empty',
        tone: 'info',
      })
    }

    if (items.length === 0) {
      items.push({
        badge: 'clear',
        description: 'No repository-level warning signals in the current response.',
        title: 'No attention items',
        tone: 'success',
      })
    }

    return items.slice(0, 4)
  })

  const recentEvents = computed<RepositoryEvent[]>(() => {
    const repo = repository.value
    const events = [
      {
        date: repo?.pushed_at,
        label: 'Latest push',
        status: 'Pushed',
        tone: 'green' as const,
        value: repo?.default_branch ?? 'Repository branch',
      },
      {
        date: repo?.updated_at,
        label: 'Repository update',
        status: 'Updated',
        tone: 'amber' as const,
        value: repositoryName.value,
      },
      {
        date: repo?.created_at,
        label: 'Repository created',
        status: 'Created',
        tone: 'brand' as const,
        value: repo?.owner?.login ?? 'GitHub',
      },
    ]

    return events
      .filter((event): event is Omit<RepositoryEvent, 'formattedDate'> & { date: string } =>
        Boolean(event.date),
      )
      .sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime())
      .map((event) => ({
        formattedDate: formatDate(event.date),
        label: event.label,
        status: event.status,
        tone: event.tone,
        value: event.value,
      }))
  })

  const profileItems = computed<ProfileItem[]>(() => {
    const repo = repository.value

    if (!repo) {
      return []
    }

    return [
      {
        label: 'Owner',
        value: repo.owner?.login ?? 'Unknown',
      },
      {
        label: 'Language',
        value: repo.language ?? 'Not specified',
      },
      {
        label: 'License',
        value: repo.license?.spdx_id ?? repo.license?.name ?? 'Not set',
      },
      {
        label: 'Repository size',
        value: repo.size === undefined ? 'Unknown' : `${formatNumber(repo.size)} KB`,
      },
      {
        label: 'Fork status',
        value: repo.fork ? 'Forked repository' : 'Source repository',
      },
    ]
  })

  return {
    attentionItems,
    headerPill,
    profileItems,
    recentEvents,
    repositoryName,
    repositorySummary,
    sparklinePoints,
    summaryCards,
    timelineSignals,
  }
}

function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return '—'
  }

  return numberFormatter.format(value)
}

function formatCompactNumber(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return '—'
  }

  return compactNumberFormatter.format(value)
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return 'Unknown date'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date'
  }

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function formatRelativeDate(value: string | null | undefined) {
  if (!value) {
    return 'unknown'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'unknown'
  }

  const diffMs = Date.now() - date.getTime()
  const diffDays = Math.max(0, Math.floor(diffMs / 86_400_000))

  if (diffDays === 0) {
    return 'today'
  }

  if (diffDays === 1) {
    return 'yesterday'
  }

  if (diffDays < 30) {
    return `${diffDays}d ago`
  }

  if (diffDays < 365) {
    return `${Math.floor(diffDays / 30)}mo ago`
  }

  return `${Math.floor(diffDays / 365)}y ago`
}

function getFreshnessScore(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 18
  }

  const diffDays = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86_400_000))

  return Math.max(18, 92 - Math.min(diffDays * 3, 74))
}
