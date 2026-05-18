export type RemoteApp = {
  id: string
  title: string
  path: string
  remoteEntry: string
  showHostNavbar?: boolean
}

export const remoteApps: RemoteApp[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    path: '/dashboard',
    remoteEntry: 'http://localhost:8001/assets/remoteEntry.js',
    showHostNavbar: true,
  },
]
