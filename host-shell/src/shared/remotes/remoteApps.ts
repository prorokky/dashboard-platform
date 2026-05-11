type RemoteApp = {
  id: 'dashboard' | 'events' | 'settings'
  title: string
  path: string
  remoteEntry: string
}

export const remoteApps: RemoteApp[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    path: '/dashboard',
    remoteEntry: 'http://localhost:8001/assets/remoteEntry.js',
  },
]
