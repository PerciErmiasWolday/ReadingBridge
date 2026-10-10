import { Outlet } from 'react-router-dom'
import { MainNav } from './MainNav'
import { SkipLink } from './SkipLink'
import { Wordmark } from './Wordmark'

/** Shell for every route except the reader: wordmark, horizontal navigation, content, colophon. */
export function AppShell() {
  return (
    <div className="min-h-screen text-ink">
      <SkipLink />
      <header className="mx-auto flex max-w-[78rem] flex-wrap items-center justify-between gap-x-10 gap-y-4 border-b border-line px-5 py-6 md:px-10">
        <Wordmark />
        <MainNav />
      </header>
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto max-w-[78rem] px-5 pb-20 pt-8 md:px-10 md:pt-10"
      >
        <Outlet />
      </main>
      <footer className="mx-auto flex max-w-[78rem] flex-wrap justify-between gap-4 border-t border-line px-5 py-8 text-[0.875rem] text-ink-soft md:px-10">
        <p className="m-0 font-display text-[1.25rem] text-midnight">
          Reading<span className="italic text-accent">Bridge</span>
        </p>
        <p className="m-0 max-w-md">Reading comes first. Help appears only when you ask for it.</p>
      </footer>
    </div>
  )
}
