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
    path: '/dashboard',
    remoteEntry: 'http://localhost:8001/assets/remoteEntry.js',
    showHostNavbar: true,
    title: 'Dashboard',
  },
  {
    id: 'cases',
    path: '/cases',
    remoteEntry: 'http://localhost:8002/assets/remoteEntry.js',
    showHostNavbar: true,
    title: 'Cases',
  },
]
