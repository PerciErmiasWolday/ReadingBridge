import { Outlet } from 'react-router-dom'
import { SideNav } from './SideNav'
import { SkipLink } from './SkipLink'

/** Shell for every route except the reader: left navigation plus content. */
export function AppShell() {
  return (
    <div className="min-h-screen bg-paper text-ink md:flex">
      <SkipLink />
      <SideNav />
      <main id="main" tabIndex={-1} className="min-w-0 flex-1 px-6 py-10 md:px-16 md:py-16">
        <Outlet />
      </main>
    </div>
  )
}
